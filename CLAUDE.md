# CLAUDE.md - @knowcode/doc-builder

This file provides comprehensive guidance for Claude Code when working with the @knowcode/doc-builder project - a Notion-inspired documentation generator that converts markdown files to beautiful static HTML sites with Vercel deployment support.

## Project Overview

**Name**: @knowcode/doc-builder  
**Version**: 1.4.3  
**Purpose**: Transform markdown documentation into beautiful, searchable static HTML sites with a Notion-inspired design  
**NPM Package**: Published at https://www.npmjs.com/package/@knowcode/doc-builder

### Key Features
- 📝 **Markdown to HTML conversion** with syntax highlighting and mermaid diagram support
- 🎨 **Notion-inspired design** with dark mode support
- 🚀 **One-command Vercel deployment** with zero configuration
- 🔍 **Auto-generated navigation** from folder structure
- 🔐 **Optional authentication** for private documentation
- 📊 **Mermaid diagram support** out of the box
- 📱 **Fully responsive** design
- 🔧 **Zero configuration** - works with sensible defaults

## Repository Structure

```
doc-builder/
├── assets/                 # Static assets (CSS, JS)
│   ├── css/
│   │   └── notion-style.css   # Main stylesheet
│   └── js/
│       ├── main.js            # Client-side functionality
│       └── auth.js            # Authentication logic
├── lib/                   # Core library files
│   ├── builder.js         # Main build orchestrator
│   ├── core-builder.js    # Core build logic & HTML generation
│   ├── config.js          # Configuration management
│   ├── deploy.js          # Vercel deployment logic
│   └── dev-server.js      # Development server
├── scripts/               # NPM scripts
│   ├── npx-runner.js      # NPX entry point
│   └── setup.js           # Post-install setup
├── templates/             # HTML templates
├── cli.js                 # CLI entry point
├── index.js               # Programmatic API entry point
├── package.json           # NPM configuration
├── CHANGELOG.md           # Version history
└── README.md              # User documentation
```

## Technical Architecture

### Core Components

1. **CLI Interface** (`cli.js`)
   - Commander.js based CLI with commands: build, dev, deploy, init
   - Extensive help documentation built-in
   - Interactive prompts for Vercel deployment

2. **Build System** (`lib/core-builder.js`)
   - Scans for markdown files recursively
   - Extracts titles and summaries for navigation tooltips
   - Generates HTML with embedded navigation
   - Copies static assets
   - Auto-generates README.md if missing

3. **Navigation System**
   - Automatically builds hierarchical navigation from folder structure
   - Collapsible folder sections
   - Active page highlighting
   - Tooltips showing document summaries
   - Search/filter functionality

4. **Deployment System** (`lib/deploy.js`)
   - Integrated Vercel deployment
   - Automatic project setup for first-time users
   - Production and preview deployments
   - vercel.json generation for proper routing

### Key Functions

#### core-builder.js
- `buildDocumentation(config)` - Main build orchestrator
- `processMarkdownFile(file, output, allFiles, config)` - Process individual markdown files
- `extractSummary(content)` - Extract document summary for tooltips
- `buildNavigationStructure(files, currentFile)` - Build navigation tree
- `generateHTML(title, content, navigation, currentPath, config)` - Generate final HTML

#### deploy.js
- `deployToVercel(config, isProduction)` - Deploy to Vercel
- `setupVercelProject(config)` - First-time Vercel setup
- `prepareDeployment(config)` - Prepare files for deployment

## Configuration

### Default Configuration (doc-builder.config.js)
```javascript
module.exports = {
  siteName: 'Documentation',
  siteDescription: 'Documentation site',
  docsDir: 'docs',          // Input directory
  outputDir: 'html',        // Output directory
  features: {
    authentication: false,   // Enable password protection
    changelog: true,        // Auto-generate changelog
    mermaid: true,          // Mermaid diagram support
    darkMode: true          // Dark mode toggle
  }
};
```

### Presets
The tool supports presets for common configurations. Currently available:
- `notion-inspired` - Default Notion-like styling

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Run locally (development)
node cli.js dev

# Build documentation
node cli.js build

# Deploy to Vercel
node cli.js deploy
```

### Testing
```bash
# Pack for local testing
npm pack

# Test in another project
npm install /path/to/doc-builder/knowcode-doc-builder-1.4.3.tgz
```

### Publishing
```bash
# Update version in package.json
npm version patch  # or minor/major

# Publish to npm
npm publish

# Tag release
git tag v1.4.3
git push origin v1.4.3
```

## Recent Changes & Known Issues

### Version 1.4.3 (2025-07-20)
- Fixed tooltip functionality by restoring extractSummary function
- Removed unwanted Home link from sidebar
- Fixed excessive left padding issue caused by JavaScript margin-left assignments

### Version 1.4.2 (2025-01-20)
- Fixed content layout to use flexbox properly
- Removed dynamic margin-left JavaScript that was overriding CSS

### Known Issues
- NPX caching can cause older versions to run - use `npm install` instead
- Global npm packages can interfere - check with `which doc-builder`

## Development Guidelines

### Code Style
- Use ES6+ features where appropriate
- Maintain consistent error handling with try/catch blocks
- Use chalk for colored console output
- Use ora for loading spinners
- Clear, descriptive variable and function names

### Testing Changes
1. Build the package: `npm pack`
2. Test in a real project before publishing
3. Verify all commands work: build, dev, deploy
4. Check generated HTML renders correctly
5. Test Vercel deployment

### Git Workflow
1. Create feature branch from main
2. Make changes with clear commits
3. Update CHANGELOG.md
4. Update version in package.json
5. Create PR with description of changes
6. After merge, publish to npm

### Publishing Checklist
- [ ] Update version in package.json
- [ ] Update CHANGELOG.md with changes
- [ ] Run `npm pack` and test locally
- [ ] Commit changes with version bump
- [ ] Run `npm publish`
- [ ] Create git tag for version
- [ ] Push tag to GitHub

## Debugging Tips

### Common Issues

1. **Build not finding files**
   - Check docsDir configuration
   - Ensure markdown files have .md extension
   - Check for hidden directories (start with .)

2. **Vercel deployment fails**
   - Ensure Vercel CLI is installed globally
   - Check authentication with `vercel whoami`
   - Verify Root Directory is empty in Vercel settings

3. **Styles not loading**
   - Check asset paths in generated HTML
   - Verify assets are copied to output directory
   - Check browser console for 404 errors

4. **Navigation not showing files**
   - Check file paths don't contain special characters
   - Verify markdown files are valid
   - Check console for JavaScript errors

### Debug Mode
Set environment variables for more verbose output:
```bash
DEBUG=doc-builder* node cli.js build
```

## Integration with Other Projects

### As NPM Dependency
```json
{
  "devDependencies": {
    "@knowcode/doc-builder": "^1.4.3"
  },
  "scripts": {
    "build:docs": "doc-builder build",
    "dev:docs": "doc-builder dev",
    "deploy:docs": "doc-builder deploy"
  }
}
```

### Programmatic Usage
```javascript
const { build } = require('@knowcode/doc-builder');

const config = {
  siteName: 'My Docs',
  docsDir: './documentation',
  outputDir: './dist'
};

build(config).then(() => {
  console.log('Build complete!');
});
```

## Architecture Decisions

### Why Flexbox for Layout?
- Avoids JavaScript-based resizing issues
- Better responsive behavior
- Simpler to maintain
- Native browser support

### Why Extract Git History?
- This project was extracted from a monorepo using `git filter-branch`
- Preserves commit history for better understanding of evolution
- Allows independent versioning and releases

### Why Notion-Inspired Design?
- Clean, modern interface
- Familiar to many users
- Good information hierarchy
- Excellent readability

## Future Enhancements

### Planned Features
- [ ] Full-text search functionality
- [ ] PDF export capability
- [ ] Multiple theme support
- [ ] Plugin system for extensions
- [ ] Improved mermaid diagram styling
- [ ] Better mobile navigation UX

### Technical Debt
- [ ] Add comprehensive test suite
- [ ] Refactor CSS to use CSS modules or styled-components
- [ ] Improve build performance for large documentation sets
- [ ] Add progress indicators for long builds

## Support & Contributing

### Getting Help
- File issues at: https://github.com/your-username/doc-builder/issues
- Check existing issues before creating new ones
- Include version number and error messages

### Contributing
1. Fork the repository
2. Create feature branch
3. Add tests if applicable
4. Update documentation
5. Submit pull request

## License

MIT License - See LICENSE file for details

### NPM Features Documentation
- When we add new features - add it to the NPM documented bullet point features - if its a big feature give it a section

## Publishing Memories
- Note how to publish the npm and that there is a @publish.sh script to help

---

**Note**: This project was extracted from the cybersolstice monorepo on 2025-07-21 with full git history preservation.