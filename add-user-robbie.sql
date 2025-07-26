-- =====================================================
-- ADD SINGLE USER: robbie.macintosh@marbledropper.com
-- Site: https://wru-bid-analysis.vercel.app/
-- =====================================================

-- STEP 1: Check if robbie.macintosh@marbledropper.com exists
SELECT email, id, created_at, last_sign_in_at
FROM auth.users 
WHERE email = 'robbie.macintosh@marbledropper.com';

-- If NO RESULTS above, create the user:
-- 1. Go to: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/auth/users
-- 2. Click "Invite user"
-- 3. Enter: robbie.macintosh@marbledropper.com
-- 4. Click "Send invitation"

-- STEP 2: After user is created, grant access
INSERT INTO docbuilder_access (user_id, site_id)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'robbie.macintosh@marbledropper.com'),
    '4d8a53bf-dcdd-48c0-98e0-cd1451518735'
)
ON CONFLICT (user_id, site_id) DO NOTHING;

-- STEP 3: Verify access was granted
SELECT 
    u.email,
    u.id as user_id,
    da.created_at as access_granted,
    ds.domain as site_domain
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites ds ON ds.id = da.site_id
WHERE u.email = 'robbie.macintosh@marbledropper.com'
AND da.site_id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';