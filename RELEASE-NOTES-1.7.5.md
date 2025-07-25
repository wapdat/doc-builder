# Release Notes - v1.7.5

## 🎉 Major Change: Authentication is Now Optional by Default!

Starting with v1.7.5, @knowcode/doc-builder defaults to creating **public documentation sites** without authentication. This aligns with the most common use case and makes it even easier to get started.

### What's New

#### 🔓 No Authentication by Default
- Documentation sites are now public by default
- No configuration needed for public docs
- Authentication must be explicitly enabled when needed

#### 🚀 New CLI Flags
- `--no-auth` flag for both build and deploy commands
- Override any authentication settings in your config
- Perfect for quick public deployments

### Examples

```bash
# Deploy public documentation (default behavior)
npx @knowcode/doc-builder deploy

# Force public deployment even if config has auth
npx @knowcode/doc-builder deploy --no-auth

# Enable authentication in config
# doc-builder.config.js
module.exports = {
  features: {
    authentication: 'supabase'  // Explicitly enable
  }
};
```

### Migration Guide

#### If you want PUBLIC documentation:
No changes needed! Your sites are now public by default.

#### If you want PRIVATE documentation:
Add this to your config:
```javascript
features: {
  authentication: 'supabase'
}
```

### Why This Change?

- Most documentation should be publicly accessible
- Reduces friction for new users
- Makes the tool more intuitive
- Authentication becomes an intentional choice

### Full Changelog

- **Changed**: Authentication disabled by default in all configurations
- **Added**: `--no-auth` flags for build and deploy commands
- **Improved**: Simplified configuration prompts
- **Docs**: Added public site deployment guide

This is a breaking change, but one that makes the tool simpler and more aligned with common use cases.