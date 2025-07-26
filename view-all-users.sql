-- =====================================================
-- VIEW ALL USERS WITH ACCESS
-- Site: https://wru-bid-analysis.vercel.app/
-- =====================================================

-- See everyone who has access to the WRU site
SELECT 
    u.email,
    u.created_at as user_created,
    da.created_at as access_granted,
    CASE 
        WHEN u.last_sign_in_at IS NULL THEN '❌ Never logged in'
        ELSE '✅ Has logged in'
    END as login_status,
    u.last_sign_in_at
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
WHERE da.site_id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735'
ORDER BY da.created_at DESC;

-- Count total users with access
SELECT COUNT(*) as total_users_with_access
FROM docbuilder_access 
WHERE site_id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';

-- Check which of the 4 users exist in Supabase
SELECT 
    email,
    CASE 
        WHEN id IS NOT NULL THEN '✅ User exists'
        ELSE '❌ Not created yet'
    END as status
FROM (
    VALUES 
        ('lindsay@knowcode.tech'),
        ('pmorgan@wru.cymru'),
        ('clive@hyperforma.co.uk'),
        ('robbie.macintosh@marbledropper.com')
) AS emails(email)
LEFT JOIN auth.users u ON u.email = emails.email;