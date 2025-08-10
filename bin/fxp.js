#!/usr/bin/env node

const path = require('path');

// Check if running from packaged binary
const isPackaged = process.pkg !== undefined;

let srcPath;
if (isPackaged) {
  // For packaged binary, use the snapshot path
  srcPath = path.join(__dirname, '..', 'src', 'index.js');
} else {
  // For development or npm installation
  srcPath = path.join(__dirname, '..', 'src', 'index.js');
}

try {
  require(srcPath);
} catch (error) {
  if (isPackaged) {
    // For packaged binary, try direct require
    require('../src/index.js');
  } else {
    console.error('Error starting FXP CLI:', error.message);
    process.exit(1);
  }
}
