-- Grant access to test user
-- Run this in your Supabase SQL Editor

INSERT INTO docbuilder_access (user_id, site_id)
VALUES ('46cad259-9692-4df7-b19d-839e164a0390', '4d8a53bf-dcdd-48c0-98e0-cd1451518735');

-- Verify the access was granted
SELECT 
    u.email,
    s.name as site_name,
    da.created_at as access_granted
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id  
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE da.user_id = '46cad259-9692-4df7-b19d-839e164a0390';