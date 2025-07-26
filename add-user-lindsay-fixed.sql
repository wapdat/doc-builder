-- =====================================================
-- ADD SINGLE USER: lindsay@knowcode.tech
-- Site: https://wru-bid-analysis.vercel.app/
-- =====================================================

-- STEP 1: Update domain (only run once - you've already done this)
-- UPDATE docbuilder_sites 
-- SET domain = 'wru-bid-analysis.vercel.app',
--     name = 'WRU Bid Analysis Documentation'
-- WHERE id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';

-- =====================================================
-- STEP 2: CHECK IF USER EXISTS (RUN THIS FIRST!)
-- =====================================================
SELECT email, id, created_at 
FROM auth.users 
WHERE email = 'lindsay@knowcode.tech';

-- ⚠️ IF THE ABOVE QUERY RETURNS NO ROWS, YOU MUST CREATE THE USER FIRST!

-- =====================================================
-- STEP 3: CREATE USER IN SUPABASE (if not exists)
-- =====================================================
-- Go to: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/auth/users
-- 1. Click the "Invite user" button
-- 2. Enter email: lindsay@knowcode.tech
-- 3. Click "Send invitation"
-- 4. User will receive email to set password
-- 5. WAIT for user to appear in the auth.users table before continuing!

-- =====================================================
-- STEP 4: VERIFY USER NOW EXISTS
-- =====================================================
-- Run this again to get the user ID:
SELECT email, id 
FROM auth.users 
WHERE email = 'lindsay@knowcode.tech';

-- Copy the ID from above (it will look like: 123e4567-e89b-12d3-a456-426614174000)

-- =====================================================
-- STEP 5: GRANT ACCESS (only after user exists!)
-- =====================================================
-- Option A: If Step 4 returned a user, run this:
INSERT INTO docbuilder_access (user_id, site_id)
SELECT 
    u.id,
    '4d8a53bf-dcdd-48c0-98e0-cd1451518735'
FROM auth.users u
WHERE u.email = 'lindsay@knowcode.tech'
AND EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'lindsay@knowcode.tech'
);

-- Option B: If you have the user ID from Step 4, use it directly:
-- INSERT INTO docbuilder_access (user_id, site_id)
-- VALUES (
--     'paste-user-id-here',
--     '4d8a53bf-dcdd-48c0-98e0-cd1451518735'
-- );

-- =====================================================
-- STEP 6: VERIFY ACCESS WAS GRANTED
-- =====================================================
SELECT 
    u.email,
    u.id as user_id,
    da.created_at as access_granted
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
WHERE u.email = 'lindsay@knowcode.tech';

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================
-- If you still get errors, check:
-- 1. Does the user exist? 
SELECT COUNT(*) as user_exists FROM auth.users WHERE email = 'lindsay@knowcode.tech';

-- 2. Do they already have access?
SELECT COUNT(*) as has_access 
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
WHERE u.email = 'lindsay@knowcode.tech' 
AND da.site_id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';