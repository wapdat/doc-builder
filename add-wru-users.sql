-- =====================================================
-- ADD USERS TO WRU BID ANALYSIS DOCUMENTATION
-- Site: https://wru-bid-analysis.vercel.app/
-- Date: 2025-07-25
-- =====================================================

-- STEP 1: Update the domain to match your Vercel deployment
UPDATE docbuilder_sites 
SET domain = 'wru-bid-analysis.vercel.app',
    name = 'WRU Bid Analysis Documentation'
WHERE id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';

-- Verify the domain update
SELECT id, domain, name FROM docbuilder_sites 
WHERE id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';

-- =====================================================
-- STEP 2: CHECK IF USERS EXIST
-- =====================================================
-- Run this first to see which users already exist
SELECT email, id, created_at 
FROM auth.users 
WHERE email IN (
    'pmorgan@wru.cymru',
    'clive@hyperforma.co.uk',
    'robbie.macintosh@marbledropper.com',
    'lindsay@knowcode.tech'
);

-- =====================================================
-- IMPORTANT: CREATE MISSING USERS FIRST!
-- =====================================================
-- For any users that don't exist above:
-- 1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka
-- 2. Navigate to Authentication → Users
-- 3. Click "Invite user" 
-- 4. Enter each missing email address
-- 5. They'll receive an email to set their password

-- =====================================================
-- STEP 3: GRANT ACCESS TO ALL USERS
-- =====================================================
-- Run this after all users have been created
WITH users_to_add AS (
    SELECT email FROM (VALUES 
        ('pmorgan@wru.cymru'),
        ('clive@hyperforma.co.uk'),
        ('robbie.macintosh@marbledropper.com'),
        ('lindsay@knowcode.tech')
    ) AS t(email)
)
INSERT INTO docbuilder_access (user_id, site_id)
SELECT u.id, '4d8a53bf-dcdd-48c0-98e0-cd1451518735'
FROM auth.users u
JOIN users_to_add ua ON u.email = ua.email
WHERE NOT EXISTS (
    -- This prevents duplicate entries if someone already has access
    SELECT 1 FROM docbuilder_access 
    WHERE user_id = u.id AND site_id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735'
);

-- =====================================================
-- STEP 4: VERIFY ACCESS WAS GRANTED
-- =====================================================
-- Check who now has access to the site
SELECT 
    u.email,
    u.created_at as user_created,
    da.created_at as access_granted,
    CASE 
        WHEN u.last_sign_in_at IS NULL THEN 'Never logged in'
        ELSE 'Has logged in'
    END as login_status
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
WHERE da.site_id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735'
ORDER BY da.created_at DESC;

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If someone can't log in, check if they exist:
SELECT * FROM auth.users WHERE email = 'user@example.com';

-- If someone still can't access after login, verify their access:
SELECT * FROM docbuilder_access 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
AND site_id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';

-- To remove a user's access:
-- DELETE FROM docbuilder_access
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
-- AND site_id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';

-- =====================================================
-- USERS BEING ADDED:
-- =====================================================
-- 1. pmorgan@wru.cymru
-- 2. clive@hyperforma.co.uk
-- 3. robbie.macintosh@marbledropper.com
-- 4. lindsay@knowcode.tech
--
-- Site URL: https://wru-bid-analysis.vercel.app/
-- Site ID: 4d8a53bf-dcdd-48c0-98e0-cd1451518735