# @knowcode/doc-builder

A zero-configuration documentation builder for markdown-based sites with Vercel deployment support.

## What It Does

@knowcode/doc-builder transforms your markdown files into beautiful, static documentation websites. It:

- **Scans** your markdown files and automatically generates navigation
- **Converts** markdown to HTML with syntax highlighting and diagram support
- **Styles** everything with a clean, Notion-inspired theme
- **Deploys** to Vercel with a single command - no configuration needed
- **Provides** optional features like authentication, dark mode, and changelog generation

Perfect for project documentation, API references, knowledge bases, or any content written in markdown.

## Features

- 🚀 **Zero Configuration** - Works out of the box with sensible defaults
- 📝 **Markdown Support** - Write docs in markdown with full GitHub Flavored Markdown support
- 🎨 **Beautiful Default Theme** - Clean, responsive design inspired by Notion
- 🔐 **Optional Authentication** - Password-protect your documentation
- 📊 **Mermaid Diagrams** - Built-in support for diagrams and charts
- 🌙 **Dark Mode** - Automatic dark mode support
- 🔄 **Live Reload** - Development server with hot reloading
- ☁️ **Vercel Integration** - One-command deployment to Vercel
- 📦 **Self-Contained** - No configuration or setup required

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

## Presets

Use the `notion-inspired` preset for a clean, modern documentation style:

```bash
npx @knowcode/doc-builder build --preset notion-inspired
```

## Commands

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
  -c, --config <path>  Path to config file (default: "doc-builder.config.js")
  --prod               Deploy to production (default: preview deployment)
  --no-build           Skip building before deployment
  --force              Force deployment without confirmation

Examples:
  doc-builder deploy                 # Deploy preview to Vercel
  doc-builder deploy --prod          # Deploy to production
  doc-builder deploy --no-build      # Deploy existing build

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