# Deploying Public Documentation Sites

## Overview

The @knowcode/doc-builder now supports deploying public documentation sites without authentication. This is perfect for open-source projects, public APIs, or any documentation that doesn't require access control.

## Quick Start

### Option 1: Using CLI Flags (Recommended)

Deploy a public site without modifying your config:

```bash
# Build without authentication
npx @knowcode/doc-builder build --no-auth

# Deploy without authentication
npx @knowcode/doc-builder deploy --no-auth
```

### Option 2: Configuration File

Create a config file with authentication disabled:

```javascript
// public-doc-builder.config.js
module.exports = {
  siteName: 'My Public Documentation',
  siteDescription: 'Open source project documentation',
  
  features: {
    authentication: false,  // Disable authentication
    darkMode: true,
    mermaid: true,
    showPdfDownload: true,
    menuDefaultOpen: true
  }
};
```

Then build and deploy:

```bash
# Build with custom config
npx @knowcode/doc-builder build -c public-doc-builder.config.js

# Deploy with custom config
npx @knowcode/doc-builder deploy -c public-doc-builder.config.js
```

## Authentication Options

### 1. No Authentication (Public Site)
```javascript
features: {
  authentication: false
}
```
- Anyone can access the documentation
- No login required
- Best for public projects

### 2. Supabase Authentication (Private Site)
```javascript
features: {
  authentication: 'supabase'
},
auth: {
  supabaseUrl: 'https://xxx.supabase.co',
  supabaseAnonKey: 'your-anon-key',
  siteId: 'your-site-id'
}
```
- Users must log in to access
- Fine-grained access control
- Best for internal documentation

## CLI Flag Behavior

The `--no-auth` flag temporarily overrides your configuration:

1. **With existing auth config**: Disables authentication for that build/deploy only
2. **Without auth config**: No effect (already public)
3. **Priority**: CLI flags always override config file settings

## Example Workflows

### Public Open Source Documentation
```bash
# One-time setup
npx @knowcode/doc-builder init --example

# Deploy publicly
npx @knowcode/doc-builder deploy --no-auth
```

### Mixed Public/Private Sites
```bash
# Private site (default config has auth)
npx @knowcode/doc-builder deploy

# Public site (override with flag)
npx @knowcode/doc-builder deploy --no-auth --production-url public-docs.example.com
```

### Multiple Sites from Same Source
```bash
# Internal docs with auth
npx @knowcode/doc-builder build -c internal-config.js
npx @knowcode/doc-builder deploy -c internal-config.js

# Public docs without auth
npx @knowcode/doc-builder build -c public-config.js
npx @knowcode/doc-builder deploy -c public-config.js
```

## Vercel Deployment Notes

When deploying public sites to Vercel:

1. **No special configuration needed** - Public sites work out of the box
2. **Deployment Protection**: Already disabled for public access
3. **Custom domains**: Work the same for public and private sites

## Best Practices

### 1. Separate Configs
Create separate config files for public vs private deployments:
- `doc-builder.config.js` - Default/private configuration
- `public.config.js` - Public site configuration

### 2. Environment-Based Builds
Use environment variables to control authentication:
```javascript
features: {
  authentication: process.env.PUBLIC_DOCS ? false : 'supabase'
}
```

### 3. Clear Documentation
Always indicate whether documentation is public or requires authentication in your README or landing page.

## Migration Guide

### From Authenticated to Public
If you were using Supabase authentication and want to make your site public:

1. **Remove auth config**:
   ```javascript
   // Remove this:
   auth: {
     supabaseUrl: 'https://xxx.supabase.co',
     supabaseAnonKey: 'xxx',
     siteId: 'xxx'
   }
   ```

2. **Set authentication to false**:
   ```javascript
   features: {
     authentication: false
   }
   ```

3. **Rebuild and deploy**:
   ```bash
   npx @knowcode/doc-builder deploy
   ```

### From Public to Supabase Auth
To add authentication to a public site, see the [Supabase Authentication Guide](./supabase-auth-setup.md).

## Summary

- Use `--no-auth` flag for quick public deployments
- Set `authentication: false` in config for permanent public sites
- Mix and match public/private sites using different configs
- No additional Vercel configuration needed for public sites