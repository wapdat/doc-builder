# Next Steps: Testing and Deployment Walkthrough

## Overview

Now that we've implemented Supabase authentication, let's walk through testing the implementation and preparing for deployment. This guide provides detailed, step-by-step instructions.

## 🧪 Phase 1: Local Testing

### Step 1: Install Dependencies

First, install the new Supabase dependency:

```bash
cd /Users/lindsaysmith/Documents/lambda1.nosync/doc-builder
npm install
```

### Step 2: Set Up Test Supabase Project

1. **Go to Supabase**: Visit [app.supabase.com](https://app.supabase.com)
2. **Create new project**: 
   - Name: `doc-builder-test`
   - Database password: Choose a secure password
   - Region: Choose closest to you
3. **Wait for setup**: Usually takes 1-2 minutes

### Step 3: Create Database Tables

1. **Go to SQL Editor** in Supabase dashboard
2. **Run this SQL** to create the required tables:

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

### Step 4: Get Supabase Credentials

1. **Go to Settings → API** in Supabase dashboard
2. **Copy these values**:
   - Project URL (e.g., `https://abc123.supabase.co`)
   - Anon public key (starts with `eyJ...`)

### Step 5: Create Test Configuration

1. **Create test config file**:

```bash
# In the doc-builder directory
cat > test-config.js << 'EOF'
module.exports = {
  siteName: 'Test Documentation',
  
  features: {
    authentication: 'supabase'
  },
  
  auth: {
    supabaseUrl: 'YOUR_SUPABASE_URL_HERE',  // Optional - has defaults
    supabaseAnonKey: 'YOUR_ANON_KEY_HERE'    // Optional - has defaults
  }
};
EOF
```

2. **Replace the placeholders** with your actual Supabase credentials

### Step 6: Test the CLI Commands

1. **Test the auth:init command**:

```bash
node cli.js auth:init --config test-config.js
```

This should prompt you for Supabase credentials and create/update the config.

2. **No site registration needed!** The new system uses domains automatically.

### Step 7: Create Test Documentation

1. **Create test docs folder**:

```bash
mkdir -p test-docs
echo "# Test Documentation

This is a test page for Supabase authentication.

## Features

- Secure login with Supabase
- User access control
- Session management

If you can see this page, authentication is working!" > test-docs/README.md
```

### Step 8: Test Build Process

1. **Build with authentication**:

```bash
node cli.js build --config test-config.js --input test-docs --output test-html
```

2. **Check for expected files**:

```bash
ls -la test-html/
# Should see:
# - login.html
# - logout.html  
# - js/auth.js
# - index.html
```

3. **Inspect generated auth script**:

```bash
head -20 test-html/js/auth.js
# Should show Supabase integration code, not basic auth
```

### Step 9: Test Local Server

1. **Start development server**:

```bash
node cli.js dev --config test-config.js --input test-docs --port 3001
```

2. **Open browser** to `http://localhost:3001`
3. **Expected behavior**:
   - Should redirect to `/login.html` 
   - Login page should show email/password fields
   - Should show Supabase errors (no user exists yet)

### Step 10: Create Test User

1. **In Supabase dashboard**, go to **Authentication → Users**
2. **Click "Add User"**:
   - Email: `test@example.com`
   - Password: `testpassword123`
   - Email confirm: `true`
3. **Get the user ID** from the users table

### Step 11: Grant Access to Test User

```sql
-- Run in Supabase SQL Editor
-- Replace with actual user ID from step 10
INSERT INTO docbuilder_access (user_id, domain)
VALUES ('USER_ID_FROM_STEP_10', 'localhost:3001');
```

### Step 12: Test Complete Flow

1. **Go to** `http://localhost:3001`
2. **Should redirect to login**
3. **Login with**:
   - Email: `test@example.com`
   - Password: `testpassword123`
4. **Should redirect to documentation**
5. **Should see the test content**
6. **Logout should work**

## 🚀 Phase 2: Deployment Testing

### Step 13: Test Vercel Deployment

1. **Update config for deployment**:

```javascript
// test-config.js
module.exports = {
  siteName: 'Test Documentation',
  
  features: {
    authentication: 'supabase'
  },
  
  auth: {
    supabaseUrl: process.env.SUPABASE_URL || 'your-fallback-url',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'your-fallback-key',
    siteId: process.env.DOC_SITE_ID || 'your-site-id'
  }
};
```

2. **Create environment file** for local testing:

```bash
cat > .env << 'EOF'
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
DOC_SITE_ID=your-site-id
EOF
```

3. **Test with environment variables**:

```bash
source .env
node cli.js build --config test-config.js --input test-docs --output test-html
```

4. **Deploy to Vercel**:

```bash
node cli.js deploy --config test-config.js --input test-docs
```

5. **Configure environment variables in Vercel**:
   - Go to Vercel dashboard
   - Find your project
   - Go to Settings → Environment Variables
   - Add: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DOC_SITE_ID`

### Step 14: Update Site Domain in Database

```sql
-- Update the domain to match your Vercel URL
UPDATE docbuilder_sites 
SET domain = 'your-vercel-url.vercel.app'
WHERE id = 'your-site-id';
```

## 🔧 Phase 3: Version Management

### Step 15: Update Version Number

1. **Update package.json**:

```bash
# Current version is 1.7.4, bump to 2.0.0 for breaking changes
npm version major
```

2. **Update CHANGELOG.md**:

```bash
cat >> CHANGELOG.md << 'EOF'

## [2.0.0] - 2025-07-25

### BREAKING CHANGES
- **Removed insecure basic authentication** - All client-side credential checking has been removed for security
- **Removed --no-auth CLI flag** - Use `authentication: false` in config instead
- **Updated configuration format** - `auth` object now requires Supabase credentials

### Added
- **Supabase authentication integration** - Enterprise-grade secure authentication
- **Multi-site SSO support** - One account can access multiple documentation sites  
- **CLI authentication commands** - `auth:init`, `auth:add-site`, `auth:grant`, `auth:revoke`, `auth:list-users`
- **Comprehensive setup guide** - Step-by-step Supabase authentication setup
- **Environment variable support** - Better security for production deployments

### Security
- **Fixed critical vulnerability** - Client-side credentials are no longer exposed in JavaScript
- **Added Row Level Security** - Database-level access control
- **JWT token authentication** - Industry-standard secure sessions
- **Password hashing with bcrypt** - Secure password storage
- **Built-in password reset** - Users can reset their own passwords

### Migration
- See `docs/guides/supabase-auth-setup-guide.md` for migration instructions
- Old basic auth configurations will need to be updated
- Existing users will need to be migrated to Supabase

EOF
```

### Step 16: Test Package Publishing

1. **Test pack command**:

```bash
npm pack
# This creates a .tgz file without publishing
```

2. **Test installation from local package**:

```bash
# In a different directory
mkdir test-install
cd test-install
npm install ../doc-builder/*.tgz

# Test the CLI
npx doc-builder --version
npx doc-builder --help
```

## 📋 Phase 4: Quality Assurance

### Step 17: Test All CLI Commands

```bash
# Test help
node cli.js --help

# Test settings
node cli.js settings --config test-config.js

# Test each auth command
node cli.js auth:init --help
node cli.js auth:add-site --help
node cli.js auth:grant --help
node cli.js auth:revoke --help
node cli.js auth:list-users --help

# Test build with different options
node cli.js build --config test-config.js
node cli.js build --preset notion-inspired
```

### Step 18: Validate Generated Files

1. **Check authentication files**:

```bash
# Should exist and contain Supabase code
cat test-html/js/auth.js | grep -i supabase
cat test-html/login.html | grep -i supabase
cat test-html/logout.html | head -10
```

2. **Check for security issues**:

```bash
# Should NOT contain any hardcoded credentials
grep -r "password.*:" test-html/ || echo "Good - no hardcoded passwords"
grep -r "username.*:" test-html/ || echo "Good - no hardcoded usernames"
```

### Step 19: Cross-Platform Testing

If possible, test on different systems:
- **macOS**: Current system ✅
- **Windows**: Test in WSL or Windows machine
- **Linux**: Test in Docker or Linux VM

### Step 20: Documentation Review

1. **Check all documentation links**:

```bash
# Test that all internal links work
find docs/ -name "*.md" -exec grep -l "]\(" {} \;
```

2. **Validate setup guide**:
   - Follow the setup guide from scratch
   - Ensure all steps work as documented
   - Check for missing steps or unclear instructions

## 🎯 Success Criteria Checklist

Before considering deployment ready:

### Functionality
- [ ] CLI auth commands work correctly
- [ ] Build process generates Supabase auth files
- [ ] Login/logout flow works end-to-end
- [ ] User access control functions properly
- [ ] Environment variables work in production
- [ ] Vercel deployment succeeds with auth

### Security
- [ ] No hardcoded credentials in generated files
- [ ] Row Level Security policies work
- [ ] JWT tokens are properly validated
- [ ] Session management is secure
- [ ] Password reset functionality works

### Documentation  
- [ ] Setup guide is complete and accurate
- [ ] Migration instructions are clear
- [ ] CLI help text is updated
- [ ] README reflects new authentication
- [ ] Security warnings are prominent

### Compatibility
- [ ] Node.js 14+ compatibility maintained
- [ ] Vercel deployment works
- [ ] Environment variable support
- [ ] Cross-platform functionality

## 🚨 Issues to Watch For

### Common Problems
1. **Supabase URL format errors** - Must be `https://xxx.supabase.co`
2. **RLS policy conflicts** - May interfere with existing policies
3. **JavaScript errors in browser** - Check console for auth failures
4. **Build failures** - Missing Supabase credentials cause build errors
5. **Environment variable issues** - Vercel env vars not loading properly

### Debugging Tips
1. **Check browser console** for JavaScript errors
2. **Verify Supabase credentials** in dashboard
3. **Test database queries** directly in Supabase SQL editor
4. **Check generated files** contain expected Supabase code
5. **Validate environment variables** are loaded correctly

## Ready to Proceed?

Once you've completed Phase 1 (Local Testing), let me know the results and we can move to Phase 2 (Deployment Testing). I'm here to help troubleshoot any issues that come up during testing!