#!/usr/bin/env node

/**
 * NPX runner script for @knowcode/doc-builder
 * This script enables zero-configuration usage via npx
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the command from arguments - no default command
const [,, ...args] = process.argv;

// Path to the actual CLI
const cliPath = path.join(__dirname, '..', 'cli.js');

// Build the command - pass all arguments through
const fullCommand = `node "${cliPath}" ${args.join(' ')}`;

try {
  // Execute the CLI with stdio inherited to preserve colors and interactivity
  execSync(fullCommand, { stdio: 'inherit' });
} catch (error) {
  // Exit with the same code as the CLI
  process.exit(error.status || 1);
}