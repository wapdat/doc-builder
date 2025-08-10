# CLAUDE.md - @knowcode/doc-builder

This file provides comprehensive guidance for Claude Code when working with the @knowcode/doc-builder project - a Notion-inspired documentation generator that converts markdown files to beautiful static HTML sites with Vercel deployment support.

## Project Overview

**Name**: @knowcode/doc-builder  
**Version**: 1.4.3  
**Purpose**: Transform markdown documentation into beautiful, searchable static HTML sites with a Notion-inspired design  
**NPM Package**: Published at https://www.npmjs.com/package/@knowcode/doc-builder
**GitHub Repository**: https://github.com/wapdat/doc-builder

### Key Features
- 📝 **Markdown to HTML conversion** with syntax highlighting and mermaid diagram support
- 🎨 **Notion-inspired design** with dark mode support
- 🚀 **One-command Vercel deployment** with zero configuration
- 🔍 **Auto-generated navigation** from folder structure
- 🔐 **Optional authentication** for private documentation
- 📊 **Mermaid diagram support** out of the box
- 📱 **Fully responsive** design
- 🔧 **Zero configuration** - works with sensible defaults

## Emoji to Icon Mapping

The project includes automatic emoji to Phosphor icon conversion in markdown files. To add new emoji mappings:

### Adding New Emoji Mappings

1. **Location**: Edit `lib/emoji-mapper.js`
2. **Structure**: Add entries to the `emojiToPhosphor` object
3. **Format**: `'🏷️': '<i class="ph ph-tag" aria-label="tag"></i>'`

### Guidelines for New Mappings

- **Categorization**: Place emojis in appropriate sections (UI & Design, Actions & Navigation, etc.)
- **Icon Selection**: Use appropriate Phosphor icons from https://phosphoricons.com
- **Aria Labels**: Include descriptive aria-label attributes for accessibility
- **Semantic Matching**: Choose icons that best represent the emoji's meaning

### Example Addition

```javascript
// In the UI & Design section
'🏷️': '<i class="ph ph-tag" aria-label="tag"></i>',
'👁️': '<i class="ph ph-eye" aria-label="view"></i>',
```

### Available Phosphor Icon Weights

The system supports different icon weights via configuration:
- `regular` (default)
- `thin`
- `light` 
- `bold`
- `fill`
- `duotone`

## Documentation Guidelines

- For this project documentation, do not include in each document:
  - Generated timestamp
  - Status field
  - Verification status
- We do not want these metadata fields in the project documentation

## NPM Publishing

### Easy Publishing Workflow

The simple way to publish to npm:

1. **Update version** in `package.json`
2. **Commit changes**: `git add . && git commit -m "feat: description"`
3. **Publish**: `npm publish`

### Prerequisites

- Logged into npm: `npm whoami` 
- Version not already published
- Working directory clean

### Notes

- Use `npm publish` directly instead of the interactive script
- No need for complex automation - npm handles everything
- Package automatically includes all necessary files via package.json