# Authentication Guide for @knowcode/doc-builder

> **🎉 Update v1.8.2**: Supabase credentials are now automatically configured! No manual setup needed - just enable authentication and add users to the database.

> **📚 Looking for complete documentation?** See the [Complete Supabase Authentication Guide](supabase-authentication-complete-guide.md) for detailed setup, troubleshooting, and advanced features.

## Overview

@knowcode/doc-builder supports enterprise-grade authentication through **Supabase** - a secure, scalable authentication platform. This guide explains how to protect your documentation with proper user authentication and access control.

## Why Supabase?

- 🔐 **Enterprise Security**: JWT tokens, bcrypt password hashing, Row Level Security
- 👥 **Multi-User Support**: Unlimited users with fine-grained access control
- 🌍 **Scalable**: Built on PostgreSQL, handles millions of users
- 🔄 **Real-time**: Live updates when permissions change
- 💰 **Generous Free Tier**: 50,000 monthly active users free

## How It Works

```mermaid
graph TD
    A[User visits page] --> B{Has JWT Token?}
    B -->|No| C[Redirect to login]
    B -->|Yes| D[Verify with Supabase]
    C --> E[Enter credentials]
    E --> F[Authenticate with Supabase]
    F --> G{Valid?}
    G -->|No| H[Show error]
    G -->|Yes| I[Receive JWT token]
    I --> J[Check site access]
    J --> K{Has access?}
    K -->|Yes| L[Show content]
    K -->|No| M[Access denied]
    D --> J
    
    style A fill:#e1f5fe
    style L fill:#c8e6c9
    style M fill:#ffcdd2
```

## Setting Up Authentication

### Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### Step 2: Configure doc-builder (Mostly Automatic!)

As of v1.8.2, Supabase credentials are automatically configured. You have two options:

**Option 1: Automatic (Recommended)**
Just create a `docs/private/` directory and authentication is automatically enabled with built-in credentials.

**Option 2: Custom Configuration**
Create or update `doc-builder.config.js` (only if using your own Supabase project):

```javascript
module.exports = {
  siteName: 'My Documentation',
  
  features: {
    authentication: 'supabase'  // Enable Supabase auth
  },
  
  auth: {
    supabaseUrl: 'https://your-project.supabase.co',  // Optional - has defaults
    supabaseAnonKey: 'your-anon-key'                  // Optional - has defaults
  }
};
```

Note: No more `siteId` needed! The system uses domains automatically.

### Step 3: Set Up Database

Run this SQL command in your Supabase SQL editor (or use setup-database-v2.sql):

```sql
-- Single table for user access control
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

### Step 4: No Site Registration Needed!

With the new domain-based system, you don't need to register sites. The system automatically uses the current domain (e.g., docs.example.com) as the access key.

### Step 5: Create Users

Users can sign up through Supabase Auth, or you can create them:

```sql
-- In Supabase dashboard, go to Authentication > Users
-- Click "Invite user" and enter their email
```

### Step 6: Grant Access

```sql
-- Grant user access to your documentation domain
INSERT INTO docbuilder_access (user_id, domain)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'user@example.com'),
    'docs.example.com'
);

-- Grant multiple users access
INSERT INTO docbuilder_access (user_id, domain)
SELECT id, 'docs.example.com' 
FROM auth.users 
WHERE email IN ('user1@example.com', 'user2@example.com', 'user3@example.com');
```

## Deployment

### Build with Authentication

```bash
# Build with auth enabled (reads from config)
npx @knowcode/doc-builder build

# Build without auth (override config)
npx @knowcode/doc-builder build --no-auth
```

### Deploy to Vercel

```bash
# Deploy with auth
npx @knowcode/doc-builder deploy

# Deploy public site
npx @knowcode/doc-builder deploy --no-auth
```

## User Management

### CLI Commands (Future)

```bash
# Add user to site
npx @knowcode/doc-builder auth:grant --email user@example.com --site-id xxx

# Remove user access
npx @knowcode/doc-builder auth:revoke --email user@example.com --site-id xxx

# List users with access
npx @knowcode/doc-builder auth:list-users --site-id xxx
```

### Manual Management

Use Supabase dashboard or SQL commands to manage users and access.

## Security Features

### What Supabase Provides

- ✅ **JWT Authentication**: Industry-standard secure tokens
- ✅ **Password Hashing**: bcrypt with salt
- ✅ **Row Level Security**: Database-level access control
- ✅ **Session Management**: Automatic token refresh
- ✅ **Multi-Factor Auth**: Optional 2FA support
- ✅ **OAuth Providers**: Google, GitHub, etc. (optional)

### Security Best Practices

1. **Use environment variables** for custom config (optional):
   ```javascript
   auth: {
     supabaseUrl: process.env.SUPABASE_URL || defaultUrl,
     supabaseAnonKey: process.env.SUPABASE_ANON_KEY || defaultKey
   }
   ```

2. **Enable RLS policies** on all tables
3. **Regular access audits** - review who has access
4. **Use custom domains** for professional appearance
5. **Monitor usage** in Supabase dashboard

## Troubleshooting

### Common Issues

**Users can't log in**
- Verify Supabase project is active
- Check credentials are correct
- Ensure user exists in auth.users
- Verify site domain matches configuration

**Content flashes before redirect**
- This is fixed in latest versions
- Ensure you're using @knowcode/doc-builder v1.7.4+

**Access denied after login**
- Check user has entry in docbuilder_access table
- Verify site_id matches your configuration
- Check RLS policies are correctly set up

### Debug Checklist

1. Check browser console for errors
2. Verify JWT token in browser DevTools > Application > Storage
3. Test Supabase connection separately
4. Check network tab for API calls
5. Verify domain in database matches deployment

## Migration from Old Auth

If you were using the old authentication system:

1. **Remove old config**:
   ```javascript
   // Remove this:
   auth: {
     username: 'admin',
     password: 'password'
   }
   ```

2. **Set up Supabase** following this guide

3. **Update config** to use Supabase:
   ```javascript
   features: {
     authentication: 'supabase'
   }
   ```

## Conclusion

Supabase authentication provides enterprise-grade security for your documentation while maintaining ease of use. With proper setup, you get secure, scalable authentication that grows with your needs.

For public documentation that doesn't need authentication, simply set `authentication: false` or use the `--no-auth` flag during build/deploy.

## 📚 Next Steps

For comprehensive documentation including advanced features, troubleshooting, and detailed setup instructions, see:

**[Complete Supabase Authentication Guide](supabase-authentication-complete-guide.md)**

This detailed guide covers:
- 🏗️ All authentication modes (Global, Private Directory, Hybrid)
- 🔧 Advanced configuration options
- 👥 Bulk user management workflows
- 🛡️ Security best practices and hardening
- 🐛 Comprehensive troubleshooting guide
- 🚀 Performance optimization and monitoring
- 🔗 Multi-domain and role-based access control