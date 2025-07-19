/**
 * Post-install setup script for @knowcode/doc-builder
 * This script runs after npm install to help users get started
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Check if we're in the doc-builder package itself (skip setup)
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (pkg.name === '@knowcode/doc-builder') {
    // We're in the doc-builder package itself, skip setup
    process.exit(0);
  }
}

console.log(chalk.cyan('\n🚀 Welcome to @knowcode/doc-builder!\n'));

console.log('You can use doc-builder in several ways:\n');

console.log(chalk.yellow('1. Using npx (no installation required):'));
console.log('   npx @knowcode/doc-builder build');
console.log('   npx @knowcode/doc-builder dev');
console.log('   npx @knowcode/doc-builder deploy\n');

console.log(chalk.yellow('2. After installing as a dependency:'));
console.log('   doc-builder build');
console.log('   doc-builder dev');
console.log('   doc-builder deploy\n');

console.log(chalk.yellow('3. In your package.json scripts:'));
console.log(chalk.gray('   "scripts": {'));
console.log(chalk.gray('     "docs:build": "doc-builder build",'));
console.log(chalk.gray('     "docs:dev": "doc-builder dev",'));
console.log(chalk.gray('     "docs:deploy": "doc-builder deploy --prod"'));
console.log(chalk.gray('   }\n'));

console.log(chalk.yellow('4. Programmatically in your code:'));
console.log(chalk.gray('   const { build } = require("@knowcode/doc-builder");'));
console.log(chalk.gray('   await build();\n'));

// Check for common doc directories
const commonDirs = ['docs', 'documentation', 'doc'];
const foundDir = commonDirs.find(dir => fs.existsSync(path.join(process.cwd(), dir)));

if (foundDir) {
  console.log(chalk.green(`✅ Found ${foundDir}/ directory - doc-builder will use this by default\n`));
} else {
  console.log(chalk.yellow(`ℹ️  No docs directory found. Create a 'docs' folder with markdown files to get started.\n`));
}

console.log(chalk.gray('For more information, visit: https://github.com/knowcode/doc-builder'));
console.log(chalk.gray('To create a config file, run: doc-builder init --config\n'));