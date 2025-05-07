const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const { spawn } = require('child_process');
const LicenseManager = require('./license-manager');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;
let activationWindow;
let flaskProcess;
let licenseManager;

// Path to the Flask executable or script
const flaskPath = path.join(__dirname, '..', '..', 'backend', 'app.py');
const isDevMode = process.env.NODE_ENV === 'development';

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Mashaaer Enhanced',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  if (isDevMode) {
    // In development mode, load from React dev server
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // In production mode, load from built files
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '..', '..', 'build', 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Create menu
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            const docPath = path.join(__dirname, '..', '..', 'docs', 'HOW_TO_TEST_FEATURES.en.md');
            if (fs.existsSync(docPath)) {
              shell.openPath(docPath);
            } else {
              shell.openExternal('https://github.com/yourusername/mashaaer-enhanced-project');
            }
          }
        },
        {
          label: 'About',
          click: async () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              title: 'About Mashaaer Enhanced',
              message: 'Mashaaer Enhanced v1.0.0',
              detail: 'An Arabic AI Assistant with Emotion Detection and Cosmic UI.\n\n© 2025 Mashaaer Enhanced Team',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Handle window close
  mainWindow.on('closed', function () {
    mainWindow = null;
    stopFlaskServer();
  });
}

function startFlaskServer() {
  if (isDevMode) {
    console.log('Starting Flask server in development mode...');
    flaskProcess = spawn('python', [flaskPath], {
      stdio: 'inherit'
    });
  } else {
    console.log('Using packaged Flask server...');
    // In production, the Flask server is already packaged with the app
    // and will be started automatically
  }

  if (flaskProcess) {
    console.log(`Flask server started with PID: ${flaskProcess.pid}`);

    flaskProcess.on('error', (err) => {
      console.error('Failed to start Flask server:', err);
    });

    flaskProcess.on('close', (code) => {
      console.log(`Flask server process exited with code ${code}`);
    });
  }
}

function stopFlaskServer() {
  if (flaskProcess) {
    console.log('Stopping Flask server...');
    flaskProcess.kill();
    flaskProcess = null;
  }
}

/**
 * Create the activation window
 */
function createActivationWindow() {
  // Create the browser window for activation
  activationWindow = new BrowserWindow({
    width: 600,
    height: 700,
    title: 'Mashaaer Enhanced - License Activation',
    icon: path.join(__dirname, 'icon.ico'),
    resizable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the activation HTML file
  activationWindow.loadFile(path.join(__dirname, 'activation.html'));

  // Handle window close
  activationWindow.on('closed', function () {
    activationWindow = null;
    // If main window doesn't exist and activation was closed, exit the app
    if (!mainWindow) {
      app.quit();
    }
  });
}

/**
 * Check if license is valid and show activation window if needed
 */
function checkLicense() {
  // Initialize license manager
  licenseManager = new LicenseManager();

  // Check if license is valid
  if (licenseManager.isLicenseValid()) {
    console.log('License is valid. Starting application...');
    startFlaskServer();
    createWindow();
  } else {
    console.log('No valid license found. Showing activation window...');
    createActivationWindow();
  }
}

// Set up IPC handlers for license activation
function setupLicenseIPC() {
  // Handle license activation
  ipcMain.handle('license:activate', async (event, data) => {
    const result = licenseManager.activateLicense(data.key, data.name, data.email);
    return result;
  });

  // Handle license check
  ipcMain.handle('license:check', async () => {
    return {
      isValid: licenseManager.isLicenseValid(),
      licenseInfo: licenseManager.getLicenseInfo()
    };
  });

  // Handle activation complete
  ipcMain.on('license:activationComplete', () => {
    if (activationWindow) {
      activationWindow.close();
      activationWindow = null;
    }

    // Start the main application
    startFlaskServer();
    createWindow();
  });

  // Handle exit
  ipcMain.on('license:exit', () => {
    app.quit();
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  setupLicenseIPC();
  checkLicense();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null && licenseManager.isLicenseValid()) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    stopFlaskServer();
    app.quit();
  }
});

// On macOS, when the user closes all windows and clicks on the app icon,
// it's common to re-create a window
app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
