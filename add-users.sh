#!/bin/bash

# Simple User Management Script for doc-builder
# This script helps manage users for Supabase authenticated documentation sites

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default to environment variable or empty
SITE_URL="${DOC_SITE_URL:-}"

# Help function
show_help() {
    echo -e "${BLUE}Doc-Builder User Management${NC}"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  add <site-url> <email>      Add a single user to a site"
    echo "  bulk <site-url> <file>      Add multiple users from a file"
    echo "  list <site-url>             List all users with access to a site"
    echo "  check <site-url> <email>    Check if a user has access to a site"
    echo "  remove <site-url> <email>   Remove user access from a site"
    echo "  sites                       List all documentation sites"
    echo "  sql                         Generate SQL command templates"
    echo ""
    echo "Examples:"
    echo "  $0 add wru-bid-analysis.vercel.app john@example.com"
    echo "  $0 bulk my-docs.vercel.app users.txt"
    echo "  $0 list wru-bid-analysis.vercel.app"
    echo "  $0 check my-docs.vercel.app john@example.com"
    echo ""
    echo "Environment Variables:"
    echo "  DOC_SITE_URL     Default site URL (optional)"
    echo ""
    echo "Note: Site URLs should be without https:// prefix"
}

# Generate SQL for listing all sites
generate_sites_sql() {
    cat << EOF

-- =====================================================
-- LIST ALL DOCUMENTATION SITES
-- Generated: $(date)
-- =====================================================

SELECT 
    id as site_id,
    domain,
    name,
    created_at,
    (SELECT COUNT(*) FROM docbuilder_access WHERE site_id = docbuilder_sites.id) as user_count
FROM docbuilder_sites
ORDER BY created_at DESC;

EOF
}

# Generate SQL for adding a user
generate_add_sql() {
    local site_url=$1
    local email=$2
    cat << EOF

-- =====================================================
-- ADD USER: ${email}
-- Site: ${site_url}
-- Generated: $(date)
-- =====================================================

-- Step 1: Get site ID from URL
WITH site_info AS (
    SELECT id, name FROM docbuilder_sites WHERE domain = '${site_url}'
)
SELECT * FROM site_info;

-- Step 2: Check if user exists
SELECT id, email, created_at FROM auth.users WHERE email = '${email}';

-- Step 3: If user doesn't exist, create them in Supabase Dashboard:
-- https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/auth/users
-- Click "Invite user" and enter: ${email}

-- Step 4: Grant access (run after user is created)
INSERT INTO docbuilder_access (user_id, site_id)
SELECT 
    (SELECT id FROM auth.users WHERE email = '${email}'),
    (SELECT id FROM docbuilder_sites WHERE domain = '${site_url}')
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = '${email}')
AND EXISTS (SELECT 1 FROM docbuilder_sites WHERE domain = '${site_url}')
AND NOT EXISTS (
    SELECT 1 FROM docbuilder_access 
    WHERE user_id = (SELECT id FROM auth.users WHERE email = '${email}')
    AND site_id = (SELECT id FROM docbuilder_sites WHERE domain = '${site_url}')
);

-- Step 5: Verify access was granted
SELECT 
    u.email,
    s.name as site_name,
    s.domain as site_url,
    da.created_at as access_granted
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE u.email = '${email}' AND s.domain = '${site_url}';

EOF
}

# Generate SQL for listing users
generate_list_sql() {
    local site_url=$1
    cat << EOF

-- =====================================================
-- LIST ALL USERS WITH ACCESS
-- Site: ${site_url}
-- Generated: $(date)
-- =====================================================

SELECT 
    u.email,
    u.created_at as user_created,
    da.created_at as access_granted,
    CASE 
        WHEN u.last_sign_in_at IS NULL THEN 'Never logged in'
        ELSE 'Last login: ' || u.last_sign_in_at::text
    END as login_status
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE s.domain = '${site_url}'
ORDER BY da.created_at DESC;

-- Site info
SELECT name, domain, created_at 
FROM docbuilder_sites 
WHERE domain = '${site_url}';

EOF
}

# Generate SQL for checking a user
generate_check_sql() {
    local site_url=$1
    local email=$2
    cat << EOF

-- =====================================================
-- CHECK USER: ${email}
-- Site: ${site_url}
-- Generated: $(date)
-- =====================================================

-- Check if user exists
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at,
    CASE 
        WHEN last_sign_in_at IS NULL THEN 'Never logged in'
        ELSE 'Last login: ' || last_sign_in_at::text
    END as login_status
FROM auth.users 
WHERE email = '${email}';

-- Check if user has access to this site
SELECT 
    s.name as site_name,
    s.domain as site_url,
    'Has Access' as status,
    da.created_at as access_granted
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE u.email = '${email}' AND s.domain = '${site_url}';

-- List all sites this user has access to
SELECT 
    s.name as site_name,
    s.domain as site_url,
    da.created_at as access_granted
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE u.email = '${email}'
ORDER BY da.created_at DESC;

EOF
}

# Generate SQL for removing user access
generate_remove_sql() {
    local site_url=$1
    local email=$2
    cat << EOF

-- =====================================================
-- REMOVE USER ACCESS: ${email}
-- Site: ${site_url}
-- Generated: $(date)
-- =====================================================

-- Remove access (does not delete user account)
DELETE FROM docbuilder_access
WHERE user_id = (SELECT id FROM auth.users WHERE email = '${email}')
AND site_id = (SELECT id FROM docbuilder_sites WHERE domain = '${site_url}');

-- Verify removal
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'Access removed successfully'
        ELSE 'ERROR: User still has access'
    END as status
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE u.email = '${email}' AND s.domain = '${site_url}';

-- Show remaining sites for this user
SELECT 
    s.name as site_name,
    s.domain as site_url,
    da.created_at as access_granted
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE u.email = '${email}'
ORDER BY da.created_at DESC;

EOF
}

# Main script logic
case "$1" in
    add)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo -e "${RED}Error: Missing parameters${NC}"
            echo "Usage: $0 add <site-url> <email>"
            echo "Example: $0 add wru-bid-analysis.vercel.app john@example.com"
            exit 1
        fi
        site_url="$2"
        email="$3"
        echo -e "${BLUE}Adding user: $email to site: $site_url${NC}"
        generate_add_sql "$site_url" "$email"
        echo -e "${YELLOW}Copy and run the SQL above in Supabase SQL Editor${NC}"
        echo -e "${YELLOW}Dashboard: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/sql${NC}"
        ;;
        
    bulk)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo -e "${RED}Error: Missing parameters${NC}"
            echo "Usage: $0 bulk <site-url> <file>"
            echo "Example: $0 bulk wru-bid-analysis.vercel.app users.txt"
            exit 1
        fi
        site_url="$2"
        file_path="$3"
        if [ ! -f "$file_path" ]; then
            echo -e "${RED}Error: File not found: $file_path${NC}"
            exit 1
        fi
        echo -e "${BLUE}Generating SQL for users in $file_path for site: $site_url${NC}"
        while IFS= read -r email; do
            # Skip empty lines and comments
            [[ -z "$email" || "$email" =~ ^#.*$ ]] && continue
            # Trim whitespace
            email=$(echo "$email" | xargs)
            generate_add_sql "$site_url" "$email"
        done < "$file_path"
        echo -e "${YELLOW}Copy and run the SQL above in Supabase SQL Editor${NC}"
        echo -e "${YELLOW}Dashboard: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/sql${NC}"
        ;;
        
    list)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Missing site URL${NC}"
            echo "Usage: $0 list <site-url>"
            echo "Example: $0 list wru-bid-analysis.vercel.app"
            exit 1
        fi
        site_url="$2"
        echo -e "${BLUE}Listing all users with access to: $site_url${NC}"
        generate_list_sql "$site_url"
        echo -e "${YELLOW}Copy and run the SQL above in Supabase SQL Editor${NC}"
        echo -e "${YELLOW}Dashboard: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/sql${NC}"
        ;;
        
    check)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo -e "${RED}Error: Missing parameters${NC}"
            echo "Usage: $0 check <site-url> <email>"
            echo "Example: $0 check wru-bid-analysis.vercel.app john@example.com"
            exit 1
        fi
        site_url="$2"
        email="$3"
        echo -e "${BLUE}Checking user: $email for site: $site_url${NC}"
        generate_check_sql "$site_url" "$email"
        echo -e "${YELLOW}Copy and run the SQL above in Supabase SQL Editor${NC}"
        echo -e "${YELLOW}Dashboard: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/sql${NC}"
        ;;
        
    remove)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo -e "${RED}Error: Missing parameters${NC}"
            echo "Usage: $0 remove <site-url> <email>"
            echo "Example: $0 remove wru-bid-analysis.vercel.app john@example.com"
            exit 1
        fi
        site_url="$2"
        email="$3"
        echo -e "${BLUE}Removing access for user: $email from site: $site_url${NC}"
        generate_remove_sql "$site_url" "$email"
        echo -e "${YELLOW}Copy and run the SQL above in Supabase SQL Editor${NC}"
        echo -e "${YELLOW}Dashboard: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/sql${NC}"
        ;;
        
    sites)
        echo -e "${BLUE}Listing all documentation sites${NC}"
        generate_sites_sql
        echo -e "${YELLOW}Copy and run the SQL above in Supabase SQL Editor${NC}"
        echo -e "${YELLOW}Dashboard: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/sql${NC}"
        ;;
        
    sql)
        echo -e "${BLUE}Generating all SQL templates${NC}"
        echo "-- Example: List all sites"
        generate_sites_sql
        echo ""
        echo "-- Example: Add user"
        generate_add_sql "example-docs.vercel.app" "user@example.com"
        echo ""
        echo "-- Example: List users"
        generate_list_sql "example-docs.vercel.app"
        echo ""
        echo "-- Example: Check user"
        generate_check_sql "example-docs.vercel.app" "user@example.com"
        echo ""
        echo "-- Example: Remove user"
        generate_remove_sql "example-docs.vercel.app" "user@example.com"
        ;;
        
    *)
        show_help
        ;;
esac