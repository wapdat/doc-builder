#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const prompts = require('prompts');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { build } = require('./lib/builder');
const { startDevServer } = require('./lib/dev-server');
const { deployToVercel, setupVercelProject } = require('./lib/deploy');
const { loadConfig, createDefaultConfig } = require('./lib/config');

// Package info
const packageJson = require('./package.json');

program
  .name('doc-builder')
  .description(packageJson.description)
  .version(packageJson.version);

// Build command
program
  .command('build')
  .description('Build the documentation site')
  .option('-c, --config <path>', 'path to config file', 'doc-builder.config.js')
  .option('--preset <preset>', 'use a preset configuration')
  .option('--legacy', 'use legacy mode (auto-detect structure)')
  .action(async (options) => {
    const spinner = ora('Building documentation...').start();
    
    try {
      const config = await loadConfig(options.config, options);
      await build(config);
      spinner.succeed('Documentation built successfully!');
    } catch (error) {
      spinner.fail('Build failed');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Dev server command
program
  .command('dev')
  .description('Start development server with live reload')
  .option('-c, --config <path>', 'path to config file', 'doc-builder.config.js')
  .option('-p, --port <port>', 'port to run dev server on', '3000')
  .action(async (options) => {
    try {
      const config = await loadConfig(options.config, options);
      await startDevServer(config, options.port);
    } catch (error) {
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Deploy command
program
  .command('deploy')
  .description('Deploy documentation to Vercel')
  .option('-c, --config <path>', 'path to config file', 'doc-builder.config.js')
  .option('--prod', 'deploy to production')
  .action(async (options) => {
    const spinner = ora('Deploying to Vercel...').start();
    
    try {
      const config = await loadConfig(options.config, options);
      
      // Check if this is the first deployment
      const vercelConfigPath = path.join(process.cwd(), '.vercel', 'project.json');
      if (!fs.existsSync(vercelConfigPath)) {
        spinner.stop();
        console.log(chalk.yellow('\n🚀 First time deploying to Vercel!\n'));
        
        const setupConfirm = await prompts({
          type: 'confirm',
          name: 'value',
          message: 'Would you like to set up a new Vercel project?',
          initial: true
        });
        
        if (setupConfirm.value) {
          await setupVercelProject(config);
        } else {
          console.log(chalk.gray('Run `vercel` manually to set up your project.'));
          process.exit(0);
        }
      }
      
      spinner.start('Deploying to Vercel...');
      const url = await deployToVercel(config, options.prod);
      spinner.succeed(`Deployed successfully! ${chalk.cyan(url)}`);
      
    } catch (error) {
      spinner.fail('Deployment failed');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Init command
program
  .command('init')
  .description('Initialize doc-builder configuration')
  .option('--config', 'create configuration file')
  .action(async (options) => {
    if (options.config) {
      const configPath = path.join(process.cwd(), 'doc-builder.config.js');
      
      if (fs.existsSync(configPath)) {
        const overwrite = await prompts({
          type: 'confirm',
          name: 'value',
          message: 'Config file already exists. Overwrite?',
          initial: false
        });
        
        if (!overwrite.value) {
          console.log(chalk.gray('Cancelled.'));
          process.exit(0);
        }
      }
      
      const config = await createDefaultConfig();
      fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};`);
      console.log(chalk.green('✅ Created doc-builder.config.js'));
    }
  });

// Parse arguments
program.parse(process.argv);