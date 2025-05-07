// Preload script for Electron
// This script runs in a privileged context that has access to both Node.js APIs
// and the DOM. It's used to securely expose specific Node.js APIs to the renderer process.

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    // Send messages to the main process
    send: (channel, data) => {
      // Whitelist channels to ensure security
      const validChannels = [
        'toMain', 
        'openFile', 
        'saveFile', 
        'license:exit', 
        'license:activationComplete'
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },

    // Receive messages from the main process
    receive: (channel, func) => {
      const validChannels = [
        'fromMain', 
        'fileOpened', 
        'fileSaved', 
        'license:status'
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },

    // Invoke methods in the main process and wait for a response
    invoke: async (channel, data) => {
      const validChannels = [
        'dialog:openFile', 
        'dialog:saveFile', 
        'license:activate', 
        'license:check'
      ];
      if (validChannels.includes(channel)) {
        return await ipcRenderer.invoke(channel, data);
      }
    }
  }
);

// Expose app info to the renderer process
contextBridge.exposeInMainWorld(
  'appInfo',
  {
    name: 'Mashaaer Enhanced',
    version: '1.0.0',
    description: 'Mashaaer Enhanced Arabic AI Assistant with Emotion Detection and Cosmic UI.'
  }
);

// Log when preload script has run
console.log('Preload script loaded');
