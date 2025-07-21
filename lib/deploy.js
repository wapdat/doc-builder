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
    ]
  };
  
  fs.writeJsonSync(vercelConfigPath, vercelConfig, { spaces: 2 });
  console.log(chalk.green(`✅ Created vercel.json in ${config.outputDir || 'html'} directory`));
  
  // Run Vercel setup with prominent instructions
  console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.blue('🔗 Linking to Vercel - IMPORTANT INSTRUCTIONS'));
  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  
  console.log(chalk.yellow('⚠️  FOLLOW THESE ANSWERS CAREFULLY:\n'));
  
  console.log(chalk.white('1️⃣  ') + chalk.green('Set up "~/Documents/.../html"?'));
  console.log(chalk.white('   👉 Answer: ') + chalk.yellow.bold('YES') + '\n');
  
  console.log(chalk.white('2️⃣  ') + chalk.green('Which scope should contain your project?'));
  console.log(chalk.white('   👉 Answer: ') + chalk.yellow.bold('Select your account') + ' (usually your username)\n');
  
  console.log(chalk.white('3️⃣  ') + chalk.green('Found project "username/html". Link to it?'));
  console.log(chalk.white('   👉 Answer: ') + chalk.red.bold('NO') + ' (this is NOT your project!)\n');
  
  console.log(chalk.white('4️⃣  ') + chalk.green('Link to different existing project?'));
  console.log(chalk.white('   👉 Answer: ') + chalk.yellow.bold('YES') + ' if you have an existing project');
  console.log(chalk.white('   👉 Answer: ') + chalk.yellow.bold('NO') + ' to create new project\n');
  
  console.log(chalk.white('5️⃣  ') + chalk.green('What\'s the name of your existing project?'));
  console.log(chalk.white('   👉 Answer: ') + chalk.yellow.bold(answers.projectName) + ' (your actual project name)\n');
  
  console.log(chalk.red.bold('⚠️  CRITICAL WARNING ABOUT ROOT DIRECTORY:\n'));
  console.log(chalk.bgRed.white.bold(' If Vercel asks about Root Directory or shows it in settings: '));
  console.log(chalk.bgRed.white.bold(' LEAVE IT COMPLETELY EMPTY! DO NOT ENTER "html"! '));
  console.log(chalk.white('\nWe are already in the html folder - setting Root Directory'));
  console.log(chalk.white('to "html" will cause "html/html does not exist" errors!\n'));
  
  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  
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
  
  // Important reminders for Vercel settings
  console.log(chalk.red('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.red.bold('🚨 CRITICAL POST-SETUP STEP - DO THIS NOW!'));
  console.log(chalk.red('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  
  console.log(chalk.yellow.bold('Vercel may have set Root Directory incorrectly!\n'));
  
  console.log(chalk.white.bold('1. GO TO YOUR PROJECT SETTINGS NOW:'));
  console.log(chalk.cyan(`   https://vercel.com/${answers.projectName}/settings\n`));
  
  console.log(chalk.white.bold('2. Find "Root Directory" under "Build & Development Settings"\n'));
  
  console.log(chalk.white.bold('3. CHECK THE VALUE:'));
  console.log(chalk.green('   ✅ CORRECT: ') + chalk.green.bold('Empty (blank) or "./"'));
  console.log(chalk.red('   ❌ WRONG: ') + chalk.red.bold('"html" or any other value\n'));
  
  console.log(chalk.white.bold('4. IF IT SAYS "html":'));
  console.log(chalk.yellow('   • DELETE the value completely'));
  console.log(chalk.yellow('   • Leave it EMPTY'));
  console.log(chalk.yellow('   • Click SAVE\n'));
  
  console.log(chalk.bgRed.white.bold(' Failure to do this will cause deployment errors! '));
  console.log();
  console.log(chalk.yellow('🔐 For Public Access:'));
  console.log(chalk.white('1. Navigate to Project Settings > General'));
  console.log(chalk.white('2. Under "Security", find "Deployment Protection"'));
  console.log(chalk.white('3. Set "Deployment Protection" to ') + chalk.yellow.bold('Disabled'));
  console.log();
  console.log(chalk.cyan('Dashboard URL: https://vercel.com/dashboard'));
  console.log();
  
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
      
      vercelProcess.on('close', (code) => {
        if (code === 0) {
          resolve(deployUrl || 'Check Vercel dashboard');
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
  
  // Log version for debugging
  const packageJson = require('../package.json');
  console.log(chalk.blue(`\n📦 Preparing deployment with @knowcode/doc-builder v${packageJson.version}`));
  
  // Create index.html from README.html if needed
  console.log(chalk.blue('\n📁 Deployment preparation - index.html check:'));
  const indexPath = path.join(outputDir, 'index.html');
  const readmePath = path.join(outputDir, 'README.html');
  
  console.log(chalk.gray(`  - Output directory: ${outputDir}`));
  console.log(chalk.gray(`  - Output dir exists: ${fs.existsSync(outputDir)}`));
  
  if (fs.existsSync(outputDir)) {
    const files = fs.readdirSync(outputDir);
    const htmlFiles = files.filter(f => f.endsWith('.html'));
    console.log(chalk.gray(`  - Total files: ${files.length}`));
    console.log(chalk.gray(`  - HTML files: [${htmlFiles.slice(0, 5).join(', ')}${htmlFiles.length > 5 ? '...' : ''}]`));
  }
  
  console.log(chalk.gray(`  - Checking index.html: ${fs.existsSync(indexPath) ? 'exists' : 'missing'}`));
  console.log(chalk.gray(`  - Index path: ${indexPath}`));
  
  // Check if we need to create/replace index.html
  let shouldCreateIndex = false;
  
  if (!fs.existsSync(indexPath)) {
    console.log(chalk.yellow('  ⚠️  index.html is missing, attempting to create...'));
    shouldCreateIndex = true;
  } else {
    // Check if existing index.html needs replacement
    const indexStats = fs.statSync(indexPath);
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    if (indexStats.size < 3000 || (indexContent.includes('<title>Documentation</title>') && indexContent.includes('<ul>') && !indexContent.includes('class="navigation"'))) {
      console.log(chalk.yellow(`  ⚠️  Existing index.html appears to be a directory listing (${indexStats.size} bytes), will replace`));
      shouldCreateIndex = true;
    } else if (!indexContent.includes('@knowcode/doc-builder')) {
      console.log(chalk.yellow('  ⚠️  Existing index.html was not created by doc-builder, will replace'));
      shouldCreateIndex = true;
    }
  }
  
  if (shouldCreateIndex) {
    console.log(chalk.gray(`  - Checking README.html: ${fs.existsSync(readmePath) ? 'exists' : 'missing'}`));
    console.log(chalk.gray(`  - README path: ${readmePath}`));
    
    if (fs.existsSync(readmePath)) {
      // Copy README.html to index.html for proper root page
      console.log(chalk.blue('  → Copying README.html to index.html...'));
      try {
        fs.copyFileSync(readmePath, indexPath);
        console.log(chalk.green('  ✅ Successfully copied README.html to index.html'));
        
        // Verify the copy
        if (fs.existsSync(indexPath)) {
          const readmeStats = fs.statSync(readmePath);
          const indexStats = fs.statSync(indexPath);
          console.log(chalk.gray(`  - README.html size: ${readmeStats.size} bytes`));
          console.log(chalk.gray(`  - index.html size: ${indexStats.size} bytes`));
          
          if (readmeStats.size === indexStats.size) {
            console.log(chalk.green('  ✅ File sizes match - copy successful'));
          } else {
            console.log(chalk.yellow('  ⚠️  File sizes do not match!'));
          }
        } else {
          console.log(chalk.red('  ❌ ERROR: index.html was not created after copy!'));
        }
      } catch (error) {
        console.log(chalk.red(`  ❌ ERROR copying file: ${error.message}`));
        console.log(chalk.red(`  - Error stack: ${error.stack}`));
      }
    } else {
      // If no README.html, find first available HTML file or create informative page
      console.log(chalk.yellow('⚠️  No README.html found, looking for other HTML files...'));
      
      // Find first available HTML file
      const htmlFiles = fs.readdirSync(outputDir)
        .filter(file => file.endsWith('.html') && file !== 'index.html' && file !== 'login.html' && file !== 'logout.html')
        .sort();
      
      if (htmlFiles.length > 0) {
        // Redirect to first HTML file
        const firstFile = htmlFiles[0];
        console.log(chalk.green(`✅ Creating index.html redirect to ${firstFile}`));
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
        console.log(chalk.green(`✅ Created index.html redirect to ${firstFile}`));
      } else {
        // No HTML files at all - this should never happen after build
        console.log(chalk.red('❌ No HTML files found in output directory!'));
        console.log(chalk.yellow('📌 This indicates a build issue. Please run: npx @knowcode/doc-builder build'));
        
        // Create emergency fallback page
        const { createDefaultIndexPage } = require('./core-builder');
        const fallbackIndex = await createDefaultIndexPage(outputDir, config, packageJson.version);
        fs.writeFileSync(indexPath, fallbackIndex);
        console.log(chalk.green('✅ Created fallback index.html with instructions'));
      }
    }
  } else {
    console.log(chalk.gray('  ✓ index.html already exists and appears valid'));
    const stats = fs.statSync(indexPath);
    console.log(chalk.gray(`  - Keeping existing index.html (${stats.size} bytes)`));
  }
  
  // Final check - log what files exist
  console.log(chalk.blue('\n📁 Final deployment state:'));
  
  // Double-check index.html one more time
  const finalIndexExists = fs.existsSync(indexPath);
  console.log(chalk[finalIndexExists ? 'green' : 'red'](`  - index.html: ${finalIndexExists ? 'EXISTS' : 'MISSING'}`));
  
  if (finalIndexExists) {
    const stats = fs.statSync(indexPath);
    console.log(chalk.gray(`  - index.html size: ${stats.size} bytes`));
    console.log(chalk.gray(`  - index.html modified: ${stats.mtime.toISOString()}`));
  }
  
  const finalFiles = fs.readdirSync(outputDir)
    .filter(file => file.endsWith('.html'))
    .slice(0, 5); // Show first 5 HTML files
  console.log(chalk.gray(`\n  HTML files in ${outputDir}:`));
  finalFiles.forEach(file => {
    const size = fs.statSync(path.join(outputDir, file)).size;
    console.log(chalk.gray(`  - ${file} (${size} bytes)`));
  });
  if (fs.readdirSync(outputDir).filter(f => f.endsWith('.html')).length > 5) {
    console.log(chalk.gray(`  - ... and ${fs.readdirSync(outputDir).filter(f => f.endsWith('.html')).length - 5} more HTML files`));
  }
}

module.exports = {
  setupVercelProject,
  deployToVercel,
  prepareDeployment
};