# Authentication Default Change

## Overview

Starting from version 1.7.4, @knowcode/doc-builder now defaults to **no authentication** for all documentation sites. This change makes it easier to deploy public documentation without additional configuration.

## What Changed

### Before (v1.7.3 and earlier)
- Authentication was enabled by default in some presets
- Users had to explicitly disable it for public sites
- Could cause confusion when deploying public documentation

### Now (v1.7.4+)
- **No authentication by default** in all configurations
- Authentication must be explicitly enabled when needed
- Public documentation works out of the box

## Default Configuration

```javascript
// Default config now has authentication disabled
features: {
  authentication: false,  // No auth by default
  // ... other features
}
```

## Enabling Authentication

To enable Supabase authentication, explicitly set it in your config:

```javascript
// doc-builder.config.js
module.exports = {
  features: {
    authentication: 'supabase'  // Enable Supabase auth
  },
  auth: {
    supabaseUrl: 'https://xxx.supabase.co',
    supabaseAnonKey: 'your-anon-key',
    siteId: 'your-site-id'
  }
};
```

## CLI Behavior

### Building/Deploying Public Sites (Default)
```bash
# These now build/deploy public sites by default
npx @knowcode/doc-builder build
npx @knowcode/doc-builder deploy
```

### Building/Deploying Private Sites
```bash
# Use a config file with authentication enabled
npx @knowcode/doc-builder build -c private-config.js
npx @knowcode/doc-builder deploy -c private-config.js
```

### Forcing Public Build (Override Config)
```bash
# Use --no-auth to force public build even if config has auth
npx @knowcode/doc-builder build --no-auth
npx @knowcode/doc-builder deploy --no-auth
```

## Migration Guide

### If You Want Public Documentation
No changes needed! Your sites will now be public by default.

### If You Want Private Documentation
Add authentication to your config file:

```javascript
// doc-builder.config.js
module.exports = {
  siteName: 'Private Documentation',
  features: {
    authentication: 'supabase'
  },
  auth: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    siteId: process.env.DOC_SITE_ID
  }
};
```

## Best Practices

1. **Public by Default**: Most documentation should be public
2. **Explicit Auth**: Only enable authentication when truly needed
3. **Environment Variables**: Use env vars for auth credentials
4. **Separate Configs**: Use different config files for public/private versions

## Summary

- Authentication is now **disabled by default**
- Public documentation works without any auth configuration
- Enable authentication explicitly when needed with `authentication: 'supabase'`
- Use `--no-auth` flag to override authentication in configs