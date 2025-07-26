-- =====================================================
-- ADD SINGLE USER: lindsay@knowcode.tech
-- Site: https://wru-bid-analysis.vercel.app/
-- =====================================================

-- STEP 1: Update domain (only run once)
UPDATE docbuilder_sites 
SET domain = 'wru-bid-analysis.vercel.app',
    name = 'WRU Bid Analysis Documentation'
WHERE id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';

-- Verify domain is correct
SELECT id, domain, name FROM docbuilder_sites 
WHERE id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';

-- =====================================================
-- STEP 2: Check if lindsay@knowcode.tech exists
-- =====================================================
SELECT email, id, created_at, last_sign_in_at
FROM auth.users 
WHERE email = 'lindsay@knowcode.tech';

-- If NO RESULTS above, create the user:
-- 1. Go to: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/auth/users
-- 2. Click "Invite user"
-- 3. Enter: lindsay@knowcode.tech
-- 4. Click "Send invitation"

-- =====================================================
-- STEP 3: After user is created, grant access
-- =====================================================
-- Run this AFTER the user exists in Supabase
INSERT INTO docbuilder_access (user_id, site_id)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'lindsay@knowcode.tech'),
    '4d8a53bf-dcdd-48c0-98e0-cd1451518735'
)
ON CONFLICT (user_id, site_id) DO NOTHING;

-- =====================================================
-- STEP 4: Verify access was granted
-- =====================================================
SELECT 
    u.email,
    u.id as user_id,
    da.created_at as access_granted,
    ds.domain as site_domain
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites ds ON ds.id = da.site_id
WHERE u.email = 'lindsay@knowcode.tech'
AND da.site_id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';

-- Should show:
-- email: lindsay@knowcode.tech
-- access_granted: (timestamp)
-- site_domain: wru-bid-analysis.vercel.app

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================
-- If access wasn't granted, check for errors:
SELECT id, email FROM auth.users WHERE email = 'lindsay@knowcode.tech';

-- If user can't log in after getting access:
-- 1. Clear browser cache
-- 2. Check they're using correct URL: https://wru-bid-analysis.vercel.app/
-- 3. Verify they set their password from invite email