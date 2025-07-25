# Quick Test Commands for Vercel Deployment

## 1. Update Domain in Supabase

Run this SQL in your Supabase SQL Editor:
```sql
UPDATE docbuilder_sites 
SET domain = 'doc-builder-2znroyb5z-lindsay-1340s-projects.vercel.app'
WHERE id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';
```

## 2. Test the Site

Visit: https://doc-builder-2znroyb5z-lindsay-1340s-projects.vercel.app

Login with:
- Email: `testuser@example.com`
- Password: `testpass123`

## 3. Check Authentication

After login, you should see:
- "🔐 Test Documentation with Supabase Auth"
- "✅ Authentication is Working!"

## 4. Common Issues

If content doesn't show after login:
- Clear browser cache (Cmd+Shift+R on Mac)
- Try incognito mode
- Check browser console for errors

## 5. Production Deployment

Once test works:
```bash
vercel --prod
```

Then update domain in Supabase to production URL.