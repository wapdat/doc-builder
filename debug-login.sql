-- Debug Login Issues
-- Run these queries in Supabase SQL Editor to diagnose login problems

-- 1. Check if your user exists
SELECT id, email, created_at, last_sign_in_at 
FROM auth.users 
WHERE email = 'YOUR_EMAIL_HERE';  -- Replace with your email

-- 2. Check what domains you have access to
SELECT da.domain, da.created_at as access_granted
FROM docbuilder_access da
JOIN auth.users u ON da.user_id = u.id
WHERE u.email = 'YOUR_EMAIL_HERE';  -- Replace with your email

-- 3. Check all users and their domains (admin view)
SELECT u.email, da.domain, da.created_at
FROM docbuilder_access da
JOIN auth.users u ON da.user_id = u.id
ORDER BY u.email, da.domain;

-- 4. If you need to grant yourself access to a domain
-- First get your user ID from query #1, then:
INSERT INTO docbuilder_access (user_id, domain)
VALUES ('YOUR_USER_ID', 'YOUR_DOMAIN_HERE');
-- Example domains: 'localhost:3000', 'doc-builder-delta.vercel.app', etc.

-- 5. Common domains to check/add:
-- For local development: 'localhost:3000' or 'localhost:8080'
-- For Vercel preview: 'your-app-name.vercel.app'
-- For production: 'docs.yourcompany.com'