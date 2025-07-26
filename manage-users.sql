-- =====================================================
-- USER MANAGEMENT SQL COMMANDS FOR DOC-BUILDER
-- =====================================================
-- Run these in your Supabase SQL Editor

-- =====================================================
-- 1. VIEW YOUR SITES
-- =====================================================
-- See all your documentation sites
SELECT id, domain, name, created_at 
FROM docbuilder_sites
ORDER BY created_at DESC;

-- =====================================================
-- 2. VIEW EXISTING USERS
-- =====================================================
-- See all users in your Supabase project
SELECT id, email, created_at, last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- =====================================================
-- 3. VIEW WHO HAS ACCESS TO A SPECIFIC SITE
-- =====================================================
-- Replace 'your-site-id' with actual site ID
SELECT 
    u.email,
    u.id as user_id,
    u.created_at as user_since,
    da.created_at as access_granted,
    ds.name as site_name,
    ds.domain
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites ds ON ds.id = da.site_id
WHERE da.site_id = 'your-site-id'
ORDER BY da.created_at DESC;

-- =====================================================
-- 4. ADD A SINGLE USER TO A SITE
-- =====================================================
-- First, create user in Supabase Dashboard (Authentication > Users > Invite)
-- Then grant access:
INSERT INTO docbuilder_access (user_id, site_id)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'user@example.com'),
    'your-site-id'
);

-- =====================================================
-- 5. ADD MULTIPLE USERS TO A SITE
-- =====================================================
-- Add a list of users all at once
WITH users_to_add AS (
    SELECT email FROM (VALUES 
        ('user1@example.com'),
        ('user2@example.com'),
        ('user3@example.com'),
        ('user4@example.com')
    ) AS t(email)
)
INSERT INTO docbuilder_access (user_id, site_id)
SELECT u.id, 'your-site-id'
FROM auth.users u
JOIN users_to_add ua ON u.email = ua.email
WHERE NOT EXISTS (
    -- Prevent duplicate entries
    SELECT 1 FROM docbuilder_access 
    WHERE user_id = u.id AND site_id = 'your-site-id'
);

-- =====================================================
-- 6. GRANT USER ACCESS TO MULTIPLE SITES
-- =====================================================
-- Give one user access to several sites
WITH sites_to_grant AS (
    SELECT id FROM docbuilder_sites 
    WHERE domain IN ('site1.com', 'site2.com', 'site3.com')
)
INSERT INTO docbuilder_access (user_id, site_id)
SELECT 
    (SELECT id FROM auth.users WHERE email = 'user@example.com'),
    s.id
FROM sites_to_grant s
WHERE NOT EXISTS (
    SELECT 1 FROM docbuilder_access 
    WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
    AND site_id = s.id
);

-- =====================================================
-- 7. REMOVE USER ACCESS FROM A SITE
-- =====================================================
-- Remove specific user from specific site
DELETE FROM docbuilder_access
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
AND site_id = 'your-site-id';

-- =====================================================
-- 8. REMOVE USER FROM ALL SITES
-- =====================================================
-- Completely remove user's access to all documentation
DELETE FROM docbuilder_access
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- =====================================================
-- 9. BULK REMOVE USERS
-- =====================================================
-- Remove multiple users from a site
WITH users_to_remove AS (
    SELECT email FROM (VALUES 
        ('olduser1@example.com'),
        ('olduser2@example.com')
    ) AS t(email)
)
DELETE FROM docbuilder_access
WHERE site_id = 'your-site-id'
AND user_id IN (
    SELECT u.id FROM auth.users u
    JOIN users_to_remove ur ON u.email = ur.email
);

-- =====================================================
-- 10. VIEW ACCESS SUMMARY
-- =====================================================
-- See how many users each site has
SELECT 
    ds.name as site_name,
    ds.domain,
    ds.id as site_id,
    COUNT(da.user_id) as user_count,
    MAX(da.created_at) as last_access_granted
FROM docbuilder_sites ds
LEFT JOIN docbuilder_access da ON ds.id = da.site_id
GROUP BY ds.id, ds.name, ds.domain
ORDER BY user_count DESC;

-- =====================================================
-- 11. FIND USERS WITHOUT ACCESS TO ANY SITE
-- =====================================================
-- Useful for cleanup
SELECT u.email, u.created_at, u.last_sign_in_at
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM docbuilder_access da 
    WHERE da.user_id = u.id
)
ORDER BY u.created_at DESC;

-- =====================================================
-- 12. AUDIT LOG - RECENT ACCESS GRANTS
-- =====================================================
-- See who was granted access recently
SELECT 
    u.email,
    ds.name as site_name,
    ds.domain,
    da.created_at as access_granted
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites ds ON ds.id = da.site_id
WHERE da.created_at > NOW() - INTERVAL '30 days'
ORDER BY da.created_at DESC;

-- =====================================================
-- 13. COPY ACCESS FROM ONE USER TO ANOTHER
-- =====================================================
-- Useful when replacing team members
INSERT INTO docbuilder_access (user_id, site_id)
SELECT 
    (SELECT id FROM auth.users WHERE email = 'newuser@example.com'),
    da.site_id
FROM docbuilder_access da
WHERE da.user_id = (SELECT id FROM auth.users WHERE email = 'olduser@example.com');

-- =====================================================
-- COMMON SITE IDs FOR REFERENCE
-- =====================================================
-- Your test site: 4d8a53bf-dcdd-48c0-98e0-cd1451518735
-- Add more site IDs here as you create them:
-- Production site: xxx
-- Staging site: xxx

-- =====================================================
-- TIPS
-- =====================================================
-- 1. Always check if users exist before granting access
-- 2. Use the Supabase Dashboard to invite new users first
-- 3. Run SELECT queries before DELETE to verify
-- 4. Keep this file updated with your site IDs
-- 5. Consider creating views for common queries