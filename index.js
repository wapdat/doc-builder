/**
 * @knowcode/doc-builder - Programmatic API
 * 
 * This module exports functions for use in scripts or other tools
 */

const { build } = require('./lib/builder');
const { startDevServer } = require('./lib/dev-server');
const { deployToVercel, setupVercelProject } = require('./lib/deploy');
const { loadConfig, createDefaultConfig } = require('./lib/config');

module.exports = {
  // Main functions
  build,
  startDevServer,
  deployToVercel,
  setupVercelProject,
  
  // Config utilities
  loadConfig,
  createDefaultConfig,
  
  // Convenience wrapper for common operations
  async buildDocs(configPath = 'doc-builder.config.js', options = {}) {
    const config = await loadConfig(configPath, options);
    return build(config);
  },
  
  async deploy(configPath = 'doc-builder.config.js', options = {}) {
    const config = await loadConfig(configPath, options);
    return deployToVercel(config, options.prod);
  },
  
  async dev(configPath = 'doc-builder.config.js', options = {}) {
    const config = await loadConfig(configPath, options);
    return startDevServer(config, options.port || 3000);
  }
};