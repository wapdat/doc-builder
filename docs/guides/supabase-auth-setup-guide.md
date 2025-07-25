# Supabase Authentication Setup Guide

Complete guide for setting up secure authentication for your @knowcode/doc-builder documentation sites using Supabase.

## Overview

@knowcode/doc-builder now supports enterprise-grade authentication through Supabase, replacing the previous insecure basic authentication. This provides:

- **Secure authentication** with industry-standard security practices
- **Multi-site support** - one account can access multiple documentation sites
- **User management** through CLI commands
- **Password reset** functionality built-in
- **Enterprise features** like audit logging and access control

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js 14+**: Required for @knowcode/doc-builder
3. **Basic SQL knowledge**: For database setup

## Step 1: Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project name and database password
5. Select a region close to your users
6. Click "Create new project"

Wait for the project to be created (usually 1-2 minutes).

## Step 2: Create Database Tables

In your Supabase dashboard, go to **SQL Editor** and run this SQL:

```sql
-- Table 1: Documentation sites
CREATE TABLE docbuilder_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: User access mapping
CREATE TABLE docbuilder_access (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    site_id UUID REFERENCES docbuilder_sites(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, site_id)
);

-- Enable Row Level Security
ALTER TABLE docbuilder_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE docbuilder_access ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see sites they have access to
CREATE POLICY "Users see accessible sites" ON docbuilder_sites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM docbuilder_access
            WHERE site_id = docbuilder_sites.id
            AND user_id = auth.uid()
        )
    );

-- RLS Policy: Users can see their own access
CREATE POLICY "Users see own access" ON docbuilder_access
    FOR SELECT USING (user_id = auth.uid());
```

## Step 3: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

⚠️ **Never share your service role key** - only use the anon/public key for doc-builder.

## Step 4: Initialize Authentication

Run the initialization command in your documentation project:

```bash
npx @knowcode/doc-builder auth:init
```

This will prompt you for:
- Your Supabase project URL
- Your Supabase anonymous key  
- A name for your documentation site

It creates a `doc-builder.config.js` file like this:

```javascript
module.exports = {
  siteName: 'My Documentation',
  
  features: {
    authentication: 'supabase'
  },
  
  auth: {
    supabaseUrl: 'https://xxx.supabase.co',
    supabaseAnonKey: 'eyJ...',
    siteId: ''  // Will be set in next step
  }
};
```

## Step 5: Add Your Site to Database

### Option A: Using SQL (Recommended)

In Supabase SQL Editor, run:

```sql
INSERT INTO docbuilder_sites (domain, name) 
VALUES ('docs.yourcompany.com', 'Company Documentation')
RETURNING id;
```

Copy the returned ID and update your config file's `siteId` field.

### Option B: Using CLI (Coming Soon)

```bash
npx @knowcode/doc-builder auth:add-site \
  --domain docs.yourcompany.com \
  --name "Company Documentation"
```

## Step 6: Create Your First User

### Method 1: Through Supabase Dashboard

1. Go to **Authentication** → **Users** in Supabase
2. Click "Add User"
3. Enter email and password
4. Click "Create User"
5. Copy the user ID from the users table

### Method 2: Through Your App (Recommended)

Users can sign up when they visit your documentation site and try to log in.

## Step 7: Grant User Access

### Using SQL:

```sql
-- Replace with actual user ID and site ID
INSERT INTO docbuilder_access (user_id, site_id)
VALUES ('user-uuid-here', 'site-uuid-here');
```

### Using CLI (Coming Soon):

```bash
npx @knowcode/doc-builder auth:grant \
  --email user@example.com \
  --site-id your-site-uuid
```

## Step 8: Build and Deploy

```bash
# Build with Supabase authentication
npx @knowcode/doc-builder build

# Deploy to Vercel
npx @knowcode/doc-builder deploy
```

Your documentation site now has secure authentication! 🎉

## User Management

### List Users with Access

```sql
SELECT u.email, da.created_at as granted_at
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
WHERE da.site_id = 'your-site-id';
```

### Revoke Access

```sql
DELETE FROM docbuilder_access 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
AND site_id = 'your-site-id';
```

### Reset User Password

Users can reset their own passwords through the login page "Forgot Password" link.

## Environment Variables (Optional)

For better security, use environment variables:

```bash
# .env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
DOC_SITE_ID=your-site-uuid
```

Update your config:

```javascript
module.exports = {
  auth: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    siteId: process.env.DOC_SITE_ID
  }
};
```

## Multi-Site Setup

To use one Supabase project for multiple documentation sites:

1. Add each site to the database:

```sql
INSERT INTO docbuilder_sites (domain, name) VALUES
('docs.product1.com', 'Product 1 Docs'),
('internal.company.com', 'Internal Docs'),
('api.company.com', 'API Documentation');
```

2. Create separate config files for each site with different `siteId` values

3. Grant users access to specific sites:

```sql
-- User can access both Product 1 and Internal docs
INSERT INTO docbuilder_access (user_id, site_id) VALUES
('user-uuid', 'product1-site-uuid'),
('user-uuid', 'internal-site-uuid');
```

## Security Features

### What Supabase Provides

- ✅ **Password hashing** with bcrypt
- ✅ **JWT tokens** with automatic refresh
- ✅ **Session management** with secure cookies
- ✅ **Rate limiting** on authentication endpoints
- ✅ **Email verification** (optional)
- ✅ **Password reset** flows
- ✅ **Multi-factor authentication** (optional)

### Row Level Security

All data access is protected by RLS policies:
- Users can only see sites they have access to
- Users can only see their own access records
- No way to access other users' data

## Troubleshooting

### "Invalid JWT" Errors

- Check that your Supabase URL and anon key are correct
- Ensure you're using the anon key, not the service role key
- Clear browser cookies and try again

### Users Can't Access Site

- Verify the user exists in `auth.users` table
- Check that user has access in `docbuilder_access` table  
- Confirm the `site_id` matches your config

### Login Page Not Working

- Check browser console for JavaScript errors
- Verify Supabase credentials in generated HTML
- Ensure Supabase project is not paused

### Build Errors

- Run `npm install @supabase/supabase-js` if missing
- Check that config file has all required fields
- Validate Supabase URL format (must be https://xxx.supabase.co)

## Migration from Basic Auth

If you were using the old basic authentication:

1. **Update config** - Remove `username`/`password`, add Supabase fields
2. **Create users** - Add your team members to Supabase
3. **Grant access** - Give users access to your sites
4. **Update deployments** - Rebuild and redeploy your documentation

The old basic auth has been completely removed for security reasons.

## Advanced Configuration

### Custom Login Styling

Customize the login page by modifying the generated CSS:

```css
.auth-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-box {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}
```

### OAuth Providers

Enable social login in Supabase:

1. Go to **Authentication** → **Providers**
2. Enable Google, GitHub, etc.
3. Configure OAuth settings
4. Users can then sign in with social accounts

No changes needed in doc-builder - it automatically supports all Supabase auth providers.

## Support

- **Documentation Issues**: [GitHub Issues](https://github.com/wapdat/doc-builder/issues)
- **Supabase Help**: [Supabase Docs](https://supabase.com/docs)
- **Authentication Guides**: [Supabase Auth](https://supabase.com/docs/guides/auth)

## Summary

You now have secure, enterprise-grade authentication for your documentation! Key benefits:

1. **No more client-side credentials** - everything is server-validated
2. **Multi-site support** - one account for all your docs
3. **Professional features** - password reset, session management
4. **Scalable** - handles teams of any size
5. **Free tier** - supports up to 50,000 monthly active users

Your documentation is now properly secured while maintaining the simplicity that makes @knowcode/doc-builder great to use.