# Vercel Deployment Authentication Setup Guide

## Your Deployed Site

Your test documentation site is now live at:
- **URL**: https://doc-builder-2znroyb5z-lindsay-1340s-projects.vercel.app

## Step 1: Update Supabase Database

You need to update the domain in your Supabase database to allow authentication from the Vercel domain.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka
2. Click on **Table Editor** in the left sidebar
3. Select the `docbuilder_sites` table
4. Find the row with ID `4d8a53bf-dcdd-48c0-98e0-cd1451518735`
5. Click the edit icon (pencil)
6. Change the `domain` field from `localhost:3000` to `doc-builder-2znroyb5z-lindsay-1340s-projects.vercel.app`
7. Click **Save**

### Option B: Using SQL Editor

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Run this SQL command:

```sql
-- Update domain for Vercel deployment
UPDATE docbuilder_sites 
SET domain = 'doc-builder-2znroyb5z-lindsay-1340s-projects.vercel.app'
WHERE id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';

-- Verify the update
SELECT id, domain, name 
FROM docbuilder_sites 
WHERE id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';
```

## Step 2: Test Authentication Flow

Once the database is updated, test the authentication:

1. **Visit your site**: https://doc-builder-2znroyb5z-lindsay-1340s-projects.vercel.app
2. You should be automatically redirected to the login page
3. Login with your test credentials:
   - Email: `testuser@example.com`
   - Password: `testpass123`
4. After successful login, you should see the test documentation content

## Step 3: Verify Authentication Features

### ✅ What Should Work:
- Automatic redirect to login for unauthenticated users
- No content flash before redirect (fixed with CSS)
- Successful login with valid credentials
- Access to documentation after authentication
- Logout functionality
- Session persistence across page refreshes

### 🔍 Things to Check:
1. **Network Tab**: Look for Supabase API calls to verify authentication
2. **Console**: Check for any JavaScript errors
3. **Browser Cache**: Clear cache if you see stale content
4. **Session Storage**: Verify Supabase JWT token is stored

## Troubleshooting

### If Login Fails:
- Verify the domain was updated correctly in Supabase
- Check browser console for errors
- Ensure cookies are enabled
- Try incognito/private browsing mode

### If Content Doesn't Show After Login:
- Clear browser cache completely
- Check console for JavaScript errors
- Verify the `authenticated` class is added to body element
- Ensure JavaScript is enabled

## Next Steps

After successful testing, you can:

1. **Create Production Deployment**:
   ```bash
   # Deploy to production URL
   vercel --prod
   ```

2. **Add Custom Domain**:
   - Configure custom domain in Vercel
   - Update Supabase database with new domain

3. **Add More Users**:
   ```bash
   # Use CLI command
   npx @knowcode/doc-builder auth:add-user production-email@example.com
   ```

4. **Deploy Multiple Sites**:
   - Each site gets unique site_id
   - Users can have access to multiple sites
   - Central authentication system

## Security Notes

- The Supabase URL and anon key are public (by design)
- Security is enforced through Row Level Security (RLS) policies
- JWT tokens expire and auto-refresh
- Password hashing is handled by Supabase (bcrypt)

## Important URLs

- **Live Site**: https://doc-builder-2znroyb5z-lindsay-1340s-projects.vercel.app
- **Supabase Dashboard**: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Status**: Ready for database update and testing  
**Next Action**: Update the domain in Supabase database