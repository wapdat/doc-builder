/**
 * @juno/doc-builder
 * Main entry point for the documentation builder package
 */

const builder = require('./lib/builder');
const { loadConfig } = require('./lib/config');
const { startDevServer } = require('./lib/dev-server');
const { deployToVercel } = require('./lib/deploy');

module.exports = {
  build: builder.build,
  dev: startDevServer,
  deploy: deployToVercel,
  loadConfig,
};