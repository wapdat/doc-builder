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
const { generateDescription } = require('./lib/seo');
const { execSync } = require('child_process');
const matter = require('gray-matter');

// Package info
const packageJson = require('./package.json');

program
  .name('doc-builder')
  .description(packageJson.description)
  .version(packageJson.version)
  .addHelpText('before', `
${chalk.cyan('🚀 @knowcode/doc-builder')} - Transform your markdown into beautiful documentation sites

${chalk.bgGreen.black(' TL;DR ')} ${chalk.green('Just run:')} ${chalk.cyan.bold('npx @knowcode/doc-builder@latest deploy')} ${chalk.green('→ Your docs are live on Vercel!')}

${chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

${chalk.yellow('What it does:')}
  • Converts markdown files to static HTML with a beautiful Notion-inspired theme
  • Automatically generates navigation from your folder structure
  • Supports mermaid diagrams, syntax highlighting, and dark mode
  • Deploys to Vercel with one command (zero configuration)
  • ${chalk.green.bold('NEW:')} Shows help by default, use 'deploy' to publish (v1.3.0+)
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
     ${chalk.gray('$')} npx @knowcode/doc-builder@latest       ${chalk.gray('# Show help and available commands')}
     ${chalk.gray('$')} npx @knowcode/doc-builder@latest deploy ${chalk.gray('# Build and deploy to production')}
     ${chalk.gray('$')} npx @knowcode/doc-builder@latest build  ${chalk.gray('# Build HTML files only')}

${chalk.yellow('Troubleshooting npx cache issues:')}
  ${chalk.red('If you see an old version after updating:')}
     ${chalk.gray('$')} npx clear-npx-cache                    ${chalk.gray('# Clear the npx cache')}
     ${chalk.gray('$')} npx @knowcode/doc-builder@latest       ${chalk.gray('# Force latest version')}
     ${chalk.gray('$')} npx @knowcode/doc-builder@latest dev   ${chalk.gray('# Start development server')}

${chalk.yellow('No docs folder yet?')}
  ${chalk.gray('$')} npx @knowcode/doc-builder@latest init --example  ${chalk.gray('# Create example docs')}
  `);

// Build command
program
  .command('build')
  .description('Build the documentation site to static HTML')
  .option('-c, --config <path>', 'path to config file (default: doc-builder.config.js)')
  .option('-i, --input <dir>', 'input directory containing markdown files (default: docs)')
  .option('-o, --output <dir>', 'output directory for HTML files (default: html)')
  .option('--preset <preset>', 'use a preset configuration (available: notion-inspired)')
  .option('--legacy', 'use legacy mode for backward compatibility')
  .option('--no-auth', 'disable authentication even if configured')
  .option('--no-changelog', 'disable automatic changelog generation')
  .addHelpText('after', `
${chalk.yellow('Examples:')}
  ${chalk.gray('$')} doc-builder build                        ${chalk.gray('# Build with defaults')}
  ${chalk.gray('$')} doc-builder build --input docs --output dist
  ${chalk.gray('$')} doc-builder build --preset notion-inspired ${chalk.gray('# Use Notion-inspired preset')}
  ${chalk.gray('$')} doc-builder build --config my-config.js  ${chalk.gray('# Use custom config')}
`)
  .action(async (options) => {
    const spinner = ora('Building documentation...').start();
    
    try {
      const config = await loadConfig(options.config || 'doc-builder.config.js', { ...options, command: 'build' });
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
      const config = await loadConfig(options.config, { ...options, command: 'dev' });
      await startDevServer(config, options.port);
    } catch (error) {
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Google Site Verification command
program
  .command('google-verify <verification-code>')
  .description('Add Google site verification meta tag to all pages')
  .option('-c, --config <path>', 'path to config file (default: doc-builder.config.js)')
  .addHelpText('after', `
${chalk.yellow('Examples:')}
  ${chalk.gray('$')} doc-builder google-verify FtzcDTf5BQ9K5EfnGazQkgU2U4FiN3ITzM7gHwqUAqQ
  ${chalk.gray('$')} doc-builder google-verify YOUR_VERIFICATION_CODE

${chalk.yellow('This will add the Google site verification meta tag to all generated HTML pages.')}
${chalk.yellow('Get your verification code from Google Search Console.')}
`)
  .action(async (verificationCode, options) => {
    try {
      const configPath = path.join(process.cwd(), options.config || 'doc-builder.config.js');
      let config;
      
      if (fs.existsSync(configPath)) {
        // Load existing config
        delete require.cache[require.resolve(configPath)];
        config = require(configPath);
      } else {
        console.log(chalk.yellow('⚠️  No config file found. Creating one...'));
        await createDefaultConfig();
        config = require(configPath);
      }
      
      // Ensure SEO section exists
      if (!config.seo) {
        config.seo = {
          enabled: true,
          customMetaTags: []
        };
      }
      
      if (!config.seo.customMetaTags) {
        config.seo.customMetaTags = [];
      }
      
      // Check if Google verification already exists
      const googleVerifyIndex = config.seo.customMetaTags.findIndex(tag => 
        tag.name === 'google-site-verification'
      );
      
      const newTag = {
        name: 'google-site-verification',
        content: verificationCode
      };
      
      if (googleVerifyIndex >= 0) {
        // Update existing
        config.seo.customMetaTags[googleVerifyIndex] = newTag;
        console.log(chalk.green(`✅ Updated Google site verification code`));
      } else {
        // Add new
        config.seo.customMetaTags.push(newTag);
        console.log(chalk.green(`✅ Added Google site verification code`));
      }
      
      // Write updated config
      const configContent = `module.exports = ${JSON.stringify(config, null, 2)};\n`;
      fs.writeFileSync(configPath, configContent);
      
      console.log(chalk.gray(`\nThe following meta tag will be added to all pages:`));
      console.log(chalk.cyan(`<meta name="google-site-verification" content="${verificationCode}" />`));
      console.log(chalk.gray(`\nRun ${chalk.cyan('doc-builder build')} to regenerate your documentation.`));
    } catch (error) {
      console.error(chalk.red('Failed to add Google verification:'), error.message);
      process.exit(1);
    }
  });

// SEO Check command
program
  .command('seo-check [path]')
  .description('Analyze SEO metadata in generated HTML files')
  .option('-c, --config <path>', 'path to config file (default: doc-builder.config.js)')
  .addHelpText('after', `
${chalk.yellow('Examples:')}
  ${chalk.gray('$')} doc-builder seo-check                    ${chalk.gray('# Check all HTML pages')}
  ${chalk.gray('$')} doc-builder seo-check html/guide.html    ${chalk.gray('# Check specific HTML file')}

${chalk.yellow('This command analyzes generated HTML files for:')}
  • Title tags and length (50-60 characters)
  • Meta descriptions (140-160 characters)  
  • Keywords meta tags
  • Canonical URLs
  • H1 tags and consistency
  • Open Graph tags (Facebook)
  • Twitter Card tags
  • Structured data (JSON-LD)
  
${chalk.yellow('Note:')} Run 'doc-builder build' first to generate HTML files.
`)
  .action(async (filePath, options) => {
    try {
      const config = await loadConfig(options.config || 'doc-builder.config.js', options);
      const outputDir = path.resolve(config.outputDir || 'html');
      
      // Check if outputDir exists
      if (!await fs.pathExists(outputDir)) {
        console.error(chalk.red(`Output directory not found: ${outputDir}`));
        console.log(chalk.yellow('\nPlease build your documentation first with: doc-builder build'));
        process.exit(1);
      }
      
      console.log(chalk.cyan('🔍 Analyzing SEO in generated HTML files...'));
      
      // Get files to check
      let files = [];
      if (filePath) {
        const fullPath = path.resolve(filePath);
        if (await fs.pathExists(fullPath)) {
          files = [fullPath];
        } else {
          console.error(chalk.red(`File not found: ${filePath}`));
          process.exit(1);
        }
      } else {
        // Get all HTML files
        const getAllFiles = async (dir) => {
          const results = [];
          const items = await fs.readdir(dir);
          for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = await fs.stat(fullPath);
            if (stat.isDirectory() && !item.startsWith('.')) {
              results.push(...await getAllFiles(fullPath));
            } else if (item.endsWith('.html') && item !== '404.html') {
              results.push(fullPath);
            }
          }
          return results;
        };
        files = await getAllFiles(outputDir);
      }
      
      // Analyze each file
      const issues = [];
      const suggestions = [];
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8');
        const relativePath = path.relative(outputDir, file);
        
        // Extract metadata from HTML
        const titleMatch = content.match(/<title>([^<]+)<\/title>/);
        const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/);
        const keywordsMatch = content.match(/<meta\s+name="keywords"\s+content="([^"]+)"/);
        const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
        const h1Match = content.match(/<h1>([^<]+)<\/h1>/);
        
        const title = titleMatch ? titleMatch[1] : 'No title found';
        const description = descMatch ? descMatch[1] : '';
        const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [];
        const canonical = canonicalMatch ? canonicalMatch[1] : '';
        const h1 = h1Match ? h1Match[1] : '';
        
        // Check for Open Graph tags
        const ogTitleMatch = content.match(/<meta\s+property="og:title"\s+content="([^"]+)"/);
        const ogDescMatch = content.match(/<meta\s+property="og:description"\s+content="([^"]+)"/);
        const ogImageMatch = content.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
        
        // Check for Twitter Card tags
        const twitterTitleMatch = content.match(/<meta\s+name="twitter:title"\s+content="([^"]+)"/);
        const twitterDescMatch = content.match(/<meta\s+name="twitter:description"\s+content="([^"]+)"/);
        
        // Check for structured data
        const structuredDataMatch = content.match(/<script\s+type="application\/ld\+json">/);
        
        // Check title
        const titleLength = title.length;
        if (!titleMatch) {
          issues.push({
            file: relativePath,
            type: 'title',
            message: 'Missing <title> tag',
            severity: 'critical'
          });
        } else if (titleLength > 60) {
          issues.push({
            file: relativePath,
            type: 'title',
            message: `Title too long (${titleLength} chars, max 60)`,
            current: title,
            suggestion: title.substring(0, 57) + '...'
          });
        } else if (titleLength < 30) {
          suggestions.push({
            file: relativePath,
            type: 'title',
            message: `Title might be too short (${titleLength} chars, ideal 50-60)`
          });
        }
        
        // Check description
        if (!descMatch) {
          issues.push({
            file: relativePath,
            type: 'description',
            message: 'Missing meta description',
            severity: 'critical'
          });
        } else {
          const descLength = description.length;
          if (descLength > 160) {
            issues.push({
              file: relativePath,
              type: 'description',
              message: `Description too long (${descLength} chars, max 160)`,
            current: description,
            suggestion: description.substring(0, 157) + '...'
          });
          } else if (descLength < 120) {
            suggestions.push({
              file: relativePath,
              type: 'description',
              message: `Description might be too short (${descLength} chars, ideal 140-160)`
            });
          }
        }
        
        // Check keywords
        if (!keywordsMatch || keywords.length === 0) {
          suggestions.push({
            file: relativePath,
            type: 'keywords',
            message: 'No keywords meta tag found'
          });
        }
        
        // Check canonical URL
        if (!canonicalMatch) {
          suggestions.push({
            file: relativePath,
            type: 'canonical',
            message: 'Missing canonical URL'
          });
        }
        
        // Check H1
        if (!h1Match) {
          issues.push({
            file: relativePath,
            type: 'h1',
            message: 'Missing H1 tag',
            severity: 'important'
          });
        } else if (h1 !== title.split(' | ')[0]) {
          suggestions.push({
            file: relativePath,
            type: 'h1',
            message: 'H1 differs from page title'
          });
        }
        
        // Check Open Graph tags
        if (!ogTitleMatch || !ogDescMatch) {
          suggestions.push({
            file: relativePath,
            type: 'opengraph',
            message: 'Missing or incomplete Open Graph tags'
          });
        }
        
        // Check Twitter Card tags
        if (!twitterTitleMatch || !twitterDescMatch) {
          suggestions.push({
            file: relativePath,
            type: 'twitter',
            message: 'Missing or incomplete Twitter Card tags'
          });
        }
        
        // Check structured data
        if (!structuredDataMatch) {
          suggestions.push({
            file: relativePath,
            type: 'structured-data',
            message: 'Missing structured data (JSON-LD)'
          });
        }
      }
      
      // Display results
      console.log(`\n${chalk.cyan('📊 SEO Analysis Complete')}\n`);
      console.log(`Analyzed ${files.length} files\n`);
      
      if (issues.length === 0 && suggestions.length === 0) {
        console.log(chalk.green('✅ No SEO issues found!'));
      } else {
        if (issues.length > 0) {
          console.log(chalk.red(`❌ Found ${issues.length} issues:\n`));
          issues.forEach(issue => {
            console.log(chalk.red(`  ${issue.file}:`));
            console.log(chalk.yellow(`    ${issue.message}`));
            if (issue.suggestion) {
              console.log(chalk.gray(`    Suggestion: ${issue.suggestion.substring(0, 50)}...`));
            }
            console.log('');
          });
        }
        
        if (suggestions.length > 0) {
          console.log(chalk.yellow(`💡 ${suggestions.length} suggestions:\n`));
          suggestions.forEach(suggestion => {
            console.log(chalk.yellow(`  ${suggestion.file}: ${suggestion.message}`));
          });
        }
        
        console.log(`\n${chalk.cyan('💡 Tips to improve SEO:')}`);
        console.log('  • Add front matter to markdown files to customize SEO');
        console.log('  • Keep titles between 50-60 characters');
        console.log('  • Write descriptions between 140-160 characters');
        console.log('  • Include relevant keywords in front matter');
        console.log('  • Ensure each page has a unique title and description');
        console.log(`\n${chalk.gray('Add to your markdown files:')}`);
        console.log(chalk.gray('---'));
        console.log(chalk.gray('title: "Your SEO Optimized Title Here"'));
        console.log(chalk.gray('description: "A compelling description between 140-160 characters."'));
        console.log(chalk.gray('keywords: ["keyword1", "keyword2", "keyword3"]'));
        console.log(chalk.gray('---'));
      }
      
    } catch (error) {
      console.error(chalk.red('Failed to analyze SEO:'), error.message);
      process.exit(1);
    }
  });

// Set Production URL command
program
  .command('set-production-url <url>')
  .description('Set the production URL to display after deployment')
  .option('-c, --config <path>', 'path to config file (default: doc-builder.config.js)')
  .addHelpText('after', `
${chalk.yellow('Examples:')}
  ${chalk.gray('$')} doc-builder set-production-url doc-builder-delta.vercel.app
  ${chalk.gray('$')} doc-builder set-production-url https://my-custom-domain.com

${chalk.yellow('This URL will be displayed after deployment instead of auto-detected URLs.')}
`)
  .action(async (url, options) => {
    try {
      const configPath = path.join(process.cwd(), options.config || 'doc-builder.config.js');
      
      // Ensure URL has protocol
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      
      if (fs.existsSync(configPath)) {
        // Update existing config
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        if (configContent.includes('productionUrl:')) {
          // Update existing productionUrl
          configContent = configContent.replace(
            /productionUrl:\s*['"][^'"]*['"]/,
            `productionUrl: '${url}'`
          );
        } else {
          // Add productionUrl to config
          configContent = configContent.replace(
            /module\.exports = {/,
            `module.exports = {\n  productionUrl: '${url}',`
          );
        }
        
        fs.writeFileSync(configPath, configContent);
        console.log(chalk.green(`✅ Production URL set to: ${url}`));
        console.log(chalk.gray(`\nThis URL will be displayed after deployment.`));
      } else {
        console.log(chalk.yellow('⚠️  No config file found. Creating one...'));
        await createDefaultConfig();
        
        // Add production URL to newly created config
        let configContent = fs.readFileSync(configPath, 'utf8');
        configContent = configContent.replace(
          /module\.exports = {/,
          `module.exports = {\n  productionUrl: '${url}',`
        );
        fs.writeFileSync(configPath, configContent);
        console.log(chalk.green(`✅ Created config with production URL: ${url}`));
      }
    } catch (error) {
      console.error(chalk.red('Failed to set production URL:'), error.message);
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
  .option('--production-url <url>', 'override production URL for this deployment')
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
     ${chalk.gray('$')} npx @knowcode/doc-builder@latest deploy
     
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
     
${chalk.yellow('Deployment Behavior:')}
  ${chalk.green.bold('🎯 DEFAULT: All deployments go to PRODUCTION')}
  
  ${chalk.gray('$')} npx @knowcode/doc-builder@latest          ${chalk.gray('# → Shows help (v1.3.0+)')}
  ${chalk.gray('$')} npx @knowcode/doc-builder@latest deploy   ${chalk.gray('# → yourdocs.vercel.app')}
  ${chalk.gray('$')} npx @knowcode/doc-builder@latest deploy --no-prod  ${chalk.gray('# → preview URL only')}

${chalk.yellow('When All Else Fails - Delete and Start Fresh:')}
  Sometimes the cleanest solution is to delete the Vercel project:
  
  1. Go to your project settings on Vercel
  2. Scroll to bottom and click ${chalk.red('"Delete Project"')}
  3. Run: ${chalk.gray('npx @knowcode/doc-builder@latest reset-vercel')}
  4. Run: ${chalk.gray('npx @knowcode/doc-builder@latest deploy')}
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
    ${chalk.gray('$')} npx @knowcode/doc-builder@latest reset-vercel
    ${chalk.gray('$')} npx @knowcode/doc-builder@latest deploy
    
    This removes old project references and starts fresh
`)
  .action(async (options) => {
    const spinner = ora('Deploying to Vercel...').start();
    
    try {
      const config = await loadConfig(options.config || 'doc-builder.config.js', { ...options, command: 'deploy' });
      
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
        console.log(chalk.gray('  npx @knowcode/doc-builder@latest deploy\n'));
        process.exit(1);
      }
      
      // Handle production URL option
      if (options.productionUrl) {
        config.productionUrl = options.productionUrl.startsWith('http') 
          ? options.productionUrl 
          : 'https://' + options.productionUrl;
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
        console.log(chalk.blue('\n🚀 First time deploying to Vercel!\n'));
        
        console.log(chalk.yellow('📝 Important: When asked about settings:'));
        console.log(chalk.gray('   • Root Directory: ') + chalk.green('leave empty'));
        console.log(chalk.gray('   • We handle the build process for you'));
        console.log();
        
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
      const result = await deployToVercel(config, isProduction);
      spinner.succeed(`Deployed successfully!`);
      
      // Handle both old and new return formats
      let deployUrl, productionUrl;
      if (typeof result === 'string') {
        // Old format - just a URL string
        deployUrl = result;
        productionUrl = null;
      } else {
        // New format - object with deployUrl and productionUrl
        deployUrl = result.deployUrl;
        productionUrl = result.productionUrl;
      }
      
      // Use the configured production URL if available, then detected, then deployment URL
      const displayUrl = config.productionUrl || productionUrl || deployUrl;
      
      console.log(chalk.green('\n✅ Deployment Complete!\n'));
      
      if (isProduction) {
        console.log(chalk.yellow('🌐 Your documentation is live at:'));
        console.log(chalk.cyan.bold(`   ${displayUrl}`) + chalk.gray(' (Production URL - share this!)'));
        console.log();
        if (productionUrl && deployUrl && productionUrl !== deployUrl) {
          console.log(chalk.gray('This deployment also created a unique preview URL:'));
          console.log(chalk.gray(`   ${deployUrl}`));
          console.log(chalk.gray('   (This URL is specific to this deployment)'));
        }
      } else {
        console.log(chalk.yellow('🔍 Preview deployment created at:'));
        console.log(chalk.cyan(`   ${deployUrl}`));
        console.log();
        console.log(chalk.gray('To deploy to production, run:'));
        console.log(chalk.gray('   npx @knowcode/doc-builder@latest deploy'));
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
        console.log(chalk.cyan('  npx @knowcode/doc-builder@latest deploy'));
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

// Setup SEO command
program
  .command('setup-seo')
  .description('Configure SEO settings for your documentation')
  .option('-c, --config <path>', 'path to config file (default: doc-builder.config.js)')
  .addHelpText('after', `
${chalk.yellow('What this does:')}
  • Configures meta tags for search engines
  • Sets up social media previews (Open Graph, Twitter Cards)
  • Enables automatic sitemap.xml generation
  • Creates robots.txt for search engines
  • Adds structured data (JSON-LD)

${chalk.yellow('What you\'ll configure:')}
  • Site URL (your production URL)
  • Author name and organization
  • Twitter handle for social cards
  • Default keywords
  • Open Graph image

${chalk.yellow('After setup:')}
  • Run ${chalk.cyan('npx @knowcode/doc-builder@latest build')} to generate with SEO
  • Check meta tags in generated HTML files
  • Submit sitemap.xml to search engines
`)
  .action(async (options) => {
    try {
      const configPath = path.join(process.cwd(), options.config || 'doc-builder.config.js');
      let config = {};
      
      // Load existing config if it exists
      if (fs.existsSync(configPath)) {
        try {
          delete require.cache[require.resolve(configPath)];
          config = require(configPath);
        } catch (e) {
          console.log(chalk.yellow('⚠️  Could not load existing config, starting fresh'));
        }
      }
      
      console.log(chalk.blue('\n🔍 SEO Setup for @knowcode/doc-builder\n'));
      console.log(chalk.gray('This wizard will help you configure SEO settings for better search engine visibility.\n'));
      
      // Interactive prompts
      const answers = await prompts([
        {
          type: 'text',
          name: 'siteUrl',
          message: 'What is your site\'s URL?',
          initial: config.seo?.siteUrl || config.productionUrl || 'https://my-docs.vercel.app',
          validate: value => {
            try {
              new URL(value);
              return true;
            } catch {
              return 'Please enter a valid URL (e.g., https://example.com)';
            }
          }
        },
        {
          type: 'text',
          name: 'author',
          message: 'Author name?',
          initial: config.seo?.author || ''
        },
        {
          type: 'text',
          name: 'twitterHandle',
          message: 'Twitter handle?',
          initial: config.seo?.twitterHandle || '',
          format: value => {
            if (!value) return '';
            return value.startsWith('@') ? value : '@' + value;
          }
        },
        {
          type: 'text',
          name: 'language',
          message: 'Site language?',
          initial: config.seo?.language || 'en-US'
        },
        {
          type: 'text',
          name: 'organizationName',
          message: 'Organization name (optional)?',
          initial: config.seo?.organization?.name || ''
        },
        {
          type: prev => prev ? 'text' : null,
          name: 'organizationUrl',
          message: 'Organization URL?',
          initial: config.seo?.organization?.url || ''
        },
        {
          type: 'text',
          name: 'ogImage',
          message: 'Default Open Graph image URL/path?',
          initial: config.seo?.ogImage || '/og-default.png',
          hint: 'Recommended: 1200x630px PNG or JPG'
        },
        {
          type: 'text',
          name: 'keywords',
          message: 'Site keywords (comma-separated)?',
          initial: Array.isArray(config.seo?.keywords) ? config.seo.keywords.join(', ') : 'documentation, guide, api'
        },
        {
          type: 'confirm',
          name: 'generateSitemap',
          message: 'Generate sitemap.xml?',
          initial: config.seo?.generateSitemap !== false
        },
        {
          type: 'confirm',
          name: 'generateRobotsTxt',
          message: 'Generate robots.txt?',
          initial: config.seo?.generateRobotsTxt !== false
        }
      ]);
      
      // Build SEO config
      const seoConfig = {
        enabled: true,
        siteUrl: answers.siteUrl,
        author: answers.author,
        twitterHandle: answers.twitterHandle,
        language: answers.language,
        keywords: answers.keywords.split(',').map(k => k.trim()).filter(k => k),
        generateSitemap: answers.generateSitemap,
        generateRobotsTxt: answers.generateRobotsTxt,
        ogImage: answers.ogImage
      };
      
      // Add organization if provided
      if (answers.organizationName) {
        seoConfig.organization = {
          name: answers.organizationName,
          url: answers.organizationUrl || answers.siteUrl
        };
      }
      
      // Update config
      config.seo = seoConfig;
      
      // Also update productionUrl if not set
      if (!config.productionUrl && answers.siteUrl) {
        config.productionUrl = answers.siteUrl;
      }
      
      // Write config file
      const configContent = `module.exports = ${JSON.stringify(config, null, 2)};\n`;
      fs.writeFileSync(configPath, configContent);
      
      console.log(chalk.green('\n✅ SEO configuration saved to ' + path.basename(configPath)));
      
      console.log(chalk.blue('\nYour documentation will now include:'));
      console.log(chalk.gray('• Meta tags for search engines'));
      console.log(chalk.gray('• Open Graph tags for social media previews'));
      console.log(chalk.gray('• Twitter Card tags for Twitter sharing'));
      console.log(chalk.gray('• JSON-LD structured data'));
      if (answers.generateSitemap) {
        console.log(chalk.gray('• Automatic sitemap.xml generation'));
      }
      if (answers.generateRobotsTxt) {
        console.log(chalk.gray('• robots.txt for crawler instructions'));
      }
      
      console.log(chalk.yellow('\n💡 Tips:'));
      if (answers.ogImage) {
        console.log(chalk.gray(`- Add an image at ${answers.ogImage} (1200x630px) for social previews`));
      }
      console.log(chalk.gray('- Run \'npx @knowcode/doc-builder@latest build\' to generate with SEO'));
      console.log(chalk.gray('- Check your SEO at: https://metatags.io'));
      
    } catch (error) {
      console.error(chalk.red('Failed to configure SEO:'), error.message);
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
          'README.md': `# Welcome to Your Documentation\n\nThis is an example documentation site created with @knowcode/doc-builder.\n\n## Features\n\n- 📝 Write in Markdown\n- 🎨 Beautiful Notion-inspired design\n- 📊 Mermaid diagram support\n- 🌙 Dark mode\n- 🚀 Deploy to Vercel\n\n## Getting Started\n\n1. Edit this file and add your content\n2. Create new markdown files\n3. Run \`npx @knowcode/doc-builder@latest\` to build and deploy\n\n## Example Diagram\n\n\`\`\`mermaid\ngraph TD\n    A[Write Docs] --> B[Build]\n    B --> C[Deploy]\n    C --> D[Share]\n\`\`\`\n`,
          'getting-started.md': `# Getting Started\n\n**Generated**: ${new Date().toISOString().split('T')[0]}\n**Status**: Draft\n**Verified**: ❓\n\n## Overview\n\nThis guide will help you get started with your documentation.\n\n## Installation\n\nNo installation required! Just use:\n\n\`\`\`bash\nnpx @knowcode/doc-builder@latest\n\`\`\`\n\n## Writing Documentation\n\n1. Create markdown files in the \`docs\` folder\n2. Use folders to organize your content\n3. Add front matter for metadata\n\n## Building\n\nTo build your documentation:\n\n\`\`\`bash\nnpx @knowcode/doc-builder@latest build\n\`\`\`\n\n## Deployment\n\nDeploy to Vercel:\n\n\`\`\`bash\nnpx @knowcode/doc-builder@latest deploy\n\`\`\`\n`,
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
        console.log(chalk.gray('2. Run `npx @knowcode/doc-builder@latest` to build and deploy'));
      } else {
        console.log(chalk.yellow('⚠️  docs/ directory already exists'));
      }
    }
  });

// Claude hints command
program
  .command('claude-hints')
  .description('Generate Claude.md hints for documentation standards')
  .option('-o, --output <path>', 'output file path (default: stdout)')
  .option('--format <format>', 'output format: md or text (default: md)')
  .addHelpText('after', `
${chalk.yellow('What this does:')}
  Generates a comprehensive guide for Claude.md configuration
  that helps Claude produce well-structured markdown documentation
  following best practices and consistent standards.

${chalk.yellow('Usage:')}
  ${chalk.gray('$')} doc-builder claude-hints                  ${chalk.gray('# Display to console')}
  ${chalk.gray('$')} doc-builder claude-hints -o CLAUDE.md     ${chalk.gray('# Save to file')}
  ${chalk.gray('$')} doc-builder claude-hints --format text    ${chalk.gray('# Plain text format')}

${chalk.yellow('What gets included:')}
  • Document structure standards
  • Naming conventions for different doc types
  • Mermaid diagram best practices
  • Information verification standards (✅/❓)
  • File organization patterns
  • Git commit practices
  • Markdown formatting guidelines
`)
  .action((options) => {
    const claudeHints = `# Documentation Standards for Claude.md

Add these instructions to your CLAUDE.md file to ensure consistent, high-quality documentation generation.

## Document Standards and Conventions

### Document Structure

**Document Title Format**
- Use \`# Document Title\`
- Include metadata:
  - **Generated**: YYYY-MM-DD HH:MM UTC
  - **Status**: Draft/In Progress/Complete
  - **Verified**: ✅ (for verified information) / ❓ (for speculated information)

### Overview Section
- Provide a brief description of the document's contents
- Clearly explain the purpose and scope

## Content Sections
### Subsection
Content with clear headings and logical flow.

## Document History
| Date | Author | Changes |
|------|--------|---------|
| YYYY-MM-DD | Name | Initial creation |
| YYYY-MM-DD | Name | Updated section X |

### Naming Conventions

- Analysis documents: analysis-{topic}-{specifics}.md
- Design documents: design-{component}-{feature}.md
- Implementation plans: plan-{feature}-implementation.md
- Technical guides: {component}-{topic}-guide.md
- Overview documents: {system}-overview.md
- Testing documents: test-{component}-{type}.md
- Troubleshooting guides: troubleshoot-{issue}-guide.md
- API documentation: api-{service}-reference.md

## Content Standards

### 1. Mermaid Diagrams
- Include diagrams wherever they help explain complex concepts
- Use consistent node naming and styling
- Add clear labels and descriptions
- Example:
\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
\`\`\`

### 2. Information Verification
- Mark all information as either verified (✅) or speculated (❓)
- Include sources for verified information
- Clearly indicate assumptions
- Example:
  - ✅ **Verified**: Based on official documentation
  - ❓ **Speculated**: Assumed based on common patterns

### 3. Code Examples
- Use proper syntax highlighting
- Include context and explanations
- Show both correct and incorrect usage where applicable
- Add comments explaining key concepts

### 4. File Organization
- Active files in appropriate directories
- Unused files moved to archive/ with descriptive names
- Temporary files include "temp" in filename
- Create docs/ directory structure:
  \`\`\`
  docs/
  ├── architecture/
  ├── api/
  ├── guides/
  ├── troubleshooting/
  └── README.md
  \`\`\`

### 5. Version Control
- Commit after material changes or milestones
- Use descriptive commit messages
- Group related changes
- Example commit messages:
  - "Add API authentication guide"
  - "Update deployment architecture diagram"
  - "Fix broken links in troubleshooting guide"

## Markdown Best Practices

### Headers
- Use hierarchical structure (H1 for title, H2 for main sections)
- Don't skip header levels
- Keep headers concise but descriptive

### Lists
- Use bullet points for unordered lists
- Use numbers for sequential steps
- Indent nested lists properly

### Tables
- Include headers and alignment
- Keep tables readable in raw markdown
- Example:
  \`\`\`markdown
  | Feature | Status | Notes |
  |---------|--------|-------|
  | Auth    | ✅ Done | Uses JWT |
  | API     | 🚧 WIP  | In progress |
  \`\`\`

### Links
- Use descriptive link text, not "click here"
- Prefer relative links for internal docs
- Check links regularly for validity

### Images
- Include alt text and captions
- Store images in docs/assets/ or docs/images/
- Use descriptive filenames

## Documentation Requirements

### Timestamp
- Always include generation date at top
- Format: **Generated**: YYYY-MM-DD HH:MM UTC

### Status Tracking
- Mark document status (Draft/Complete)
- Include last review date
- Note planned updates

### Cross-references
- Link to related documents
- Create index/navigation pages
- Maintain a documentation map

### Examples
- Include practical examples
- Show real-world use cases
- Provide sample configurations

### Troubleshooting
- Add common issues and solutions
- Include error messages verbatim
- Provide step-by-step resolution

## Quality Standards

### Clarity
- Write for your audience's technical level
- Define acronyms on first use
- Avoid jargon without explanation

### Completeness
- Cover all aspects of the topic
- Include edge cases
- Document limitations

### Accuracy
- Verify technical details
- Test code examples
- Update when systems change

### Consistency
- Use same terminology throughout
- Follow established patterns
- Maintain style guide compliance

### Maintenance
- Review quarterly
- Update version numbers
- Archive outdated content

## Special Considerations

### Security
- Never include credentials or sensitive data
- Use placeholders for secrets
- Document security implications

### Performance
- Document performance implications
- Include benchmarks where relevant
- Note resource requirements

### Dependencies
- List all dependencies and versions
- Note compatibility requirements
- Document upgrade paths

### Compatibility
- Note platform/version requirements
- Document breaking changes
- Provide migration guides

### Accessibility
- Use clear language and structure
- Provide text alternatives
- Consider screen reader users

## Additional Claude.md Instructions

### When Creating Documentation
- Always put md documents in the docs/ directory
- Use mermaid diagrams whenever it makes sense to explain something
- Explain things diagrammatically when possible
- Create any new md docs into the docs directory and put in a relevant folder

### Git Practices
- Do a git commit after material changes or milestone
- After any material changes or a milestone commit the changes to git
- As files become unused - move them to archive and rename

### Testing and Temporary Files
- When creating temporary temp files for testing - put "temp" in the file name
- Create temp files with descriptive names like "temp-test-api-response.json"

### Documentation Maintenance
- Regularly remove outdated mermaid diagram files (.md) from docs/ directory
- When diagram generation scripts are run, they should REPLACE existing MD files
- Use clean, consistent naming without version suffixes

This comprehensive guide ensures consistent, high-quality documentation that is easy to maintain and navigate.`;

    // Output the hints
    if (options.output) {
      try {
        fs.writeFileSync(options.output, claudeHints);
        console.log(chalk.green(`✅ Claude hints saved to ${options.output}`));
      } catch (error) {
        console.error(chalk.red(`Error writing file: ${error.message}`));
        process.exit(1);
      }
    } else {
      // Output to console
      if (options.format === 'text') {
        // Strip markdown formatting for plain text
        const plainText = claudeHints
          .replace(/#{1,6}\s/g, '')
          .replace(/\*\*/g, '')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        console.log(plainText);
      } else {
        console.log(claudeHints);
      }
    }
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command was provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}