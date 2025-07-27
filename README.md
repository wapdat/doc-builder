# @knowcode/doc-builder

Beautiful documentation with the least effort possible. A zero-configuration documentation builder that transforms markdown files into stunning static sites.

[![npm version](https://img.shields.io/npm/v/@knowcode/doc-builder)](https://www.npmjs.com/package/@knowcode/doc-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/wapdat/doc-builder)](https://github.com/wapdat/doc-builder/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/wapdat/doc-builder)](https://github.com/wapdat/doc-builder/issues)

<div align="center">

🔗 **[View Live Example](https://doc-builder-delta.vercel.app)** | 📦 **[NPM Package](https://www.npmjs.com/package/@knowcode/doc-builder)** | 📚 **[Documentation](https://doc-builder-delta.vercel.app)**

### Quick Start
```bash
npx @knowcode/doc-builder@latest deploy
```

</div>

---

## 🎯 Core Value Proposition

| **Problem** | **Solution** |
|------------|-------------|
| Complex documentation setup | Zero configuration needed |
| Deployment headaches | One-command Vercel deployment |
| Expensive hosting | Free tier with Vercel |
| Ugly default themes | Beautiful Notion-inspired design |
| Manual navigation | Auto-generated from folder structure |

## What It Does

@knowcode/doc-builder transforms your markdown files into beautiful, static documentation websites. It:

- **Scans** your markdown files and automatically generates navigation
- **Converts** markdown to HTML with syntax highlighting and diagram support
- **Styles** everything with a clean, Notion-inspired theme
- **Deploys** to Vercel with a single command - leveraging their generous free tier
- **Provides** optional features like authentication, dark mode, and changelog generation, SEO

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

## ✨ Features

<table>
<tr>
<td width="50%">

### 🛠️ Core Features
- 🚀 **Zero Configuration** - Works out of the box
- 📝 **Markdown Support** - Full GitHub Flavored Markdown
- 🎨 **Beautiful Theme** - Notion-inspired design
- 📦 **Self-Contained** - No setup required
- 🤖 **Claude Code Ready** - AI-optimized workflows

</td>
<td width="50%">

### 🎯 Advanced Features  
- 🔍 **SEO Optimized** - Meta tags & structured data
- 🔐 **Optional Auth** - Supabase authentication (opt-in)
- 📊 **Mermaid Diagrams** - Built-in diagram support
- 🌙 **Dark Mode** - Automatic theme switching
- ☁️ **Vercel Deploy** - One-command deployment
- ✅ **Google Verification** - Search Console ready
- 📎 **Attachment Support** - Excel, PDF & more deploy with docs

</td>
</tr>
</table>

## 📋 Prerequisites

<table>
<tr>
<td width="50%">

### System Requirements

**Node.js** version 14.0 or higher is required to run doc-builder.

To check if you have Node.js installed:
```bash
node --version
```

If you see a version number (e.g., `v18.17.0`), you're ready to go!

</td>
<td width="50%">

### Installing Node.js & npm

**🍎 macOS**
- **Recommended**: [Download from nodejs.org](https://nodejs.org/)
- **Alternative**: Using Homebrew
  ```bash
  brew install node
  ```

**🪟 Windows**
- **Recommended**: [Download from nodejs.org](https://nodejs.org/)
- **Alternative**: Using Chocolatey
  ```bash
  choco install nodejs
  ```

</td>
</tr>
</table>

### Quick Installation Links

| Platform | Official Installer | Package Manager |
|----------|-------------------|-----------------|
| **macOS** | [Download .pkg](https://nodejs.org/en/download/) | `brew install node` |
| **Windows** | [Download .msi](https://nodejs.org/en/download/) | `choco install nodejs` |
| **Linux** | [Download options](https://nodejs.org/en/download/) | `apt install nodejs` or `yum install nodejs` |

> 💡 **Note**: npm (Node Package Manager) is included with Node.js installation automatically.

## 🚀 Getting Started

<table>
<tr>
<td width="50%">

### Option 1: NPX (No Installation)
```bash
# Deploy to Vercel
npx @knowcode/doc-builder@latest deploy

# Build static HTML
npx @knowcode/doc-builder@latest build

# Show help
npx @knowcode/doc-builder@latest
```
*Perfect for trying it out!*

</td>
<td width="50%">

### Option 2: NPM Install
```bash
# Install as dev dependency
npm install --save-dev @knowcode/doc-builder@latest

# Use shorter commands
doc-builder deploy
doc-builder build
doc-builder --help
```
*Better for regular use & offline access*

</td>
</tr>
</table>

## First-Time Vercel Deployment

The deployment process is now simpler than ever:

1. Run `npx @knowcode/doc-builder@latest deploy`
2. Answer a few simple questions (project name, etc.)
3. Vercel CLI automatically detects and configures everything
4. Get your live URL in seconds!

### Making Your Docs Public

After deployment, if you want public access:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project → Settings → Deployment Protection
3. Set **Vercel Authentication** to **Disabled**
4. Save changes

See the [First-Time Setup Guide](docs/vercel-first-time-setup-guide.md) for a complete walkthrough.

## Configuration (optional - can be managed with CLI)

Create `doc-builder.config.js` in your project root:

```javascript
module.exports = {
  // Directories
  docsDir: 'docs',
  outputDir: 'html',
  
  // Site info
  siteName: '@knowcode/doc-builder',
  siteDescription: 'Transform markdown into beautiful documentation',
  favicon: '✨',  // Can be emoji or path to image file
  
  // Production URL (optional)
  productionUrl: 'https://my-docs.vercel.app',  // Custom URL to display after deployment
  
  // Features
  features: {
    authentication: 'supabase',  // or false for no auth
    changelog: true,
    mermaid: true,
    darkMode: true,
    attachments: true           // Copy PDFs, Excel files, etc. (default: true)
  },
  
  // Supabase Authentication (v1.8.2+ has built-in defaults)
  auth: {
    supabaseUrl: process.env.SUPABASE_URL,       // Optional
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY  // Optional
    // Domain-based auth - no siteId needed!
  }
};
```

### 🔐 Authentication Setup

For secure documentation sites, use Supabase authentication:

```bash
# Initialize authentication
npx @knowcode/doc-builder auth:init

# Add your site to database  
npx @knowcode/doc-builder auth:add-site --domain docs.example.com --name "My Docs"

# Grant user access
npx @knowcode/doc-builder auth:grant --email user@example.com --site-id xxx
```

See the [Supabase Authentication Guide](docs/guides/supabase-auth-setup-guide.md) for complete setup instructions.

### 📎 Attachment Support

doc-builder automatically copies attachment files (Excel, PDF, images, etc.) to your deployment:

- **Enabled by default** - No configuration needed
- **Preserves directory structure** - Files maintain their relative paths
- **Supported file types**:
  - Documents: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.csv`, `.ppt`, `.pptx`
  - Images: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`
  - Archives: `.zip`, `.tar`, `.gz`, `.7z`, `.rar`
  - Data files: `.json`, `.xml`, `.yaml`, `.yml`
  - And more...

**Example**: If you have `docs/data/report.xlsx`, it will be copied to `html/data/report.xlsx` and links like `[Download Report](data/report.xlsx)` will work perfectly.

To disable attachment copying, use the `--no-attachments` flag with build or deploy commands.

## 📋 Commands Overview

<table>
<tr>
<td width="50%">

### 🏗️ Core Commands
| Command | Purpose |
|---------|---------|
| `build` | Generate static HTML |
| `deploy` | Deploy to Vercel |
| `init` | Initialize project |

### ⚙️ Config Commands
| Command | Purpose |
|---------|---------|
| `set-production-url` | Set custom URL |
| `reset-vercel` | Clear settings |

</td>
<td width="50%">

### 🔍 SEO Commands
| Command | Purpose |
|---------|---------|
| `seo-check` | Analyze SEO |
| `setup-seo` | Configure SEO |
| `google-verify` | Add verification |

### 📚 Documentation
All commands support `--help` for detailed options and examples.

</td>
</tr>
</table>

### 📌 Command Details

<details>
<summary><b>🏗️ build</b> - Generate static HTML files</summary>

```bash
doc-builder build [options]

Options:
  -c, --config <path>  Path to config file (default: "doc-builder.config.js")
  -i, --input <dir>    Input directory (default: docs)
  -o, --output <dir>   Output directory (default: html)
  --preset <preset>    Use a preset configuration
  --no-changelog      Disable changelog generation
  --no-attachments    Disable copying of attachment files

Examples:
  doc-builder build                          # Build with defaults
  doc-builder build --input docs --output dist
  doc-builder build --preset notion-inspired
  doc-builder build --no-attachments         # Build without copying PDFs, Excel files, etc.
```
</details>

<details>
<summary><b>☁️ deploy</b> - Deploy to Vercel</summary>

```bash
doc-builder deploy [options]

Options:
  -c, --config <path>     Path to config file
  --no-prod              Deploy as preview
  --force                Force without confirmation
  --production-url <url> Override production URL
  --no-attachments       Disable copying of attachment files

Examples:
  doc-builder deploy                    # Deploy to production
  doc-builder deploy --no-prod          # Deploy as preview
  doc-builder deploy --production-url my-docs.vercel.app
  doc-builder deploy --no-attachments  # Deploy without attachment files
```
</details>

<details>
<summary><b>🔍 seo-check</b> - Analyze SEO optimization</summary>

```bash
doc-builder seo-check [file]

Analyzes:
  • Title length (50-60 chars)
  • Meta descriptions (140-160 chars)
  • Keywords usage
  • Front matter SEO fields
  • Content quality signals

Examples:
  doc-builder seo-check              # Check all pages
  doc-builder seo-check docs/guide.md # Check specific page
```
</details>

<details>
<summary><b>✅ google-verify</b> - Add Google verification</summary>

```bash
doc-builder google-verify <code>

Examples:
  doc-builder google-verify YOUR_VERIFICATION_CODE
  doc-builder google-verify FtzcDTf5BQ9K5EfnGazQkgU2U4FiN3ITzM7gHwqUAqQ
```
</details>


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

### File and Folder Naming Conventions

- **Hidden files**: Files and folders starting with `.` (dot) are ignored
- **Private files**: Files and folders starting with `_` (underscore) are excluded from navigation
- **Authentication**: Use a `private/` folder for content requiring authentication

#### Examples:

```
docs/
├── README.md           # ✅ Included in navigation
├── guide.md            # ✅ Included
├── _draft.md           # ❌ Excluded (starts with underscore)
├── .hidden.md          # ❌ Excluded (starts with dot)
├── _internal/          # ❌ Entire folder excluded
│   └── notes.md        # ❌ Not visible in navigation
├── private/            # 🔐 Requires authentication
│   └── admin.md        # 🔐 Only visible to authenticated users
└── public/             # ✅ Normal folder
    └── faq.md          # ✅ Included
```

This is useful for:
- Keeping draft documents in your docs folder without publishing them
- Storing internal notes or templates
- Maintaining work-in-progress files alongside published documentation

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

## 🔧 Troubleshooting

<table>
<tr>
<td width="50%">

### 🐛 Common Issues

**"Command not found" error**
```bash
# Check Node.js version
node --version  # Need 14+

# Use full package name
npx @knowcode/doc-builder@latest
```

**"No markdown files found"**
- Docs in `docs/` folder?
- Files have `.md` extension?
- Try: `--input ./my-docs`

**Vercel deployment fails**
```bash
# Reset Vercel settings
npx @knowcode/doc-builder@latest reset-vercel

# Install Vercel CLI
npm install -g vercel
```

</td>
<td width="50%">

### ⚠️ NPX Cache Issues

**Symptoms:**
- Old version runs despite update
- New features unavailable
- Wrong version number shown

**Solutions:**
```bash
# Clear NPX cache
npx clear-npx-cache

# Force latest version
npx @knowcode/doc-builder@latest

# Use specific version
npx @knowcode/doc-builder@1.5.14
```

**Prevention:**
- Always use `@latest` for newest
- Clear cache when testing
- Use `npm install` for projects

</td>
</tr>
</table>

### 🪟 Windows Setup

Having issues on Windows? Check our comprehensive [Windows Setup Guide](docs/guides/windows-setup-guide.md) that covers:
- PowerShell execution policy setup
- Node.js and npm installation
- Git for Windows configuration
- Complete troubleshooting steps

### 🔗 Production URL Issues

<details>
<summary>Wrong URL displayed after deployment?</summary>

**Option 1: Config File**
```javascript
// doc-builder.config.js
module.exports = {
  productionUrl: 'https://my-docs.vercel.app'
};
```

**Option 2: CLI Command**
```bash
npx @knowcode/doc-builder@latest set-production-url my-docs.vercel.app
```

**Option 3: Deploy Override**
```bash
npx @knowcode/doc-builder@latest deploy --production-url my-docs.vercel.app
```
</details>

## 🔗 Integration Options

<table>
<tr>
<td width="50%">

### Development Integration

**NPM Link (Local Dev)**

```bash
# In doc-builder directory
npm link

# In your project
npm link @knowcode/doc-builder
```

**File Reference (Monorepos)**

```json
{
  "devDependencies": {
    "@knowcode/doc-builder": 
      "file:../path/to/doc-builder"
  }
}
```

</td>
<td width="50%">

### Production Integration

**NPM Registry (Recommended)**

```json
{
  "devDependencies": {
    "@knowcode/doc-builder": "^1.5.14"
  }
}
```

**Git Repository (Private)**

```json
{
  "devDependencies": {
    "@knowcode/doc-builder": 
      "git+https://github.com/knowcode/doc-builder.git"
  }
}
```

</td>
</tr>
</table>

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

<div align="center">

### Quick Links

[**NPM Package**](https://www.npmjs.com/package/@knowcode/doc-builder) | [**Live Demo**](https://doc-builder-delta.vercel.app) | [**Report Issues**](https://github.com/wapdat/doc-builder/issues) | [**Changelog**](CHANGELOG.md)

Made with ❤️ by the @knowcode team

</div>
