const chalk = require('chalk');
const prompts = require('prompts');
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

/**
 * Setup Vercel project for first-time deployment
 */
async function setupVercelProject(config) {
  console.log(chalk.blue('\n📋 Setting up Vercel project...\n'));
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    console.log(chalk.red('❌ Vercel CLI not found!'));
    console.log(chalk.gray('Install it with: npm install -g vercel'));
    process.exit(1);
  }
  
  // Project setup questions
  const answers = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?',
      initial: config.siteName.toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'my-docs',
      hint: 'This will be your URL: project-name.vercel.app'
    },
    {
      type: 'text',
      name: 'productionUrl',
      message: 'Custom production URL (optional)?',
      initial: '',
      hint: 'Leave empty for auto-detection, or enter your custom domain/alias (e.g., doc-builder-delta.vercel.app)'
    },
    {
      type: 'select',
      name: 'framework',
      message: 'Which framework preset?',
      choices: [
        { title: 'Other (Static HTML)', value: 'other' },
        { title: 'Next.js', value: 'nextjs' },
        { title: 'Vite', value: 'vite' }
      ],
      initial: 0,
      hint: 'Choose "Other (Static HTML)" for doc-builder'
    },
    {
      type: 'confirm',
      name: 'publicAccess',
      message: 'Make the deployment publicly accessible?',
      initial: true,
      hint: 'Choose Yes for public docs, No for team-only access'
    }
  ]);
  
  // Create vercel.json in the output directory
  const outputDir = path.join(process.cwd(), config.outputDir || 'html');
  const vercelConfigPath = path.join(outputDir, 'vercel.json');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Create vercel.json that explicitly overrides build settings
  const vercelConfig = {
    "buildCommand": "",
    "outputDirectory": ".",
    "devCommand": "",
    "installCommand": "",
    "framework": null,
    "cleanUrls": true,
    "trailingSlash": false,
    "headers": [
      {
        "source": "/css/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/js/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/404.html"
      }
    ]
  };
  
  fs.writeJsonSync(vercelConfigPath, vercelConfig, { spaces: 2 });
  console.log(chalk.green(`✅ Created vercel.json in ${config.outputDir || 'html'} directory`));
  
  // Save production URL to config if provided
  if (answers.productionUrl) {
    const configPath = path.join(process.cwd(), 'doc-builder.config.js');
    if (fs.existsSync(configPath)) {
      try {
        let configContent = fs.readFileSync(configPath, 'utf8');
        // Add productionUrl to the config
        if (!configContent.includes('productionUrl:')) {
          configContent = configContent.replace(
            /module\.exports = {/,
            `module.exports = {\n  productionUrl: '${answers.productionUrl.startsWith('http') ? answers.productionUrl : 'https://' + answers.productionUrl}',`
          );
          fs.writeFileSync(configPath, configContent);
          console.log(chalk.green(`✅ Saved production URL to config: ${answers.productionUrl}`));
        }
      } catch (e) {
        console.log(chalk.yellow('⚠️  Could not save production URL to config file'));
      }
    }
  }
  
  // Run Vercel setup with simplified instructions
  console.log(chalk.blue('\n🔗 Linking to Vercel...\n'));
  
  console.log(chalk.yellow('When Vercel CLI asks:'));
  console.log(chalk.gray('• Set up and deploy: ') + chalk.green('YES'));
  console.log(chalk.gray('• Which scope: ') + chalk.green('Select your account'));
  console.log(chalk.gray('• Link to existing project: ') + chalk.green('YES/NO') + chalk.gray(' (your choice)'));
  console.log(chalk.gray('• Project name: ') + chalk.green(answers.projectName));
  console.log(chalk.gray('• Directory with code: ') + chalk.yellow('./') + chalk.gray(' (current directory)'));
  console.log(chalk.gray('• Modify settings: ') + chalk.red('NO'));
  console.log();
  
  try {
    // Run vercel link from the output directory
    execSync('vercel link', { 
      stdio: 'inherit',
      cwd: outputDir
    });
  } catch (error) {
    console.error(chalk.red('Failed to link Vercel project'));
    process.exit(1);
  }
  
  // Post-setup reminder
  console.log(chalk.yellow('\n📝 Quick Setup Check:'));
  console.log(chalk.gray(`1. Visit: https://vercel.com/${answers.projectName}/settings`));
  console.log(chalk.gray('2. Under "Build & Development Settings":'));
  console.log(chalk.gray('   - Root Directory should be ') + chalk.green('empty'));
  console.log(chalk.gray('   - If it shows "html", delete it'));
  console.log();
  
  if (answers.publicAccess) {
    console.log(chalk.gray('3. For public access, disable "Deployment Protection"'));
    console.log();
  }
  
  // Add .vercel to .gitignore if not already there
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignore.includes('.vercel')) {
      fs.appendFileSync(gitignorePath, '\n# Vercel\n.vercel\n');
      console.log(chalk.green('✅ Added .vercel to .gitignore'));
    }
  }
}

/**
 * Deploy to Vercel
 */
async function deployToVercel(config, isProd = false) {
  // Ensure the build output exists
  const outputPath = path.join(process.cwd(), config.outputDir || 'html');
  if (!fs.existsSync(outputPath)) {
    throw new Error(`Output directory ${outputPath} does not exist. Run 'doc-builder build' first.`);
  }
  
  // Check if CSS files exist
  const cssPath = path.join(outputPath, 'css', 'notion-style.css');
  if (!fs.existsSync(cssPath)) {
    console.log(chalk.yellow('\n⚠️  Warning: CSS files not found in output directory!'));
    console.log(chalk.yellow('   Your documentation may appear without styling.'));
    console.log(chalk.cyan('\n💡 To fix this:'));
    console.log(chalk.white('   1. Update to latest version: ') + chalk.gray('npm update @knowcode/doc-builder'));
    console.log(chalk.white('   2. Rebuild your docs: ') + chalk.gray('npx @knowcode/doc-builder build'));
    console.log(chalk.white('   3. Then deploy again: ') + chalk.gray('npx @knowcode/doc-builder deploy\n'));
  }
  
  // Simple deployment message
  console.log(chalk.blue('\n🚀 Starting deployment to Vercel...'));
  console.log(chalk.gray('This will take a few seconds...\n'));
  
  // Create vercel.json in output directory for deployment
  const vercelConfigPath = path.join(outputPath, 'vercel.json');
  if (!fs.existsSync(vercelConfigPath)) {
    // Create vercel.json that explicitly overrides build settings
    const vercelConfig = {
      "buildCommand": "",
      "outputDirectory": ".",
      "devCommand": "",
      "installCommand": "",
      "framework": null,
      "cleanUrls": true,
      "trailingSlash": false,
      "headers": [
        {
          "source": "/css/(.*)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=31536000, immutable"
            }
          ]
        },
        {
          "source": "/js/(.*)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=31536000, immutable"
            }
          ]
        }
      ],
      "rewrites": [
        {
          "source": "/(.*)",
          "destination": "/404.html"
        }
      ]
    };
    fs.writeJsonSync(vercelConfigPath, vercelConfig, { spaces: 2 });
  }
  
  // Deploy command with explicit build settings
  const deployArgs = [];
  
  if (isProd) {
    deployArgs.push('--prod');
  }
  
  const deployCmd = `vercel ${deployArgs.join(' ')}`;
  
  try {
    // Run deployment from the output directory with real-time output
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const vercelProcess = spawn('vercel', deployArgs, {
        cwd: outputPath,
        env: {
          ...process.env,
          // Force Vercel to skip build
          VERCEL_BUILD_SKIP: '1'
        },
        shell: true
      });
      
      let deployUrl = '';
      
      // Capture stdout in real-time
      vercelProcess.stdout.on('data', (data) => {
        const output = data.toString();
        process.stdout.write(output); // Show output in real-time
        
        // Try to extract URL from output
        const urlMatch = output.match(/https:\/\/[^\s]+/);
        if (urlMatch) {
          deployUrl = urlMatch[0];
        }
      });
      
      // Capture stderr
      vercelProcess.stderr.on('data', (data) => {
        process.stderr.write(data.toString());
      });
      
      vercelProcess.on('close', async (code) => {
        if (code === 0) {
          // Try to get the production URL from Vercel
          let productionUrl = null;
          
          // First, check if we have a configured production URL
          if (config.productionUrl) {
            productionUrl = config.productionUrl;
            console.log(chalk.blue('\n📌 Using configured production URL'));
          }
          
          try {
            const { execSync } = require('child_process');
            
            // Method 1: Check for project domains
            try {
              const domainsOutput = execSync('vercel domains ls', {
                cwd: outputPath,
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'ignore']
              });
              
              // Look for domains associated with this project
              const domainLines = domainsOutput.split('\n');
              for (const line of domainLines) {
                if (line.includes('.vercel.app') && !line.includes('source')) {
                  // Extract domain that looks like a custom project domain
                  const match = line.match(/([a-z0-9-]+\.vercel\.app)/);
                  if (match && !match[1].includes('lindsay-1340s-projects')) {
                    productionUrl = `https://${match[1]}`;
                    break;
                  }
                }
              }
            } catch (e) {
              // domains command might not be available
            }
            
            // Method 2: Get project info and construct standard production URL
            if (!productionUrl) {
              try {
                // Get the project name from the deployment
                const inspectOutput = execSync(`vercel inspect ${deployUrl}`, {
                  cwd: outputPath,
                  encoding: 'utf8',
                  stdio: ['pipe', 'pipe', 'ignore']
                });
                
                // Extract project name from inspect output
                const projectMatch = inspectOutput.match(/Project Name:\s+([^\s]+)/);
                if (projectMatch) {
                  const projectName = projectMatch[1];
                  // Construct the standard production URL
                  productionUrl = `https://${projectName}.vercel.app`;
                }
              } catch (e) {
                // inspect command failed
              }
            }
            
            // Method 3: Extract from deployment URL pattern
            if (!productionUrl && deployUrl) {
              // Try to extract project name from deployment URL
              // Format: https://project-name-randomhash-team.vercel.app
              const urlMatch = deployUrl.match(/https:\/\/([^-]+)-[a-z0-9]+-/);
              if (urlMatch) {
                const projectName = urlMatch[1];
                productionUrl = `https://${projectName}.vercel.app`;
              }
            }
          } catch (err) {
            // All methods failed, use deployment URL
          }
          
          resolve({ deployUrl, productionUrl });
        } else {
          reject(new Error(`Vercel deployment failed with code ${code}`));
        }
      });
      
      vercelProcess.on('error', (err) => {
        reject(new Error(`Failed to start Vercel process: ${err.message}`));
      });
    });
  } catch (error) {
    // Check if this is the common "html/html" path error
    if (error.message && error.message.includes('html/html') && error.message.includes('does not exist')) {
      console.log(chalk.red.bold('\n❌ ERROR: Vercel has incorrect Root Directory settings!\n'));
      console.log(chalk.yellow('The project is configured with Root Directory = "html"'));
      console.log(chalk.yellow('But we are already deploying FROM the html directory.\n'));
      
      console.log(chalk.green.bold('🔧 TO FIX THIS:\n'));
      console.log(chalk.white('1. Go to: ') + chalk.cyan(error.message.match(/https:\/\/vercel\.com\/[^\s]+/)?.[0] || 'https://vercel.com/dashboard'));
      console.log(chalk.white('2. Find "Root Directory" under "Build & Development Settings"'));
      console.log(chalk.white('3. ') + chalk.yellow.bold('DELETE the "html" value (leave it EMPTY)'));
      console.log(chalk.white('4. Click "Save"'));
      console.log(chalk.white('5. Run this command again\n'));
      
      console.log(chalk.gray('Alternative: Delete html/.vercel folder and set up fresh'));
      
      throw new Error('Root Directory misconfiguration - see instructions above');
    }
    
    // Check if this is the buildCommand error
    if (error.message && error.message.includes('buildCommand') && error.message.includes('should be string,null')) {
      console.log(chalk.red.bold('\n❌ ERROR: Vercel has saved build settings that conflict!\n'));
      console.log(chalk.yellow('Your Vercel project has build settings that need to be cleared.\n'));
      
      console.log(chalk.green.bold('🔧 TO FIX THIS:\n'));
      console.log(chalk.white('Option 1 - Clear project settings:'));
      console.log(chalk.cyan('1. Go to your project settings'));
      console.log(chalk.cyan('2. Under "Build & Development Settings"'));
      console.log(chalk.cyan('3. Clear ALL fields (Build Command, Output Directory, etc.)'));
      console.log(chalk.cyan('4. Save and try again\n'));
      
      console.log(chalk.white('Option 2 - Reset and start fresh:'));
      console.log(chalk.cyan('1. Run: npx @knowcode/doc-builder reset-vercel'));
      console.log(chalk.cyan('2. Run: npx @knowcode/doc-builder deploy'));
      console.log(chalk.cyan('3. Create a NEW project (don\'t link to existing)\n'));
      
      throw new Error('Build settings conflict - see instructions above');
    }
    
    throw new Error(`Vercel deployment failed: ${error.message}`);
  }
}

/**
 * Create deployment-specific files
 */
async function prepareDeployment(config) {
  const outputDir = path.join(process.cwd(), config.outputDir || 'html');
  
  // Create index.html from README.html if needed
  const indexPath = path.join(outputDir, 'index.html');
  const readmePath = path.join(outputDir, 'README.html');
  
  // Check if we need to create/replace index.html
  let shouldCreateIndex = false;
  
  if (!fs.existsSync(indexPath)) {
    shouldCreateIndex = true;
  } else {
    // Check if existing index.html needs replacement
    const indexStats = fs.statSync(indexPath);
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    if (indexStats.size < 3000 || (indexContent.includes('<title>Documentation</title>') && indexContent.includes('<ul>') && !indexContent.includes('class="navigation"'))) {
      shouldCreateIndex = true;
    } else if (!indexContent.includes('@knowcode/doc-builder')) {
      shouldCreateIndex = true;
    }
  }
  
  if (shouldCreateIndex) {
    // Check for README.html
    
    if (fs.existsSync(readmePath)) {
      // Copy README.html to index.html for proper root page
      try {
        fs.copyFileSync(readmePath, indexPath);
      } catch (error) {
        console.error(chalk.red(`Error creating index.html: ${error.message}`));
      }
    } else {
      // If no README.html, find first available HTML file or create informative page
      // No README.html, look for other HTML files
      
      // Find first available HTML file
      const htmlFiles = fs.readdirSync(outputDir)
        .filter(file => file.endsWith('.html') && file !== 'index.html' && file !== 'login.html' && file !== 'logout.html')
        .sort();
      
      if (htmlFiles.length > 0) {
        // Redirect to first HTML file
        const firstFile = htmlFiles[0];
        // Create index.html redirect
        const redirectIndex = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="0; url=${firstFile}">
  <title>${config.siteName || 'Documentation'}</title>
  <link rel="stylesheet" href="/css/notion-style.css">
</head>
<body>
  <div style="text-align: center; margin-top: 50px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <h1>📚 ${config.siteName || 'Documentation'}</h1>
    <p>Redirecting to documentation...</p>
    <p><a href="${firstFile}" style="color: #0366d6;">Click here if not redirected automatically</a></p>
  </div>
</body>
</html>`;
        fs.writeFileSync(indexPath, redirectIndex);
        // Created redirect
      } else {
        // No HTML files at all - this should never happen after build
        console.error(chalk.red('No HTML files found. Run: npx @knowcode/doc-builder build'));
        
        // Create emergency fallback page
        const { createDefaultIndexPage } = require('./core-builder');
        const fallbackIndex = await createDefaultIndexPage(outputDir, config, packageJson.version);
        fs.writeFileSync(indexPath, fallbackIndex);
        // Created fallback index.html
      }
    }
  } else {
    // index.html already exists and is valid
  }
  
  // Final check
  const finalIndexExists = fs.existsSync(indexPath);
  if (!finalIndexExists) {
    console.error(chalk.red('Failed to create index.html'));
    throw new Error('Deployment preparation failed');
  }
}

module.exports = {
  setupVercelProject,
  deployToVercel,
  prepareDeployment
};