# Documentation Index

## Overview

This directory contains additional documentation for the @knowcode/doc-builder project, organized by topic and purpose.

## Directory Structure

```
docs/
├── README.md                    # NPM readme (auto-generated)
├── documentation-index.md       # This file - documentation map
├── claude-workflow-guide.md     # AI workflow guide
└── guides/                      # How-to guides and standards
    ├── authentication-guide.md  # Authentication setup and usage
    ├── documentation-standards.md # Documentation standards
    ├── image-modal-guide.md     # Image modal feature guide
    ├── phosphor-icons-guide.md  # Emoji to icon conversion
    ├── seo-guide.md            # SEO features and configuration
    ├── seo-optimization-guide.md # SEO best practices
    └── troubleshooting-guide.md # Common issues and solutions
```

## Documentation Categories

### 📚 Core Documentation

| Document | Location | Description |
|----------|----------|-------------|
| Project Overview | [../README.md](../README.md) | Main project documentation |
| Change Log | [../CHANGELOG.md](../CHANGELOG.md) | Version history and updates |
| AI Assistant Guide | [../CLAUDE.md](../CLAUDE.md) | Claude Code integration guide |

### 📖 Guides

| Document | Location | Description |
|----------|----------|-------------|
| Document Standards | [guides/documentation-standards.md](./guides/documentation-standards.md) | How to write docs for this project |
| Authentication Guide | [guides/authentication-guide.md](./guides/authentication-guide.md) | Setting up password protection |
| Image Modal Guide | [guides/image-modal-guide.md](./guides/image-modal-guide.md) | Full-screen image viewing feature |
| HTML Embedding Guide | [guides/html-embedding-guide.md](./guides/html-embedding-guide.md) | Embed interactive HTML via iframes |
| SEO Guide | [guides/seo-guide.md](./guides/seo-guide.md) | SEO features and configuration |
| SEO Optimization Guide | [guides/seo-optimization-guide.md](./guides/seo-optimization-guide.md) | Comprehensive SEO best practices |
| Phosphor Icons Guide | [guides/phosphor-icons-guide.md](./guides/phosphor-icons-guide.md) | Emoji to icon conversion feature |
| Troubleshooting Guide | [guides/troubleshooting-guide.md](./guides/troubleshooting-guide.md) | Common issues and solutions |
| Claude Workflow | [claude-workflow-guide.md](./claude-workflow-guide.md) | Using Claude with doc-builder |

### 🔜 Coming Soon

- **API Reference** - Detailed API documentation
- **Architecture Guide** - System design and components
- **Plugin Development** - Extending doc-builder
- **Migration Guide** - Upgrading from older versions
- **Performance Guide** - Optimizing large documentation sites

## Quick Start Guides

### For Users

1. **Installation**: See [README.md](../README.md#quick-start)
2. **Configuration**: Check [CLAUDE.md](../CLAUDE.md#configuration)
3. **Deployment**: Follow [README.md](../README.md#deployment)

### For Contributors

1. **Standards**: Read [DOCUMENT-STANDARDS.md](./guides/DOCUMENT-STANDARDS.md)
2. **Development**: See [CLAUDE.md](../CLAUDE.md#development-guidelines)
3. **Testing**: Check [CLAUDE.md](../CLAUDE.md#testing-changes)

## Contributing Documentation

When adding new documentation:

1. **Follow Standards**: Use [DOCUMENT-STANDARDS.md](./guides/DOCUMENT-STANDARDS.md)
2. **Choose Location**: Place in appropriate subdirectory
3. **Update Index**: Add to this file
4. **Include Metadata**: Add headers as per standards
5. **Test Examples**: Verify all code snippets work

### Documentation Template

```markdown
# Document Title

**Generated**: YYYY-MM-DD HH:MM UTC  
**Status**: Draft/Complete  
**Verified**: ✅/❓

## Overview

Brief description...

## Main Content

Detailed information...

## Document History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| YYYY-MM-DD | 1.0 | Name | Initial creation |
```

## Maintenance

Documentation should be reviewed:
- With each minor version release
- When features change
- Quarterly for accuracy
- When issues are reported

---

## Document History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2025-07-21 | 1.0 | System | Initial documentation index |
| 2025-07-21 | 1.1 | System | Added authentication guide |
| 2025-07-21 | 1.2 | System | Added troubleshooting guide |