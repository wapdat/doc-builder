# Supabase Authentication Setup Guide

Complete guide for setting up secure authentication for your @knowcode/doc-builder documentation sites using Supabase.

## Overview

@knowcode/doc-builder supports enterprise-grade authentication through Supabase. This provides:

- **Secure authentication** with industry-standard security practices
- **Domain-based access** - automatic authentication based on site domain
- **User management** through CLI commands
- **Password reset** functionality built-in
- **Enterprise features** like audit logging and access control
- **Zero configuration** - built-in credentials (v1.8.2+)

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
-- Single table for user access control (simplified!)
CREATE TABLE docbuilder_access (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, domain)
);

-- Create index for faster lookups
CREATE INDEX idx_docbuilder_access_domain ON docbuilder_access(domain);

-- Enable Row Level Security
ALTER TABLE docbuilder_access ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own access
CREATE POLICY "Users see own access" ON docbuilder_access
    FOR SELECT USING (user_id = auth.uid());
```

## Step 3: Configure Authentication (Automatic in v1.8.2+)

As of version 1.8.2, Supabase credentials are automatically configured! You have two options:

### Option 1: Use Built-in Credentials (Recommended)
Simply create a `docs/private/` directory or set `authentication: 'supabase'` in your config. The system will automatically use the shared authentication database.

### Option 2: Use Custom Supabase Project
If you want to use your own Supabase project:

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

⚠️ **Never share your service role key** - only use the anon/public key for doc-builder.

## Step 4: Initialize Authentication

### Option 1: Automatic Setup (v1.8.2+)
Just create a config file or use the `--preset` flag:

```javascript
// doc-builder.config.js
module.exports = {
  siteName: 'My Documentation',
  
  features: {
    authentication: 'supabase'
  }
  // No auth config needed - uses built-in credentials!
};
```

### Option 2: Custom Supabase Project
If using your own Supabase project:

```javascript
module.exports = {
  siteName: 'My Documentation',
  
  features: {
    authentication: 'supabase'
  },
  
  auth: {
    supabaseUrl: 'https://xxx.supabase.co',
    supabaseAnonKey: 'eyJ...'
    // No siteId needed - uses domain automatically!
  }
};
```

## Step 5: No Site Registration Needed!

The new domain-based system eliminates the need for site registration. The system automatically uses the current domain (e.g., `docs.example.com`) as the access key. Just grant users access to your domain in the next step.

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
-- Grant access by domain (no site ID needed!)
INSERT INTO docbuilder_access (user_id, domain)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'user@example.com'),
  'docs.yourcompany.com'
);

-- Grant access to multiple domains
INSERT INTO docbuilder_access (user_id, domain) VALUES
  ((SELECT id FROM auth.users WHERE email = 'user@example.com'), 'docs.yourcompany.com'),
  ((SELECT id FROM auth.users WHERE email = 'user@example.com'), 'staging-docs.yourcompany.com'),
  ((SELECT id FROM auth.users WHERE email = 'user@example.com'), 'localhost:3000');
```

### Using CLI (Coming Soon):

```bash
npx @knowcode/doc-builder auth:grant \
  --email user@example.com \
  --domain docs.yourcompany.com
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
-- List all users for a specific domain
SELECT u.email, da.created_at as granted_at
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
WHERE da.domain = 'docs.yourcompany.com';
```

### Revoke Access

```sql
-- Remove access for a specific domain
DELETE FROM docbuilder_access 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
AND domain = 'docs.yourcompany.com';
```

### Reset User Password

Users can reset their own passwords through the login page "Forgot Password" link.

## Environment Variables (Optional)

For better security with custom Supabase projects, use environment variables:

```bash
# .env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

Update your config:

```javascript
module.exports = {
  auth: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    // No siteId needed - uses domain automatically!
  }
};
```

## Multi-Site Setup

The domain-based system makes multi-site setup incredibly simple:

1. **No site registration needed** - Each domain is automatically recognized

2. **Grant users access to multiple domains**:

```sql
-- User can access multiple documentation sites
INSERT INTO docbuilder_access (user_id, domain) VALUES
  ((SELECT id FROM auth.users WHERE email = 'user@example.com'), 'docs.product1.com'),
  ((SELECT id FROM auth.users WHERE email = 'user@example.com'), 'internal.company.com'),
  ((SELECT id FROM auth.users WHERE email = 'user@example.com'), 'api.company.com');
```

3. **Same configuration for all sites** - Just deploy to different domains!

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
- Users can only see their own access records
- Domain-based access is automatically enforced
- No way to access other users' data

## Troubleshooting

### "Invalid JWT" Errors

- Check that your Supabase URL and anon key are correct
- Ensure you're using the anon key, not the service role key
- Clear browser cookies and try again

### Users Can't Access Site

- Verify the user exists in `auth.users` table
- Check that user has access in `docbuilder_access` table for the correct domain
- Confirm the domain in the database matches your deployment URL

### Login Page Not Working

- Check browser console for JavaScript errors
- Verify Supabase credentials in generated HTML
- Ensure Supabase project is not paused

### Build Errors

- Run `npm install @supabase/supabase-js` if missing
- Check that config file has all required fields
- Validate Supabase URL format (must be https://xxx.supabase.co)

## Security Best Practices

When using Supabase authentication:

1. **Use environment variables** - Store credentials securely
2. **Enable RLS** - Always use Row Level Security on tables
3. **Regular audits** - Review user access permissions
4. **Monitor logs** - Check Supabase dashboard for anomalies
5. **Stay updated** - Keep @knowcode/doc-builder and dependencies current

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