#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const prompts = require('prompts');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { build } = require('./lib/builder');
const { startDevServer } = require('./lib/dev-server');
const { deployToVercel, setupVercelProject, prepareDeployment } = require('./lib/deploy');
const { loadConfig, createDefaultConfig } = require('./lib/config');
const { execSync } = require('child_process');

// Package info
const packageJson = require('./package.json');

// Default to build command if no args provided
if (process.argv.length === 2) {
  process.argv.push('build');
}

program
  .name('doc-builder')
  .description(packageJson.description)
  .version(packageJson.version)
  .addHelpText('before', `
${chalk.cyan('🚀 @knowcode/doc-builder')} - Transform your markdown into beautiful documentation sites

${chalk.bgGreen.black(' TL;DR ')} ${chalk.green('Just run:')} ${chalk.cyan.bold('npx @knowcode/doc-builder')} ${chalk.green('→ Your docs are live on Vercel!')}

${chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

${chalk.yellow('What it does:')}
  • Converts markdown files to static HTML with a beautiful Notion-inspired theme
  • Automatically generates navigation from your folder structure
  • Supports mermaid diagrams, syntax highlighting, and dark mode
  • Deploys to Vercel with one command (zero configuration)
  • ${chalk.green.bold('NEW:')} Deploys directly to production by default (v1.1.0+)
  • Optional authentication to protect private documentation

${chalk.yellow('Requirements:')}
  • Node.js 14+ installed
  • A ${chalk.cyan('docs/')} folder with markdown files (or specify custom folder)
  • Vercel CLI for deployment (optional)

${chalk.yellow('Quick Start:')}
  ${chalk.cyan('1. Create your docs:')}
     ${chalk.gray('$')} mkdir docs
     ${chalk.gray('$')} echo "# My Documentation" > docs/README.md
  
  ${chalk.cyan('2. Build and deploy:')}
     ${chalk.gray('$')} npx @knowcode/doc-builder              ${chalk.gray('# Build and deploy to production')}
     ${chalk.gray('   or')}
     ${chalk.gray('$')} npx @knowcode/doc-builder build        ${chalk.gray('# Build HTML files only')}
     ${chalk.gray('$')} npx @knowcode/doc-builder dev          ${chalk.gray('# Start development server')}

${chalk.yellow('No docs folder yet?')}
  ${chalk.gray('$')} npx @knowcode/doc-builder init --example  ${chalk.gray('# Create example docs')}
  `);

// Build command
program
  .command('build')
  .description('Build the documentation site to static HTML')
  .option('-c, --config <path>', 'path to config file (default: doc-builder.config.js)')
  .option('-i, --input <dir>', 'input directory containing markdown files (default: docs)')
  .option('-o, --output <dir>', 'output directory for HTML files (default: html)')
  .option('--preset <preset>', 'use a preset configuration (available: cybersolstice)')
  .option('--legacy', 'use legacy mode for backward compatibility')
  .option('--no-auth', 'disable authentication even if configured')
  .option('--no-changelog', 'disable automatic changelog generation')
  .addHelpText('after', `
${chalk.yellow('Examples:')}
  ${chalk.gray('$')} doc-builder build                        ${chalk.gray('# Build with defaults')}
  ${chalk.gray('$')} doc-builder build --input docs --output dist
  ${chalk.gray('$')} doc-builder build --preset cybersolstice ${chalk.gray('# Use JUNO platform preset')}
  ${chalk.gray('$')} doc-builder build --config my-config.js  ${chalk.gray('# Use custom config')}
`)
  .action(async (options) => {
    const spinner = ora('Building documentation...').start();
    
    try {
      const config = await loadConfig(options.config || 'doc-builder.config.js', options);
      await build(config);
      spinner.succeed('Documentation built successfully!');
    } catch (error) {
      spinner.fail('Build failed');
      console.error(chalk.red(error.message));
      if (error.stack) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  });

// Dev server command
program
  .command('dev')
  .description('Start development server with live reload')
  .option('-c, --config <path>', 'path to config file (default: doc-builder.config.js)')
  .option('-p, --port <port>', 'port to run dev server on (default: 3000)')
  .option('-h, --host <host>', 'host to bind to (default: localhost)')
  .option('--no-open', 'don\'t open browser automatically')
  .addHelpText('after', `
${chalk.yellow('Examples:')}
  ${chalk.gray('$')} doc-builder dev                    ${chalk.gray('# Start on http://localhost:3000')}
  ${chalk.gray('$')} doc-builder dev --port 8080        ${chalk.gray('# Use custom port')}
  ${chalk.gray('$')} doc-builder dev --host 0.0.0.0     ${chalk.gray('# Allow external connections')}
`)
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
  .description('Deploy documentation to Vercel production (requires Vercel CLI)')
  .option('-c, --config <path>', 'path to config file (default: doc-builder.config.js)')
  .option('--no-prod', 'deploy as preview instead of production')
  .option('--force', 'force deployment without confirmation')
  .addHelpText('after', `
${chalk.yellow('Examples:')}
  ${chalk.gray('$')} doc-builder deploy                 ${chalk.gray('# Deploy to production')}
  ${chalk.gray('$')} doc-builder deploy --no-prod       ${chalk.gray('# Deploy preview only')}

${chalk.yellow('First-time Vercel Setup:')}
  
  ${chalk.cyan('1. Install Vercel CLI:')}
     ${chalk.gray('$')} npm install -g vercel
     ${chalk.gray('   or')}
     ${chalk.gray('$')} brew install vercel        ${chalk.gray('# macOS with Homebrew')}
  
  ${chalk.cyan('2. Login to Vercel:')}
     ${chalk.gray('$')} vercel login
     ${chalk.gray('   This will open your browser to authenticate')}
  
  ${chalk.cyan('3. Run doc-builder deploy:')}
     ${chalk.gray('$')} npx @knowcode/doc-builder deploy
     
     You'll be asked several questions:
     
     ${chalk.green('Q: Would you like to set up a new Vercel project?')}
     → Answer: ${chalk.yellow('Yes')} (first time only)
     
     ${chalk.green('Q: What is your project name?')}
     → Answer: ${chalk.yellow('Your project name')} (e.g., "my-docs" or "gasworld")
     
     ${chalk.bgRed.white.bold(' ⚠️  CRITICAL: ABOUT ROOT DIRECTORY ')}
     ${chalk.red('If asked about Root Directory at ANY point:')}
     ${chalk.red('• LEAVE IT EMPTY (blank)')}
     ${chalk.red('• DO NOT enter "html"')}
     ${chalk.red('• We deploy FROM html folder already!')}
     
     ${chalk.green('Q: Which framework preset?')}
     → Answer: ${chalk.yellow('Other (Static HTML)')} (always choose this)
     
     ${chalk.green('Q: Make the deployment publicly accessible?')}
     → Answer: ${chalk.yellow('Yes')} for public docs, ${chalk.yellow('No')} for private
     
     ${chalk.gray('Then Vercel CLI will ask:')}
     
     ${chalk.green('Q: Set up [your directory]?')}
     → Answer: ${chalk.yellow('Yes')}
     
     ${chalk.green('Q: Which scope should contain your project?')}
     → Answer: ${chalk.yellow('Select your account')} (usually your username)
     
     ${chalk.green('Q: Link to existing project?')}
     → Answer: ${chalk.yellow('No')} (first time), ${chalk.yellow('Yes')} (if redeploying)
     
     ${chalk.gray('Note: Vercel will auto-detect that we\'re deploying from the output directory')}
     
     ${chalk.green('Q: Want to modify these settings?')}
     → Answer: ${chalk.yellow('No')} (doc-builder handles this)
  
  ${chalk.cyan('4. Configure Access (Important!):')} 
     After deployment, go to your Vercel dashboard:
     • Navigate to Project Settings → General
     • Under "Deployment Protection", set to ${chalk.yellow('Disabled')}
     • This allows public access to your docs
     
${chalk.yellow('Deployment Behavior (v1.1.0+):')}
  ${chalk.green.bold('🎯 DEFAULT: All deployments go to PRODUCTION')}
  
  ${chalk.gray('$')} npx @knowcode/doc-builder          ${chalk.gray('# → yourdocs.vercel.app')}
  ${chalk.gray('$')} npx @knowcode/doc-builder deploy   ${chalk.gray('# → yourdocs.vercel.app')}
  ${chalk.gray('$')} npx @knowcode/doc-builder deploy --no-prod  ${chalk.gray('# → preview URL only')}

${chalk.yellow('When All Else Fails - Delete and Start Fresh:')}
  Sometimes the cleanest solution is to delete the Vercel project:
  
  1. Go to your project settings on Vercel
  2. Scroll to bottom and click ${chalk.red('"Delete Project"')}
  3. Run: ${chalk.gray('npx @knowcode/doc-builder reset-vercel')}
  4. Run: ${chalk.gray('npx @knowcode/doc-builder deploy')}
  5. Create a NEW project with correct settings
  
  This removes all conflicting configurations!

${chalk.yellow('Troubleshooting:')}
  • ${chalk.cyan('Command not found:')} Install Vercel CLI globally
  • ${chalk.cyan('Not authenticated:')} Run ${chalk.gray('vercel login')}
  • ${chalk.cyan('Project not linked:')} Delete ${chalk.gray('.vercel')} folder and redeploy
  
  ${chalk.red.bold('• Path "html/html" does not exist error:')}
    ${chalk.yellow('This happens when Vercel has the wrong Root Directory setting.')}
    
    ${chalk.green('Fix:')}
    1. Go to your Vercel project settings
    2. Under "Build & Development Settings"
    3. Set "Root Directory" to ${chalk.yellow.bold('empty (leave blank)')}
    4. Save and redeploy
    
  ${chalk.red.bold('• Linked to wrong project (username/html):')}
    ${chalk.yellow('Never link to the generic "html" project!')}
    
    ${chalk.green('Fix:')}
    1. Delete the ${chalk.gray('html/.vercel')} folder
    2. Run deployment again
    3. When asked "Link to existing project?" say ${chalk.red.bold('NO')}
    4. Create a new project with your actual name
    
  ${chalk.red.bold('• "buildCommand should be string,null" error:')}
    ${chalk.yellow('Your Vercel project has conflicting build settings.')}
    
    ${chalk.green('Fix:')}
    1. Go to project settings > Build & Development Settings
    2. Clear ALL fields (Build Command, Output Directory, etc.)
    3. Save and try again
    ${chalk.gray('OR')}
    Delete the project and start fresh (see below)
    
  ${chalk.red.bold('• "Project was deleted or you don\'t have access" error:')}
    ${chalk.yellow('The Vercel project was deleted but local config remains.')}
    
    ${chalk.green('Fix:')}
    ${chalk.gray('$')} npx @knowcode/doc-builder reset-vercel
    ${chalk.gray('$')} npx @knowcode/doc-builder deploy
    
    This removes old project references and starts fresh
`)
  .action(async (options) => {
    const spinner = ora('Deploying to Vercel...').start();
    
    try {
      const config = await loadConfig(options.config || 'doc-builder.config.js', options);
      
      // First check if Vercel CLI is installed
      try {
        execSync('vercel --version', { stdio: 'ignore' });
      } catch (vercelError) {
        spinner.fail('Vercel CLI not found');
        console.log(chalk.yellow('\n📦 Vercel CLI is required for deployment\n'));
        console.log(chalk.cyan('Install it with one of these commands:'));
        console.log(chalk.gray('  npm install -g vercel'));
        console.log(chalk.gray('  yarn global add vercel'));
        console.log(chalk.gray('  brew install vercel     # macOS\n'));
        console.log(chalk.yellow('Then run deployment again:'));
        console.log(chalk.gray('  npx @knowcode/doc-builder deploy\n'));
        process.exit(1);
      }
      
      // Always build first
      spinner.stop();
      console.log(chalk.blue('\n📦 Building documentation first...\n'));
      await build(config);
      spinner.start('Deploying to Vercel...');
      
      // Prepare deployment files
      await prepareDeployment(config);
      
      // Check if this is the first deployment
      const outputPath = path.join(process.cwd(), config.outputDir || 'html');
      const vercelProjectPath = path.join(outputPath, '.vercel', 'project.json');
      if (!fs.existsSync(vercelProjectPath)) {
        spinner.stop();
        console.log(chalk.yellow('\n🚀 First time deploying to Vercel!\n'));
        
        // Show critical warning about Root Directory
        console.log(chalk.bgRed.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log(chalk.bgRed.white.bold(' ⚠️  CRITICAL WARNING - READ BEFORE CONTINUING! '));
        console.log(chalk.bgRed.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
        
        console.log(chalk.yellow.bold('During setup, if Vercel asks about Root Directory:'));
        console.log(chalk.red.bold('• LEAVE IT EMPTY (blank)'));
        console.log(chalk.red.bold('• DO NOT ENTER "html"'));
        console.log(chalk.red.bold('• We are ALREADY deploying from the html folder!\n'));
        
        console.log(chalk.white('Setting Root Directory to "html" will cause errors.'));
        console.log(chalk.white('You\'ll need to fix it in project settings later.\n'));
        
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
      // Default to production deployment
      const isProduction = options.prod !== false;  // Default true unless explicitly --no-prod
      const url = await deployToVercel(config, isProduction);
      spinner.succeed(`Deployed successfully!`);
      
      // Extract project name from URL
      const projectName = url.match(/https:\/\/([^-]+)/)?.[1] || 'your-project';
      
      console.log(chalk.green('\n✅ Deployment Complete!\n'));
      
      if (isProduction) {
        console.log(chalk.yellow('🌐 Your documentation is live at:'));
        console.log(chalk.cyan.bold(`   ${projectName}.vercel.app`) + chalk.gray(' (Production URL - share this!)'));
        console.log();
        console.log(chalk.gray('This deployment also created a unique preview URL:'));
        console.log(chalk.gray(`   ${url}`));
        console.log(chalk.gray('   (This URL is specific to this deployment)'));
      } else {
        console.log(chalk.yellow('🔍 Preview deployment created at:'));
        console.log(chalk.cyan(`   ${url}`));
        console.log();
        console.log(chalk.gray('To deploy to production, run:'));
        console.log(chalk.gray('   npx @knowcode/doc-builder deploy'));
      }
      console.log();
      
    } catch (error) {
      spinner.fail('Deployment failed');
      console.error(chalk.red(error.message));
      if (error.stack) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  });

// Reset command for Vercel issues
program
  .command('reset-vercel')
  .description('Reset Vercel configuration (fixes common deployment issues)')
  .option('-c, --config <path>', 'path to config file (default: doc-builder.config.js)')
  .addHelpText('after', `
${chalk.yellow('What this does:')}
  • Removes .vercel folder from your output directory
  • Lets you set up a fresh Vercel project
  • Fixes "html/html does not exist" errors
  • Fixes wrong project linking issues

${chalk.yellow('When to use:')}
  • After "html/html does not exist" error
  • When linked to wrong project (e.g., username/html)
  • When Root Directory settings are incorrect
  • After deleting a Vercel project
  • When you get "Project was deleted" errors
  • Any time you want to start fresh with deployment
`)
  .action(async (options) => {
    try {
      const config = await loadConfig(options.config || 'doc-builder.config.js', options);
      const outputPath = path.join(process.cwd(), config.outputDir || 'html');
      const vercelPath = path.join(outputPath, '.vercel');
      
      if (fs.existsSync(vercelPath)) {
        console.log(chalk.yellow('🗑️  Removing .vercel folder from ' + config.outputDir + '...'));
        fs.removeSync(vercelPath);
        console.log(chalk.green('✅ Vercel configuration reset!'));
        console.log(chalk.gray('\nNow run deployment again:'));
        console.log(chalk.cyan('  npx @knowcode/doc-builder deploy'));
        console.log(chalk.gray('\nThis time:'));
        console.log(chalk.gray('• Create a NEW project (not username/html)'));
        console.log(chalk.gray('• Use a descriptive name like "my-docs"'));
        console.log(chalk.gray('• Leave Root Directory EMPTY'));
      } else {
        console.log(chalk.gray('No .vercel folder found. Ready for fresh deployment!'));
      }
    } catch (error) {
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Init command
program
  .command('init')
  .description('Initialize doc-builder in your project')
  .option('--config', 'create configuration file')
  .option('--example', 'create example documentation structure')
  .addHelpText('after', `
${chalk.yellow('Examples:')}
  ${chalk.gray('$')} doc-builder init --config          ${chalk.gray('# Create doc-builder.config.js')}
  ${chalk.gray('$')} doc-builder init --example         ${chalk.gray('# Create example docs folder')}
  ${chalk.gray('$')} doc-builder init --example --config ${chalk.gray('# Create both')}

${chalk.yellow('What gets created:')}
  ${chalk.cyan('--example:')} Creates a docs/ folder with:
    • README.md with welcome message and mermaid diagram
    • getting-started.md with setup instructions
    • guides/configuration.md with config options
  
  ${chalk.cyan('--config:')} Creates doc-builder.config.js with:
    • Site name and description
    • Feature toggles (auth, dark mode, etc.)
    • Directory paths
    • Authentication settings
`)
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
    
    if (options.example) {
      const docsDir = path.join(process.cwd(), 'docs');
      
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
        
        // Create example files
        const exampleFiles = {
          'README.md': `# Welcome to Your Documentation\n\nThis is an example documentation site created with @knowcode/doc-builder.\n\n## Features\n\n- 📝 Write in Markdown\n- 🎨 Beautiful Notion-inspired design\n- 📊 Mermaid diagram support\n- 🌙 Dark mode\n- 🚀 Deploy to Vercel\n\n## Getting Started\n\n1. Edit this file and add your content\n2. Create new markdown files\n3. Run \`npx @knowcode/doc-builder\` to build and deploy\n\n## Example Diagram\n\n\`\`\`mermaid\ngraph TD\n    A[Write Docs] --> B[Build]\n    B --> C[Deploy]\n    C --> D[Share]\n\`\`\`\n`,
          'getting-started.md': `# Getting Started\n\n**Generated**: ${new Date().toISOString().split('T')[0]}\n**Status**: Draft\n**Verified**: ❓\n\n## Overview\n\nThis guide will help you get started with your documentation.\n\n## Installation\n\nNo installation required! Just use:\n\n\`\`\`bash\nnpx @knowcode/doc-builder\n\`\`\`\n\n## Writing Documentation\n\n1. Create markdown files in the \`docs\` folder\n2. Use folders to organize your content\n3. Add front matter for metadata\n\n## Building\n\nTo build your documentation:\n\n\`\`\`bash\nnpx @knowcode/doc-builder build\n\`\`\`\n\n## Deployment\n\nDeploy to Vercel:\n\n\`\`\`bash\nnpx @knowcode/doc-builder deploy\n\`\`\`\n`,
          'guides/configuration.md': `# Configuration Guide\n\n**Generated**: ${new Date().toISOString().split('T')[0]}\n**Status**: Draft\n**Verified**: ❓\n\n## Overview\n\n@knowcode/doc-builder works with zero configuration, but you can customize it.\n\n## Configuration File\n\nCreate \`doc-builder.config.js\`:\n\n\`\`\`javascript\nmodule.exports = {\n  siteName: 'My Documentation',\n  siteDescription: 'Documentation for my project',\n  \n  features: {\n    authentication: false,\n    changelog: true,\n    mermaid: true,\n    darkMode: true\n  }\n};\n\`\`\`\n\n## Options\n\n### Site Information\n\n- \`siteName\`: Your documentation site name\n- \`siteDescription\`: Brief description\n\n### Directories\n\n- \`docsDir\`: Input directory (default: 'docs')\n- \`outputDir\`: Output directory (default: 'html')\n\n### Features\n\n- \`authentication\`: Enable password protection\n- \`changelog\`: Generate changelog automatically\n- \`mermaid\`: Support for diagrams\n- \`darkMode\`: Dark theme support\n`
        };
        
        // Create example files
        for (const [filePath, content] of Object.entries(exampleFiles)) {
          const fullPath = path.join(docsDir, filePath);
          const dir = path.dirname(fullPath);
          
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.writeFileSync(fullPath, content);
          console.log(chalk.green(`✅ Created ${filePath}`));
        }
        
        console.log(chalk.cyan('\\n📚 Example documentation created in docs/ folder'));
        console.log(chalk.gray('\\nNext steps:'));
        console.log(chalk.gray('1. Edit the example files to add your content'));
        console.log(chalk.gray('2. Run `npx @knowcode/doc-builder` to build and deploy'));
      } else {
        console.log(chalk.yellow('⚠️  docs/ directory already exists'));
      }
    }
  });

// Add a default command handler for when doc-builder is run without arguments
program
  .action(async () => {
    // Default action is build + deploy to production
    console.log(chalk.cyan('\n🚀 Building and deploying your documentation to production...\n'));
    
    try {
      // Build first
      const config = await loadConfig('doc-builder.config.js', { legacy: true });
      const buildSpinner = ora('Building documentation...').start();
      await build(config);
      buildSpinner.succeed('Documentation built successfully!');
      
      // Then deploy
      const deploySpinner = ora('Deploying to Vercel...').start();
      
      // Check if this is the first deployment
      const vercelProjectPath = path.join(outputPath, '.vercel', 'project.json');
      if (!fs.existsSync(vercelProjectPath)) {
        deploySpinner.stop();
        console.log(chalk.yellow('\n🚀 First time deploying to Vercel!\n'));
        
        // Show critical warning about Root Directory
        console.log(chalk.bgRed.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log(chalk.bgRed.white.bold(' ⚠️  CRITICAL WARNING - READ BEFORE CONTINUING! '));
        console.log(chalk.bgRed.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
        
        console.log(chalk.yellow.bold('During setup, if Vercel asks about Root Directory:'));
        console.log(chalk.red.bold('• LEAVE IT EMPTY (blank)'));
        console.log(chalk.red.bold('• DO NOT ENTER "html"'));
        console.log(chalk.red.bold('• We are ALREADY deploying from the html folder!\n'));
        
        const setupConfirm = await prompts({
          type: 'confirm',
          name: 'value',
          message: 'Would you like to set up a new Vercel project?',
          initial: true
        });
        
        if (setupConfirm.value) {
          await setupVercelProject(config);
        } else {
          console.log(chalk.gray('\nTo deploy manually, run: vercel'));
          console.log(chalk.gray('To skip deployment, run: doc-builder build\n'));
          process.exit(0);
        }
        deploySpinner.start('Deploying to Vercel...');
      }
      
      // Default to production deployment
      const url = await deployToVercel(config, true);
      deploySpinner.succeed(`Deployed successfully!`);
      
      // Extract project name from URL
      const projectName = url.match(/https:\/\/([^-]+)/)?.[1] || 'your-project';
      
      console.log(chalk.green('\n✅ Deployment Complete!\n'));
      console.log(chalk.yellow('🌐 Your documentation is live at:'));
      console.log(chalk.cyan.bold(`   ${projectName}.vercel.app`) + chalk.gray(' (Production URL - share this!)'));
      console.log();
      console.log(chalk.gray('This deployment also created a unique preview URL:'));
      console.log(chalk.gray(`   ${url}`));
      console.log(chalk.gray('   (This URL is specific to this deployment)'));
      console.log();
      
    } catch (error) {
      console.error(chalk.red('\nError: ' + error.message));
      console.log(chalk.gray('\nTo build without deploying, run: doc-builder build'));
      process.exit(1);
    }
  });

// Parse arguments
program.parse(process.argv);