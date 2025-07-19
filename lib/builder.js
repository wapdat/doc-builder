const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { buildDocumentation } = require('./core-builder');

/**
 * Main build function
 * Now fully self-contained!
 */
async function build(config) {
  console.log(chalk.blue(`\n🚀 Building ${config.siteName}...\n`));
  
  // Validate config
  if (!config || typeof config !== 'object') {
    throw new Error('Invalid configuration provided to build function');
  }
  
  try {
    // Use the self-contained builder
    await buildDocumentation(config);
    console.log(chalk.green('\n✨ Build complete!\n'));
  } catch (error) {
    console.error(chalk.red('\n❌ Build failed:'), error.message);
    throw error;
  }
}

// Asset copying is now handled in core-builder.js

module.exports = {
  build
};