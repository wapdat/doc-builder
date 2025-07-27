-- Create a view to easily see user access with email addresses
-- This makes it much easier to manage user access

-- Drop the view if it exists (to recreate with latest schema)
DROP VIEW IF EXISTS user_access_view;

-- Create the view joining docbuilder_access with auth.users
CREATE VIEW user_access_view AS
SELECT 
    u.email,
    da.domain,
    da.created_at as access_granted,
    u.created_at as user_created,
    u.last_sign_in_at,
    u.id as user_id
FROM 
    docbuilder_access da
    JOIN auth.users u ON da.user_id = u.id
ORDER BY 
    da.domain, 
    u.email;

-- Grant permissions to authenticated users to view their own records
GRANT SELECT ON user_access_view TO authenticated;

-- Example queries using the view:

-- 1. See all users for a specific domain
-- SELECT * FROM user_access_view WHERE domain = 'docs.example.com';

-- 2. See all domains a user has access to
-- SELECT * FROM user_access_view WHERE email = 'user@example.com';

-- 3. Count users per domain
-- SELECT domain, COUNT(*) as user_count 
-- FROM user_access_view 
-- GROUP BY domain 
-- ORDER BY user_count DESC;

-- 4. Find users who haven't logged in recently
-- SELECT email, domain, last_sign_in_at 
-- FROM user_access_view 
-- WHERE last_sign_in_at < NOW() - INTERVAL '30 days'
-- OR last_sign_in_at IS NULL;

-- 5. Export all access for documentation
-- SELECT email, domain, access_granted 
-- FROM user_access_view 
-- ORDER BY domain, email;