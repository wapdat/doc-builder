# @knowcode/doc-builder

Beautiful documentation with the least effort possible. A zero-configuration documentation builder that transforms markdown files into stunning static sites.

🔗 **[View Live Example](https://doc-builder-delta.vercel.app)** - See what your documentation will look like!

## Recent Documentation Updates (Last 14 Days)

### 🚀 System & Deployment (docs:)
- 🔄 **UPDATE**: [Claude + CLAUDE.md Documentation Workflow Guide](docs/claude-workflow-guide.md) - Documentation updates and improvements
- 🔄 **MAJOR UPDATE**: [Documentation Index](docs/documentation-index.md) - Significant updates with enhanced functionality and coverage
- 🔄 **MAJOR UPDATE**: [Document Standards for @knowcode/doc-builder](docs/guides/DOCUMENT-STANDARDS.md) - Significant updates with enhanced functionality and coverage
- 🔄 **UPDATE**: [@knowcode/doc-builder](docs/README.md) - Documentation updates and improvements
- 🔄 **UPDATE**: [Document Standards for @knowcode/doc-builder](docs/guides/document-standards.md) - Documentation updates and improvements

**Total Changes**: 0+ new documents, 5+ updates and improvements across 5 files


## Why This Project Exists

The main premise of @knowcode/doc-builder is simple: **create beautiful documentation with the least effort possible**. We believe great documentation shouldn't require complex setup, configuration files, or deployment headaches. Just write markdown, run one command, and get a professional documentation site live on the web.

## What It Does

@knowcode/doc-builder transforms your markdown files into beautiful, static documentation websites. It:

- **Scans** your markdown files and automatically generates navigation
- **Converts** markdown to HTML with syntax highlighting and diagram support
- **Styles** everything with a clean, Notion-inspired theme
- **Deploys** to Vercel with a single command - leveraging their generous free tier
- **Provides** optional features like authentication, dark mode, and changelog generation

Perfect for project documentation, API references, knowledge bases, or any content written in markdown.

## Why Vercel?

We chose Vercel as our deployment platform because of their **generous free tier** that includes:
- Unlimited personal projects
- Automatic HTTPS certificates
- Global CDN for fast loading worldwide
- Custom domains support
- Automatic deployments from Git
- No credit card required

This aligns perfectly with our mission: beautiful documentation should be accessible to everyone, without worrying about hosting costs or complex server management.

## Features

- 🚀 **Zero Configuration** - Works out of the box with sensible defaults
- 📝 **Markdown Support** - Write docs in markdown with full GitHub Flavored Markdown support
- 🎨 **Beautiful Default Theme** - Clean, responsive design inspired by Notion
- 🔐 **Optional Authentication** - Password-protect your documentation
- 📊 **Mermaid Diagrams** - Built-in support for diagrams and charts
- 🌙 **Dark Mode** - Automatic dark mode support
- 🔄 **Live Reload** - Development server with hot reloading
- ☁️ **Vercel Integration** - One-command deployment to Vercel
- 🔍 **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, and structured data
- 📦 **Self-Contained** - No configuration or setup required
- 🤖 **Claude Code Ready** - Optimized for AI-generated documentation workflows

## Quick Start

No installation needed! Just run:

```bash
# Build and deploy to Vercel
npx @knowcode/doc-builder deploy

# Other available commands:
npx @knowcode/doc-builder build   # Build HTML files only
npx @knowcode/doc-builder dev      # Start development server
npx @knowcode/doc-builder          # Show help (default behavior)
```

## Installation (Optional)

For faster execution and offline use:

```bash
npm install --save-dev @knowcode/doc-builder
```

Then use shorter commands:
```bash
doc-builder build
doc-builder dev
doc-builder deploy
```

## First-Time Vercel Deployment

When deploying for the first time, doc-builder will:

1. Check if Vercel CLI is installed
2. Guide you through project setup
3. Create `vercel.json` configuration
4. Link your project to Vercel
5. Show important reminders about Vercel settings

### Important Vercel Settings

After deployment, go to your Vercel dashboard:

1. Navigate to **Project Settings > General**
2. Under **Security**, find **Deployment Protection**
3. Set to **Disabled** for public access
4. Or configure authentication for private docs

## Configuration

Create `doc-builder.config.js` in your project root:

```javascript
module.exports = {
  // Directories
  docsDir: 'docs',
  outputDir: 'html',
  
  // Site info
  siteName: 'My Documentation',
  siteDescription: 'Documentation for my project',
  
  // Production URL (optional)
  productionUrl: 'https://my-docs.vercel.app',  // Custom URL to display after deployment
  
  // Features
  features: {
    authentication: true,
    changelog: true,
    mermaid: true,
    darkMode: true
  },
  
  // Authentication
  auth: {
    username: 'admin',
    password: 'secret'
  }
};
```

## Commands

### set-production-url
Set a custom production URL to display after deployment:
```bash
# Set your custom production URL
npx @knowcode/doc-builder set-production-url doc-builder-delta.vercel.app

# Or with full protocol
npx @knowcode/doc-builder set-production-url https://my-custom-domain.com
```

This is useful when you have a custom domain or Vercel alias that differs from the auto-detected URL.

### setup-seo
Interactive SEO configuration wizard:
```bash
# Configure all SEO settings
npx @knowcode/doc-builder setup-seo
```

This wizard helps you set up:
- Site URL and author information
- Social media meta tags (Open Graph, Twitter Cards)
- Structured data (JSON-LD)
- Automatic sitemap and robots.txt generation

See the [SEO Guide](docs/guides/seo-guide.md) for complete details.

### build
Build the documentation site to static HTML:
```bash
doc-builder build [options]

Options:
  -c, --config <path>  Path to config file (default: "doc-builder.config.js")
  -i, --input <dir>    Input directory containing markdown files (default: docs)
  -o, --output <dir>   Output directory for HTML files (default: html)
  --preset <preset>    Use a preset configuration (available: cybersolstice)
  --legacy             Use legacy mode for backward compatibility
  --no-auth            Disable authentication even if configured
  --no-changelog       Disable automatic changelog generation

Examples:
  doc-builder build                        # Build with defaults
  doc-builder build --input docs --output dist
  doc-builder build --preset notion-inspired # Use Notion-inspired preset
  doc-builder build --config my-config.js  # Use custom config
```

### dev
Start development server with live reload:
```bash
doc-builder dev [options]

Options:
  -c, --config <path>  Path to config file (default: "doc-builder.config.js")
  -p, --port <port>    Port to run dev server on (default: 3000)
  -h, --host <host>    Host to bind to (default: localhost)
  --no-open            Don't open browser automatically

Examples:
  doc-builder dev                    # Start on http://localhost:3000
  doc-builder dev --port 8080        # Use custom port
  doc-builder dev --host 0.0.0.0     # Allow external connections
```

### deploy
Deploy documentation to Vercel (requires Vercel CLI):
```bash
doc-builder deploy [options]

Options:
  -c, --config <path>         Path to config file (default: "doc-builder.config.js")
  --no-prod                   Deploy as preview instead of production
  --force                     Force deployment without confirmation
  --production-url <url>      Override production URL for this deployment

Examples:
  doc-builder deploy                                    # Deploy to production
  doc-builder deploy --no-prod                          # Deploy as preview only
  doc-builder deploy --production-url my-docs.vercel.app  # Use custom URL display

First-time setup:
  The tool will guide you through:
  1. Installing Vercel CLI (if needed)
  2. Creating a new Vercel project
  3. Configuring deployment settings
  
Important: After deployment, disable Vercel Authentication in project settings for public docs.
```

### init
Initialize doc-builder in your project:
```bash
doc-builder init [options]

Options:
  --config   Create configuration file
  --example  Create example documentation structure

Examples:
  doc-builder init --config          # Create doc-builder.config.js
  doc-builder init --example         # Create example docs folder
```

## Project Structure

Your project should follow this structure:

```
my-project/
├── docs/              # Markdown files
│   ├── README.md
│   ├── guide/
│   └── api/
├── doc-builder.config.js  # Configuration (optional)
└── package.json
```

## Working with Claude Code

Many users leverage Claude Code to create and maintain their documentation. Claude Code is particularly effective at:

### Generating Documentation
Claude Code can analyze your codebase and automatically generate comprehensive documentation:
- API documentation from code comments and function signatures
- User guides based on your application structure
- Installation and setup instructions
- Troubleshooting guides

### Documentation Conventions
When using Claude Code to generate documentation, it typically follows these patterns:
- Creates properly structured markdown files with hierarchical headings
- Includes code examples with syntax highlighting
- Generates Mermaid diagrams for visual representations
- Follows consistent naming conventions (e.g., `component-guide.md`, `api-reference.md`)
- Adds metadata headers for document tracking

### Example Claude Code Workflow
1. **Initial Documentation Generation**
   ```
   "Create comprehensive API documentation for this project"
   ```
   Claude Code will scan your codebase and generate appropriate markdown files in your `docs/` directory.

2. **Updating Documentation**
   ```
   "Update the API documentation to reflect the new authentication methods"
   ```
   Claude Code will modify existing files while preserving structure and formatting.

3. **Adding Visual Documentation**
   ```
   "Add a Mermaid diagram showing the application architecture"
   ```
   Claude Code will create diagrams that are automatically rendered by doc-builder.

### Best Practices with Claude Code
- **Structured Requests**: Be specific about what documentation you need
- **Iterative Updates**: Claude Code can update existing docs without starting from scratch
- **Review Generated Content**: Always review AI-generated documentation for accuracy
- **Maintain CLAUDE.md**: Keep project-specific instructions in a CLAUDE.md file for consistent documentation style

## Troubleshooting

### NPX Cache Issues

The npx command caches packages to speed up subsequent runs. However, this can sometimes cause you to run an older version even after updating. 

**Symptoms:**
- Running `npx @knowcode/doc-builder` shows an old version number
- New features aren't available despite updating
- Changes don't appear after publishing a new version

**Solution:**
```bash
# Clear the npx cache
npx clear-npx-cache

# Force the latest version
npx @knowcode/doc-builder@latest

# Or specify an exact version
npx @knowcode/doc-builder@1.4.22
```

**Prevention:**
- Always use `@latest` when you want the newest version
- Clear cache periodically when developing/testing new versions
- Use `npm install` for projects where you need a specific version

### Other Common Issues

**"Command not found" error**
- Ensure Node.js 14+ is installed: `node --version`
- Try with full package name: `npx @knowcode/doc-builder`

**Build fails with "No markdown files found"**
- Check that your docs are in the `docs/` folder (or specified input directory)
- Ensure files have `.md` extension
- Use `--input` flag to specify a different directory

**Vercel deployment fails**
- Run `npx @knowcode/doc-builder reset-vercel` to clear settings
- Ensure Vercel CLI is installed: `npm install -g vercel`
- Check that the `html/` directory was created by build command

**Wrong production URL displayed**
- The deployment may show a deployment-specific URL instead of your custom domain
- Solution 1: Set production URL in config:
  ```javascript
  // doc-builder.config.js
  module.exports = {
    productionUrl: 'https://my-docs.vercel.app',
    // ... other config
  };
  ```
- Solution 2: Use command to set it:
  ```bash
  npx @knowcode/doc-builder set-production-url my-docs.vercel.app
  ```
- Solution 3: Override for a single deployment:
  ```bash
  npx @knowcode/doc-builder deploy --production-url my-docs.vercel.app
  ```

## Using in Other Projects

### Option 1: NPM Link (Development)

While developing the doc-builder:

```bash
# In doc-builder directory
npm link

# In your other project
npm link @knowcode/doc-builder
```

### Option 2: File Reference

In your project's `package.json`:

```json
{
  "devDependencies": {
    "@knowcode/doc-builder": "file:../path/to/doc-builder"
  }
}
```

### Option 3: Git Repository

Once published:

```json
{
  "devDependencies": {
    "@knowcode/doc-builder": "git+https://github.com/knowcode/doc-builder.git"
  }
}
```

## License

MIT