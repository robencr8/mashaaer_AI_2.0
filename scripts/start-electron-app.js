/**
 * Mashaaer Enhanced Project
 * Electron App Launcher
 * 
 * This script launches both the Electron app and the Flask backend server in one click.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Configuration
const config = {
  // Path to the Flask backend script
  flaskPath: path.join(__dirname, '..', 'backend', 'app.py'),
  
  // Path to the Electron app directory
  electronDir: path.join(__dirname, '..', 'packaging', 'electron'),
  
  // Whether to run in development mode
  devMode: process.env.NODE_ENV === 'development',
  
  // Log file path
  logFile: path.join(__dirname, '..', 'electron-app-launcher.log')
};

// Initialize log file
fs.writeFileSync(config.logFile, `Mashaaer Electron App Launcher Log - ${new Date().toISOString()}\n\n`);

/**
 * Log a message to console and the log file
 */
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type}] ${message}`;
  
  // Log to console
  console.log(message);
  
  // Log to file
  fs.appendFileSync(config.logFile, logMessage + '\n');
}

/**
 * Start the Flask backend server
 */
function startFlaskServer() {
  log('Starting Flask backend server...', 'FLASK');
  
  // Check if Python is available
  try {
    const pythonCommand = os.platform() === 'win32' ? 'python' : 'python3';
    
    // Start Flask server
    const flaskProcess = spawn(pythonCommand, [config.flaskPath], {
      stdio: 'pipe',
      detached: false
    });
    
    // Handle Flask process events
    flaskProcess.stdout.on('data', (data) => {
      log(`Flask: ${data}`, 'FLASK');
    });
    
    flaskProcess.stderr.on('data', (data) => {
      log(`Flask Error: ${data}`, 'FLASK_ERROR');
    });
    
    flaskProcess.on('close', (code) => {
      log(`Flask server process exited with code ${code}`, 'FLASK');
    });
    
    flaskProcess.on('error', (err) => {
      log(`Failed to start Flask server: ${err}`, 'FLASK_ERROR');
    });
    
    // Return the process for later reference
    return flaskProcess;
  } catch (error) {
    log(`Error starting Flask server: ${error}`, 'ERROR');
    return null;
  }
}

/**
 * Start the Electron app
 */
function startElectronApp() {
  log('Starting Electron app...', 'ELECTRON');
  
  // Check if we're in the Electron directory
  if (!fs.existsSync(path.join(config.electronDir, 'package.json'))) {
    log(`Electron directory not found at ${config.electronDir}`, 'ERROR');
    return null;
  }
  
  try {
    // Start Electron app
    const electronProcess = spawn('npm', ['run', config.devMode ? 'dev' : 'start'], {
      stdio: 'pipe',
      cwd: config.electronDir,
      detached: false
    });
    
    // Handle Electron process events
    electronProcess.stdout.on('data', (data) => {
      log(`Electron: ${data}`, 'ELECTRON');
    });
    
    electronProcess.stderr.on('data', (data) => {
      log(`Electron Error: ${data}`, 'ELECTRON_ERROR');
    });
    
    electronProcess.on('close', (code) => {
      log(`Electron app process exited with code ${code}`, 'ELECTRON');
    });
    
    electronProcess.on('error', (err) => {
      log(`Failed to start Electron app: ${err}`, 'ELECTRON_ERROR');
    });
    
    // Return the process for later reference
    return electronProcess;
  } catch (error) {
    log(`Error starting Electron app: ${error}`, 'ERROR');
    return null;
  }
}

/**
 * Main function to start both the Flask server and Electron app
 */
function startAll() {
  log('Starting Mashaaer Enhanced Electron App...', 'INFO');
  
  // Start Flask server first
  const flaskProcess = startFlaskServer();
  
  // Wait a bit for Flask to initialize
  setTimeout(() => {
    // Then start Electron app
    const electronProcess = startElectronApp();
    
    if (!flaskProcess || !electronProcess) {
      log('Failed to start one or both components. Check the log for details.', 'ERROR');
    } else {
      log('Both Flask server and Electron app started successfully!', 'SUCCESS');
    }
    
    // Set up process termination handler
    process.on('SIGINT', () => {
      log('Received termination signal. Shutting down...', 'INFO');
      
      if (flaskProcess) {
        flaskProcess.kill();
      }
      
      if (electronProcess) {
        electronProcess.kill();
      }
      
      process.exit(0);
    });
  }, 2000); // Wait 2 seconds for Flask to initialize
}

// Start everything
startAll();