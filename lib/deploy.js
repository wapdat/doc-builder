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
      initial: config.siteName || 'my-docs'
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
      initial: 0
    },
    {
      type: 'confirm',
      name: 'publicAccess',
      message: 'Make the deployment publicly accessible?',
      initial: true
    }
  ]);
  
  // Create vercel.json if it doesn't exist
  const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
  if (!fs.existsSync(vercelConfigPath)) {
    const vercelConfig = {
      outputDirectory: config.outputDir || 'html',
      framework: answers.framework === 'other' ? null : answers.framework,
      buildCommand: "npm run build:docs",
      devCommand: "npm run dev:docs",
      installCommand: "npm install",
      public: answers.publicAccess
    };
    
    fs.writeJsonSync(vercelConfigPath, vercelConfig, { spaces: 2 });
    console.log(chalk.green('✅ Created vercel.json'));
  }
  
  // Run Vercel setup
  console.log(chalk.blue('\n🔗 Linking to Vercel...\n'));
  
  try {
    execSync('vercel link', { stdio: 'inherit' });
  } catch (error) {
    console.error(chalk.red('Failed to link Vercel project'));
    process.exit(1);
  }
  
  // Important reminders for Vercel settings
  console.log(chalk.yellow('\n⚠️  IMPORTANT: Vercel Project Settings\n'));
  console.log(chalk.white('After deployment, go to your Vercel dashboard and:'));
  console.log(chalk.gray('1. Navigate to Project Settings > General'));
  console.log(chalk.gray('2. Under "Security", find "Deployment Protection"'));
  console.log(chalk.gray('3. Set "Deployment Protection" to "Disabled" for public access'));
  console.log(chalk.gray('4. Or configure authentication if you want to keep it private'));
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
  
  // Deploy command
  const deployCmd = isProd ? 'vercel --prod' : 'vercel';
  
  try {
    // Run deployment and capture output
    const output = execSync(deployCmd, { 
      cwd: process.cwd(),
      encoding: 'utf8'
    });
    
    // Extract URL from output
    const urlMatch = output.match(/https:\/\/[^\s]+/);
    const deployUrl = urlMatch ? urlMatch[0] : 'Check Vercel dashboard';
    
    return deployUrl;
  } catch (error) {
    throw new Error(`Vercel deployment failed: ${error.message}`);
  }
}

/**
 * Create deployment-specific files
 */
async function prepareDeployment(config) {
  const outputDir = path.join(process.cwd(), config.outputDir || 'html');
  
  // Create a simple index redirect if needed
  const indexPath = path.join(outputDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    const readmePath = path.join(outputDir, 'README.html');
    if (fs.existsSync(readmePath)) {
      // Create redirect
      const redirectHtml = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=README.html">
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="README.html">documentation</a>...</p>
</body>
</html>`;
      fs.writeFileSync(indexPath, redirectHtml);
    }
  }
}

module.exports = {
  setupVercelProject,
  deployToVercel,
  prepareDeployment
};