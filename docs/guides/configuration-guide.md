# Configuration Guide

This guide explains how @knowcode/doc-builder handles configuration files and settings.

## 📍 Config File Location

The configuration file is located at the root of your project:

```
your-project/
├── docs/                    # Your markdown files
├── doc-builder.config.js    # Configuration file
├── package.json
└── README.md
```

## 🔄 Automatic Configuration Management

### Config File Creation

When you run any doc-builder command, the system automatically:

1. **Checks for existing config** - Looks for `doc-builder.config.js`
2. **Creates if missing** - Generates a complete config file with all default settings
3. **Preserves customizations** - Your existing settings are never overwritten

### Auto-Update on Version Upgrades

When you upgrade to a newer version of doc-builder:

```bash
npx @knowcode/doc-builder@latest deploy
```

The system automatically:
- ✅ **Detects version changes** using semantic versioning
- 🔄 **Migrates your config** by adding new default options
- 💾 **Creates backups** before making changes (e.g., `doc-builder.config.js.backup.1234567890`)
- ✨ **Logs new features** that were added to your configuration

## 📋 Default Configuration Structure

Here's what gets created automatically:

```javascript
module.exports = {
  "configVersion": "1.9.7",
  "siteName": "Documentation",
  "siteDescription": "Documentation site built with @knowcode/doc-builder",
  "docsDir": "docs",
  "outputDir": "html",
  "favicon": "✨",
  
  "features": {
    "authentication": false,
    "changelog": true,
    "mermaid": true,
    "mermaidEnhanced": true,
    "tooltips": true,
    "search": false,
    "darkMode": true,
    "phosphorIcons": true,
    "phosphorWeight": "regular",
    "phosphorSize": "1.2em",
    "normalizeTitle": true,
    "showPdfDownload": true,
    "menuDefaultOpen": true,
    "attachments": true,
    "dynamicNavIcons": true,
    "subtleColors": true
  },
  
  "auth": {
    "supabaseUrl": "",
    "supabaseAnonKey": ""
  },
  
  "changelog": {
    "daysBack": 14,
    "enabled": true
  },
  
  "folderOrder": [],
  "folderDescriptions": {},
  "folderIcons": {},
  
  "deployment": {
    "platform": "vercel",
    "outputDirectory": "html"
  },
  
  "seo": {
    "enabled": true,
    "siteUrl": "",
    "author": "",
    "twitterHandle": "",
    "language": "en-US",
    "keywords": [],
    "titleTemplate": "{pageTitle} | {siteName}",
    "autoKeywords": true,
    "keywordLimit": 7,
    "descriptionFallback": "smart",
    "organization": {
      "name": "",
      "url": "",
      "logo": ""
    },
    "ogImage": "",
    "generateSitemap": true,
    "generateRobotsTxt": true,
    "customMetaTags": []
  },
  
  "attachmentTypes": [
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv",
    ".ppt", ".pptx", ".txt", ".rtf", ".html", ".htm",
    ".zip", ".tar", ".gz", ".7z", ".rar",
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp",
    ".ico", ".bmp", ".json", ".xml", ".yaml", ".yml",
    ".toml", ".mp4", ".mp3", ".wav", ".avi", ".mov"
  ]
};
```

## 🎛️ Key Configuration Options

### Site Identity
- **`siteName`** - Your documentation site name
- **`siteDescription`** - Brief description for SEO
- **`favicon`** - Site icon (emoji or image path)

### Directory Structure
- **`docsDir`** - Source markdown directory (default: `docs`)
- **`outputDir`** - Generated HTML directory (default: `html`)

### Features Toggle
- **`dynamicNavIcons`** - Status-based navigation icons
- **`subtleColors`** - Colored status indicators
- **`darkMode`** - Theme switching support
- **`mermaid`** - Diagram rendering
- **`mermaidEnhanced`** - Enhanced diagram styling with rounded corners (v1.9.18+)
- **`authentication`** - Private content protection

### Advanced Settings
- **`phosphorWeight`** - Icon thickness (`thin`, `light`, `regular`, `bold`, `fill`)
- **`phosphorSize`** - Icon size relative to text
- **`attachmentTypes`** - File types to copy during build

## 📊 Mermaid Diagram Configuration

### Enhanced Styling (v1.9.18+)

The new `mermaidEnhanced` feature provides professional diagram styling:

```javascript
features: {
  mermaid: true,           // Enable Mermaid diagrams
  mermaidEnhanced: true,   // Enhanced styling with rounded corners
}
```

**Enhanced Features:**
- 🎨 **Rounded corners** (8px radius) on all diagram shapes
- 🎨 **Notion-inspired color palette** for better visual integration
- 🌙 **Automatic theme support** for light and dark modes
- ✨ **Improved spacing** and typography consistency

**To disable enhanced styling:**
```javascript
features: {
  mermaid: true,
  mermaidEnhanced: false,  // Use default Mermaid styling
}
```

## 🚀 No Manual Editing Required

The beauty of this system is that you typically **never need to manually edit** the config file:

1. **Default creation** - Perfect defaults for most use cases
2. **CLI overrides** - Command-line options override config when needed
3. **Automatic updates** - New features added seamlessly
4. **Smart detection** - Private directories auto-enable authentication

## 🔍 Migration Logs

When your config is updated, you'll see helpful output:

```bash
🔄 Migrating config from 1.9.6 to 1.9.7
✨ Added new features: Dynamic navigation icons, Subtle status colors
💾 Backed up existing config to doc-builder.config.js.backup.1234567890
✅ Updated config file: doc-builder.config.js
```

## 🛟 Recovery & Rollback

If something goes wrong:

1. **Check backups** - Look for `.backup` files in your project root
2. **Restore manually** - Copy backup content back to `doc-builder.config.js`
3. **Delete and regenerate** - Remove config file and run any command to recreate

## 💡 Best Practices

- ✅ **Commit config files** - Include `doc-builder.config.js` in version control
- ✅ **Keep backups** - Don't delete `.backup` files immediately
- ✅ **Use CLI commands** - Let the tool manage configuration
- ❌ **Avoid manual editing** - Unless you need very specific customizations

This automatic configuration system ensures you always have the latest features while maintaining your customizations!