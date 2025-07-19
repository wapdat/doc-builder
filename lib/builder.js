const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Main build function
 * This wraps the existing build.js functionality
 */
async function build(config) {
  console.log(chalk.blue(`\n🚀 Building ${config.siteName}...\n`));
  
  // For now, we'll use the existing build.js file
  // In a future refactor, we'll move all the logic here
  const buildScriptPath = path.join(__dirname, '../../../html/build.js');
  
  if (!fs.existsSync(buildScriptPath)) {
    throw new Error('Build script not found. This package must be run from the cybersolstice project.');
  }
  
  // Set environment variables for the build script
  process.env.DOC_BUILDER_CONFIG = JSON.stringify(config);
  
  // Import and run the existing build
  const { build: existingBuild } = require(buildScriptPath);
  
  // Run the build
  await existingBuild();
  
  // Copy assets to output directory
  await copyAssets(config);
  
  console.log(chalk.green('\n✨ Build complete!\n'));
}

/**
 * Copy package assets to output directory
 */
async function copyAssets(config) {
  const outputDir = path.join(process.cwd(), config.outputDir);
  const assetsDir = path.join(__dirname, '../assets');
  
  // Ensure output directory exists
  await fs.ensureDir(outputDir);
  
  // Copy CSS
  const cssSource = path.join(assetsDir, 'css');
  const cssDest = path.join(outputDir, 'css');
  if (fs.existsSync(cssSource)) {
    await fs.copy(cssSource, cssDest, { overwrite: true });
  }
  
  // Copy JS
  const jsSource = path.join(assetsDir, 'js');
  const jsDest = path.join(outputDir, 'js');
  if (fs.existsSync(jsSource)) {
    await fs.copy(jsSource, jsDest, { overwrite: true });
  }
  
  // Copy auth.js to root
  const authSource = path.join(assetsDir, 'js', 'auth.js');
  const authDest = path.join(outputDir, 'auth.js');
  if (fs.existsSync(authSource)) {
    await fs.copy(authSource, authDest, { overwrite: true });
  }
}

module.exports = {
  build
};