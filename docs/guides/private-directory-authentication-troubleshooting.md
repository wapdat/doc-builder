# Private Directory Authentication Troubleshooting

When your private directory isn't being authentication protected after building, follow this diagnostic checklist to identify and resolve the issue.

## Quick Diagnostic Checklist

### 1. 🏗️ Build Process Detection

**Check if authentication was detected during build:**

```bash
npm run build
```

Look for this message in the build output:
```
🔐 Found private directory - automatically enabling Supabase authentication
   Note: Grant users access by adding domain to the docbuilder_access table
```

❌ **If you DON'T see this message:**
- Your `docs/private/` directory may not exist or be empty
- The directory might not be properly named (check spelling/case)
- The build process may not have sufficient permissions to read the directory

### 2. 📁 Directory Structure Check

**Verify your directory structure:**

```bash
ls -la docs/
```

Expected structure:
```
docs/
├── README.md          # ✅ Public
├── other-docs.md      # ✅ Public  
└── private/           # 🔐 Should require auth
    ├── secret-doc.md  # 🔐 Should require auth
    └── admin/         # 🔐 Should require auth
        └── config.md  # 🔐 Should require auth
```

❌ **Common issues:**
- `Private/` (capital P) instead of `private/` (lowercase)
- Empty `private/` directory
- `private` file instead of directory
- Symlinks that aren't properly resolved

### 3. 🔍 Generated HTML Verification

**Check if auth.js was included in your build:**

```bash
ls -la html/js/auth.js
```

❌ **If auth.js is missing:**
- Authentication wasn't enabled during build
- Check build logs for errors
- Verify `docs/private/` directory exists and contains files

**Check if private files are being built:**

```bash
ls -la html/private/
```

✅ **Expected:** Private HTML files should exist but be protected by authentication
❌ **Problem:** If private directory doesn't exist in output, files weren't processed

### 4. 🌐 Browser Testing

**Test in browser (open DevTools Console):**

1. **Visit a public page** - should load normally
2. **Visit a private page directly** (e.g., `yoursite.com/private/secret-doc.html`)
3. **Check console for errors:**

```javascript
// Should see these in console for private pages:
// "Checking authentication for private page..."
// "User not authenticated, redirecting to login"
```

❌ **Common issues:**
- No console messages = auth.js not loading
- JavaScript errors = Supabase connection issues
- Page loads without auth = private pages not properly protected

### 5. 🔑 Authentication Configuration

**Check Supabase connection:**

```bash
grep -r "supabase" html/js/auth.js
```

Should contain:
- Valid Supabase URL
- Valid anonymous key
- Domain checking logic

❌ **Red flags:**
- Missing Supabase credentials
- Localhost-only configuration in production
- Network errors to Supabase

## Common Problems & Solutions

### Problem 1: "Build shows no private directory detection"

**Cause:** Directory structure issue

**Solutions:**
```bash
# Check if directory exists and has content
ls -la docs/private/
find docs/private/ -name "*.md" -type f

# Create proper structure if missing
mkdir -p docs/private
echo "# Private Document" > docs/private/test.md

# Rebuild
npm run build
```

### Problem 2: "Private pages load without authentication"

**Cause:** Authentication JavaScript not loading or functioning

**Debug steps:**
1. **Check if auth.js exists:** `ls html/js/auth.js`
2. **Check browser DevTools Network tab** - is auth.js loading?
3. **Check browser Console** - any JavaScript errors?
4. **Verify URL pattern** - does your private URL include `/private/`?

**Solutions:**
```bash
# Force rebuild with verbose output
npm run build -- --verbose

# Check generated auth.js for errors
cat html/js/auth.js | head -20
```

### Problem 3: "Authentication works locally but not in production"

**Cause:** Domain-based access control issue

**Debug steps:**
1. **Check your domain in database:**
```sql
SELECT * FROM docbuilder_access WHERE domain = 'yourdomain.com';
```

2. **Verify user access:**
```sql
SELECT u.email, da.domain 
FROM auth.users u 
JOIN docbuilder_access da ON u.id = da.user_id 
WHERE da.domain = 'yourdomain.com';
```

**Solutions:**
```sql
-- Add your production domain
INSERT INTO docbuilder_access (user_id, domain) 
VALUES ('your-user-uuid', 'yourdomain.com');

-- Add common domain variations
INSERT INTO docbuilder_access (user_id, domain) VALUES 
  ('your-user-uuid', 'yourdomain.com'),
  ('your-user-uuid', 'www.yourdomain.com'),
  ('your-user-uuid', 'docs.yourdomain.com');
```

### Problem 4: "Users can't login"

**Cause:** User access not granted in database

**Debug steps:**
1. **Check user exists in Supabase Auth dashboard**
2. **Verify user has domain access in `docbuilder_access` table**
3. **Check domain matches exactly (case-sensitive)**

**Solutions:**
```sql
-- Find user ID from email
SELECT id, email FROM auth.users WHERE email = 'user@example.com';

-- Grant access using the user ID
INSERT INTO docbuilder_access (user_id, domain) 
VALUES ('uuid-from-above', 'yourdomain.com');
```

## Step-by-Step Diagnosis

### Step 1: Verify Build Configuration

```bash
# 1. Check your project structure
tree docs/ -I node_modules

# 2. Look for config overrides
cat doc-builder.config.js 2>/dev/null || echo "No config file"

# 3. Clean build
rm -rf html/
npm run build

# 4. Verify authentication files were created
ls -la html/js/auth.js html/login.html html/logout.html
```

### Step 2: Test Authentication Flow

```bash
# 1. Start local server
cd html/
python3 -m http.server 8000

# 2. Open browser to http://localhost:8000
# 3. Navigate to a private page URL
# 4. Check if redirected to login
```

### Step 3: Database Verification

```sql
-- Connect to your Supabase database and run:

-- 1. Check table exists
\dt docbuilder_access

-- 2. Check your domain entries
SELECT domain, COUNT(*) as user_count 
FROM docbuilder_access 
GROUP BY domain;

-- 3. Check specific user access
SELECT u.email, da.domain 
FROM auth.users u 
JOIN docbuilder_access da ON u.id = da.user_id
WHERE u.email = 'your-email@example.com';
```

## Emergency Fixes

### Quick Fix 1: Force Authentication On

Add to your `doc-builder.config.js`:

```javascript
module.exports = {
  features: {
    authentication: 'supabase'  // Forces entire site to require auth
  }
};
```

### Quick Fix 2: Manual Auth.js Check

Verify authentication script is working:

```javascript
// Add to browser console on private page:
if (typeof supabase !== 'undefined') {
  console.log('✅ Supabase loaded');
} else {
  console.log('❌ Supabase not loaded - check auth.js');
}
```

### Quick Fix 3: Bypass for Testing

**⚠️ TEMPORARY ONLY - DO NOT USE IN PRODUCTION**

```javascript
// Add to html/js/auth.js for testing (REMOVE AFTER TESTING):
// document.body.classList.add('authenticated');
// console.log('🚨 BYPASSING AUTH - REMOVE THIS');
```

## Prevention Checklist

✅ **Before deploying:**
- [ ] `docs/private/` directory exists and contains files
- [ ] Build logs show "Found private directory" message  
- [ ] `html/js/auth.js` file exists after build
- [ ] Users added to `docbuilder_access` table with correct domain
- [ ] Tested authentication flow on staging/local environment
- [ ] Verified private pages redirect to login when not authenticated
- [ ] Confirmed authenticated users can access private content

✅ **After deploying:**
- [ ] Test private page access in incognito browser
- [ ] Verify login/logout flow works
- [ ] Check browser DevTools for JavaScript errors
- [ ] Confirm domain matches database entries exactly

## Getting Help

If authentication still isn't working after following this guide:

1. **Gather debug info:**
   - Build output logs
   - Browser DevTools Console errors
   - Network tab showing failed requests
   - Your domain name and directory structure

2. **Check common scenarios:**
   - Does it work locally but not in production?
   - Does the login page appear but login fails?
   - Are private pages completely public?
   - Do you see JavaScript errors?

3. **Verify requirements:**
   - Supabase project is accessible
   - Database table `docbuilder_access` exists
   - User accounts exist in Supabase Auth
   - Domain entries match your deployment URL exactly

The authentication system is designed to "fail secure" - if there are any doubts about configuration, it should redirect to login rather than expose private content.