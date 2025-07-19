# @juno/doc-builder

A reusable documentation builder for creating beautiful, Notion-inspired documentation sites from markdown files.

## Features

- 📝 **Markdown to HTML** - Convert markdown files to beautiful HTML
- 🎨 **Notion-inspired Design** - Clean, modern interface
- 🔐 **Authentication** - Optional password protection
- 📊 **Mermaid Diagrams** - Built-in support for diagrams
- 🌓 **Dark Mode** - Automatic theme switching
- 📅 **Changelog Generation** - Track recent changes
- 🚀 **Vercel Deployment** - One-command deployment
- 🔄 **Live Reload** - Development server with auto-rebuild

## Installation

```bash
# As a dev dependency
npm install --save-dev @juno/doc-builder

# Or use without installation
npx @juno/doc-builder build
```

## Quick Start

1. **Initialize configuration** (optional):
   ```bash
   npx @juno/doc-builder init --config
   ```

2. **Build documentation**:
   ```bash
   npx @juno/doc-builder build
   ```

3. **Start dev server**:
   ```bash
   npx @juno/doc-builder dev
   ```

4. **Deploy to Vercel**:
   ```bash
   npx @juno/doc-builder deploy
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

Use the `cybersolstice` preset for compatibility with existing JUNO projects:

```bash
npx @juno/doc-builder build --preset cybersolstice
```

## Commands

### build
Build the documentation site:
```bash
doc-builder build [options]

Options:
  -c, --config <path>  Path to config file (default: "doc-builder.config.js")
  --preset <preset>    Use a preset configuration
  --legacy            Use legacy mode (auto-detect structure)
```

### dev
Start development server with live reload:
```bash
doc-builder dev [options]

Options:
  -c, --config <path>  Path to config file
  -p, --port <port>   Port to run dev server on (default: 3000)
```

### deploy
Deploy to Vercel:
```bash
doc-builder deploy [options]

Options:
  -c, --config <path>  Path to config file
  --prod              Deploy to production
```

### init
Initialize configuration:
```bash
doc-builder init [options]

Options:
  --config  Create configuration file
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
npm link @juno/doc-builder
```

### Option 2: File Reference

In your project's `package.json`:

```json
{
  "devDependencies": {
    "@juno/doc-builder": "file:../path/to/doc-builder"
  }
}
```

### Option 3: Git Repository

Once published:

```json
{
  "devDependencies": {
    "@juno/doc-builder": "git+https://github.com/juno/doc-builder.git"
  }
}
```

## License

MIT