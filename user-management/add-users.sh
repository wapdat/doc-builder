#!/bin/bash

# Doc-Builder User Management System
# Uses Supabase CLI for user creation and database operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CONFIG_FILE="$SCRIPT_DIR/.supabase-config"
PROJECT_ID="xcihhnfcitjrwbynxmka"  # Default project ID

# Load configuration if exists
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
fi

# Show comprehensive help
show_help() {
    cat << 'EOF'
═══════════════════════════════════════════════════════════════════════════════════
                       DOC-BUILDER USER MANAGEMENT SYSTEM
═══════════════════════════════════════════════════════════════════════════════════

Manage user access to Supabase-authenticated documentation sites using the
Supabase CLI. This tool creates users and manages their site access.

PREREQUISITES:
  ✓ Supabase CLI installed (npm install -g supabase)
  ✓ Logged in to Supabase (supabase login)
  ✓ Project linked (or use 'setup' command)

USAGE:
  ./add-users.sh <command> [options]

COMMANDS:

  setup                           Initial setup - link your Supabase project
    Example: ./add-users.sh setup
    
  add <site-url> <email>         Grant user access to a site
    Example: ./add-users.sh add docs.example.com user@email.com
    - Checks if user exists
    - If not, prompts you to create via Supabase dashboard
    - Grants access to the specified site
    
  bulk <site-url> <file>         Add multiple users from a file
    Example: ./add-users.sh bulk docs.example.com users.txt
    - File should contain one email per line
    - Lines starting with # are ignored
    - Empty lines are skipped
    
  list <site-url>                List all users with access to a site
    Example: ./add-users.sh list docs.example.com
    - Shows email, creation date, last login
    - Shows total user count
    
  check <email>                  Check user status across all sites
    Example: ./add-users.sh check user@email.com
    - Shows if user exists
    - Lists all sites they have access to
    - Shows last login time
    
  remove <site-url> <email>      Remove user's access to a site
    Example: ./add-users.sh remove docs.example.com user@email.com
    - Only removes access, doesn't delete user
    - User can still access other sites
    
  sites                          List all documentation sites
    Example: ./add-users.sh sites
    - Shows site URL, name, and user count
    
  delete-user <email>            Remove user access from ALL sites
    Example: ./add-users.sh delete-user user@email.com
    - Removes access to all sites
    - Does NOT delete the user account (use dashboard for that)

SITE URLS:
  - Use domain without https:// prefix
  - Examples: docs.example.com, my-app.vercel.app

ENVIRONMENT VARIABLES:
  SUPABASE_PROJECT_ID     Your Supabase project ID (optional)
  SUPABASE_DB_URL         Database connection URL (optional)

EXAMPLES:

  Initial Setup:
    ./add-users.sh setup

  Add a single user:
    ./add-users.sh add wru-bid-analysis.vercel.app lindsay@knowcode.tech

  Add multiple users:
    echo "user1@example.com" > users.txt
    echo "user2@example.com" >> users.txt
    ./add-users.sh bulk my-docs.vercel.app users.txt

  Check who has access:
    ./add-users.sh list my-docs.vercel.app

  Remove someone's access:
    ./add-users.sh remove my-docs.vercel.app user@example.com

TROUBLESHOOTING:

  "Supabase CLI not found"
    → Install it: npm install -g supabase
    
  "Not logged in to Supabase"
    → Run: supabase login
    
  "Project not linked"
    → Run: ./add-users.sh setup
    
  "User already exists"
    → This is fine, the script will continue
    
  "Access already granted"
    → User already has access to this site

MORE HELP:
  GitHub: https://github.com/wapdat/doc-builder
  Docs: https://doc-builder-delta.vercel.app

═══════════════════════════════════════════════════════════════════════════════════
EOF
}

# Check if Supabase CLI is installed
check_supabase_cli() {
    if ! command -v supabase &> /dev/null; then
        echo -e "${RED}❌ Supabase CLI is not installed${NC}"
        echo -e "${YELLOW}Install it with: ${CYAN}npm install -g supabase${NC}"
        echo -e "${YELLOW}Or visit: ${CYAN}https://supabase.com/docs/guides/cli${NC}"
        exit 1
    fi
}

# Check if logged in to Supabase
check_supabase_login() {
    if ! supabase projects list &> /dev/null; then
        echo -e "${RED}❌ Not logged in to Supabase${NC}"
        echo -e "${YELLOW}Please run: ${CYAN}supabase login${NC}"
        exit 1
    fi
}

# Setup command - link project
setup_project() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}Setting up Supabase User Management${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo
    
    check_supabase_cli
    check_supabase_login
    
    # Get project ID
    echo -e "${YELLOW}Enter your Supabase project ID (or press Enter for default):${NC}"
    echo -e "${CYAN}Default: $PROJECT_ID${NC}"
    read -p "> " input_project_id
    
    if [ ! -z "$input_project_id" ]; then
        PROJECT_ID="$input_project_id"
    fi
    
    # Link the project
    echo -e "\n${BLUE}Linking to project...${NC}"
    if supabase link --project-ref "$PROJECT_ID"; then
        echo -e "${GREEN}✅ Successfully linked to project${NC}"
        
        # Save configuration
        echo "PROJECT_ID=\"$PROJECT_ID\"" > "$CONFIG_FILE"
        echo -e "${GREEN}✅ Configuration saved${NC}"
        
        # Test database connection
        echo -e "\n${BLUE}Testing database connection...${NC}"
        if supabase db push --dry-run <<< "SELECT 1;" &> /dev/null; then
            echo -e "${GREEN}✅ Database connection successful${NC}"
        else
            echo -e "${YELLOW}⚠️  Could not verify database connection${NC}"
        fi
        
        echo -e "\n${GREEN}Setup complete! You can now manage users.${NC}"
    else
        echo -e "${RED}❌ Failed to link project${NC}"
        echo -e "${YELLOW}Make sure the project ID is correct${NC}"
        exit 1
    fi
}

# Execute SQL - try different methods based on what's available
execute_sql() {
    local sql="$1"
    local temp_file=$(mktemp)
    
    echo "$sql" > "$temp_file"
    
    # Method 1: Try using psql if DATABASE_URL is available
    if [ ! -z "$DATABASE_URL" ]; then
        local output=$(psql "$DATABASE_URL" -f "$temp_file" 2>&1)
        local status=$?
        rm "$temp_file"
        
        if [ $status -eq 0 ]; then
            echo "$output"
            return 0
        fi
    fi
    
    # Method 2: Try newer supabase db execute (for newer CLI versions)
    if command -v supabase &> /dev/null && supabase db execute --help &> /dev/null 2>&1; then
        local output=$(cat "$temp_file" | supabase db execute 2>&1)
        local status=$?
        rm "$temp_file"
        
        if [ $status -eq 0 ]; then
            echo "$output"
            return 0
        fi
    fi
    
    # Method 3: Manual instructions as fallback
    rm "$temp_file"
    echo -e "${YELLOW}⚠️  Cannot execute SQL automatically${NC}"
    echo -e "${CYAN}Your Supabase CLI version doesn't support direct SQL execution.${NC}"
    echo -e "${CYAN}Please run this SQL manually in Supabase SQL Editor:${NC}"
    echo -e "${CYAN}https://supabase.com/dashboard/project/$PROJECT_ID/sql${NC}"
    echo
    echo -e "${BLUE}--- SQL TO RUN ---${NC}"
    echo "$sql"
    echo -e "${BLUE}--- END SQL ---${NC}"
    echo
    echo -e "${YELLOW}Press Enter after running the SQL...${NC}"
    read -p ""
    
    return 0
}

# Create a user using SQL (Supabase doesn't have CLI user creation)
create_user() {
    local email="$1"
    
    echo -e "${BLUE}Checking/Creating user: $email${NC}"
    
    # Check if user exists first
    local check_sql="SELECT id, email FROM auth.users WHERE email = '$email';"
    
    local result=$(execute_sql "$check_sql")
    
    if echo "$result" | grep -q "$email"; then
        echo -e "${YELLOW}ℹ️  User already exists${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  User doesn't exist yet${NC}"
        echo -e "${CYAN}You have two options to create the user:${NC}"
        echo
        echo -e "${BOLD}Option 1: Use Supabase Dashboard (Recommended)${NC}"
        echo -e "${CYAN}1. Go to: https://supabase.com/dashboard/project/$PROJECT_ID/auth/users${NC}"
        echo -e "${CYAN}2. Click 'Invite user'${NC}"
        echo -e "${CYAN}3. Enter email: $email${NC}"
        echo
        echo -e "${BOLD}Option 2: Use Service Role Key (Advanced)${NC}"
        echo -e "${CYAN}If you have your service_role key, I can create the user programmatically.${NC}"
        echo -e "${CYAN}Find it at: https://supabase.com/dashboard/project/$PROJECT_ID/settings/api${NC}"
        echo
        echo -e "${YELLOW}Choose an option:${NC}"
        echo -e "  1) Open dashboard and create manually"
        echo -e "  2) Enter service role key"
        echo -e "  3) Skip (user already exists elsewhere)"
        read -p "Choice (1/2/3): " choice
        
        case $choice in
            1)
                echo -e "${CYAN}Opening dashboard...${NC}"
                if command -v open &> /dev/null; then
                    open "https://supabase.com/dashboard/project/$PROJECT_ID/auth/users"
                fi
                echo -e "${CYAN}Press Enter after creating the user...${NC}"
                read -p ""
                ;;
            2)
                echo -e "${YELLOW}Enter your service_role key:${NC}"
                read -s service_key
                echo
                if [ ! -z "$service_key" ]; then
                    echo -e "${BLUE}Creating user programmatically...${NC}"
                    # Get Supabase URL from config
                    local supabase_url="https://$PROJECT_ID.supabase.co"
                    if node "$SCRIPT_DIR/create-user.js" "$email" "$supabase_url" "$service_key" 2>&1; then
                        echo -e "${GREEN}✅ User created programmatically${NC}"
                        return 0
                    else
                        echo -e "${RED}❌ Failed to create user programmatically${NC}"
                        echo -e "${CYAN}Please try the dashboard method instead${NC}"
                        return 1
                    fi
                fi
                ;;
            3)
                echo -e "${YELLOW}Skipping user creation...${NC}"
                ;;
            *)
                echo -e "${RED}Invalid choice${NC}"
                return 1
                ;;
        esac
        
        # Check again if user was created
        result=$(execute_sql "$check_sql")
        if echo "$result" | grep -q "$email"; then
            echo -e "${GREEN}✅ User confirmed in database${NC}"
            return 0
        else
            echo -e "${RED}❌ User not found. Please create the user first.${NC}"
            return 1
        fi
    fi
}

# Grant access to a site
grant_access() {
    local site_url="$1"
    local email="$2"
    
    echo -e "${BLUE}Granting access to $site_url...${NC}"
    
    local sql="
-- Get site info
DO \$\$
DECLARE
    v_site_id UUID;
    v_user_id UUID;
    v_site_name TEXT;
BEGIN
    -- Get site ID
    SELECT id, name INTO v_site_id, v_site_name 
    FROM docbuilder_sites 
    WHERE domain = '$site_url';
    
    IF v_site_id IS NULL THEN
        RAISE EXCEPTION 'Site not found: $site_url';
    END IF;
    
    -- Get user ID
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = '$email';
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found: $email';
    END IF;
    
    -- Grant access
    INSERT INTO docbuilder_access (user_id, site_id)
    VALUES (v_user_id, v_site_id)
    ON CONFLICT (user_id, site_id) DO NOTHING;
    
    RAISE NOTICE 'Access granted to % for site: %', '$email', v_site_name;
END\$\$;

-- Show result
SELECT 
    u.email,
    s.name as site_name,
    s.domain as site_url,
    da.created_at as access_granted
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE u.email = '$email' AND s.domain = '$site_url';
"
    
    if execute_sql "$sql"; then
        echo -e "${GREEN}✅ Access granted successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to grant access${NC}"
        return 1
    fi
}

# Add command - create user and grant access
add_user() {
    local site_url="$1"
    local email="$2"
    
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}Adding User${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "Site: ${CYAN}$site_url${NC}"
    echo -e "Email: ${CYAN}$email${NC}"
    echo
    
    # Create user first
    if create_user "$email"; then
        # Then grant access
        grant_access "$site_url" "$email"
    fi
}

# Bulk add users
bulk_add() {
    local site_url="$1"
    local file_path="$2"
    
    if [ ! -f "$file_path" ]; then
        echo -e "${RED}❌ File not found: $file_path${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}Bulk Adding Users${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "Site: ${CYAN}$site_url${NC}"
    echo -e "File: ${CYAN}$file_path${NC}"
    echo
    
    local success_count=0
    local fail_count=0
    
    while IFS= read -r email; do
        # Skip empty lines and comments
        [[ -z "$email" || "$email" =~ ^#.*$ ]] && continue
        
        # Trim whitespace
        email=$(echo "$email" | xargs)
        
        echo -e "\n${MAGENTA}Processing: $email${NC}"
        echo -e "${CYAN}────────────────────────────────${NC}"
        
        if create_user "$email" && grant_access "$site_url" "$email"; then
            ((success_count++))
        else
            ((fail_count++))
        fi
    done < "$file_path"
    
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}Summary${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ Successful: $success_count${NC}"
    echo -e "${RED}❌ Failed: $fail_count${NC}"
}

# List users for a site
list_users() {
    local site_url="$1"
    
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}Users with access to: $site_url${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    
    local sql="
-- Site info
SELECT name, domain, created_at 
FROM docbuilder_sites 
WHERE domain = '$site_url';

-- Users with access
SELECT 
    u.email,
    u.created_at as user_created,
    da.created_at as access_granted,
    CASE 
        WHEN u.last_sign_in_at IS NULL THEN 'Never logged in'
        ELSE 'Last login: ' || to_char(u.last_sign_in_at, 'YYYY-MM-DD HH24:MI')
    END as login_status
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE s.domain = '$site_url'
ORDER BY da.created_at DESC;

-- Count
SELECT COUNT(*) as total_users
FROM docbuilder_access da
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE s.domain = '$site_url';
"
    
    execute_sql "$sql"
}

# Check user status
check_user() {
    local email="$1"
    
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}User Status: $email${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    
    local sql="
-- User info
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at,
    CASE 
        WHEN last_sign_in_at IS NULL THEN 'Never logged in'
        ELSE 'Last login: ' || to_char(last_sign_in_at, 'YYYY-MM-DD HH24:MI')
    END as login_status
FROM auth.users 
WHERE email = '$email';

-- Sites with access
SELECT 
    s.name as site_name,
    s.domain as site_url,
    da.created_at as access_granted
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE u.email = '$email'
ORDER BY da.created_at DESC;

-- Count
SELECT COUNT(*) as total_sites
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
WHERE u.email = '$email';
"
    
    execute_sql "$sql"
}

# Remove user access
remove_access() {
    local site_url="$1"
    local email="$2"
    
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}Removing Access${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "Site: ${CYAN}$site_url${NC}"
    echo -e "Email: ${CYAN}$email${NC}"
    echo
    
    # Confirm
    echo -e "${YELLOW}Are you sure you want to remove access? (y/N)${NC}"
    read -p "> " confirm
    
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Cancelled${NC}"
        return
    fi
    
    local sql="
-- Remove access
DELETE FROM docbuilder_access
WHERE user_id = (SELECT id FROM auth.users WHERE email = '$email')
AND site_id = (SELECT id FROM docbuilder_sites WHERE domain = '$site_url');

-- Verify removal
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'Access removed successfully'
        ELSE 'ERROR: User still has access'
    END as status
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE u.email = '$email' AND s.domain = '$site_url';

-- Show remaining sites for this user
SELECT 
    s.name as site_name,
    s.domain as site_url,
    da.created_at as access_granted
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
JOIN docbuilder_sites s ON s.id = da.site_id
WHERE u.email = '$email'
ORDER BY da.created_at DESC;
"
    
    if execute_sql "$sql"; then
        echo -e "${GREEN}✅ Access removed${NC}"
    else
        echo -e "${RED}❌ Failed to remove access${NC}"
    fi
}

# List all sites
list_sites() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}All Documentation Sites${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    
    local sql="
SELECT 
    id as site_id,
    domain,
    name,
    created_at,
    (SELECT COUNT(*) FROM docbuilder_access WHERE site_id = docbuilder_sites.id) as user_count
FROM docbuilder_sites
ORDER BY created_at DESC;
"
    
    execute_sql "$sql"
}

# Delete user completely
delete_user() {
    local email="$1"
    
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${RED}⚠️  REMOVE USER ACCESS - NOT DELETE ⚠️${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "Email: ${CYAN}$email${NC}"
    echo
    echo -e "${YELLOW}Note: Supabase CLI cannot delete users directly.${NC}"
    echo -e "${YELLOW}This will remove the user's access to ALL sites.${NC}"
    echo -e "${YELLOW}To fully delete, use Supabase dashboard.${NC}"
    echo
    echo -e "${YELLOW}Type 'REMOVE' to confirm:${NC}"
    read -p "> " confirm
    
    if [[ "$confirm" != "REMOVE" ]]; then
        echo -e "${YELLOW}Cancelled${NC}"
        return
    fi
    
    echo -e "${BLUE}Removing all access...${NC}"
    
    local sql="
-- Remove all access for user
DELETE FROM docbuilder_access
WHERE user_id = (SELECT id FROM auth.users WHERE email = '$email');

-- Show result
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'All access removed successfully'
        ELSE 'ERROR: User still has some access'
    END as status
FROM docbuilder_access da
JOIN auth.users u ON u.id = da.user_id
WHERE u.email = '$email';
"
    
    if execute_sql "$sql"; then
        echo -e "${GREEN}✅ All access removed${NC}"
        echo -e "${CYAN}To fully delete user, go to:${NC}"
        echo -e "${CYAN}https://supabase.com/dashboard/project/$PROJECT_ID/auth/users${NC}"
    else
        echo -e "${RED}❌ Failed to remove access${NC}"
    fi
}

# Main script logic
main() {
    case "$1" in
        setup)
            setup_project
            ;;
            
        add)
            if [ -z "$2" ] || [ -z "$3" ]; then
                echo -e "${RED}❌ Missing parameters${NC}"
                echo -e "${YELLOW}Usage: $0 add <site-url> <email>${NC}"
                echo -e "${CYAN}Example: $0 add docs.example.com user@email.com${NC}"
                exit 1
            fi
            check_supabase_cli
            check_supabase_login
            add_user "$2" "$3"
            ;;
            
        bulk)
            if [ -z "$2" ] || [ -z "$3" ]; then
                echo -e "${RED}❌ Missing parameters${NC}"
                echo -e "${YELLOW}Usage: $0 bulk <site-url> <file>${NC}"
                echo -e "${CYAN}Example: $0 bulk docs.example.com users.txt${NC}"
                exit 1
            fi
            check_supabase_cli
            check_supabase_login
            bulk_add "$2" "$3"
            ;;
            
        list)
            if [ -z "$2" ]; then
                echo -e "${RED}❌ Missing site URL${NC}"
                echo -e "${YELLOW}Usage: $0 list <site-url>${NC}"
                echo -e "${CYAN}Example: $0 list docs.example.com${NC}"
                exit 1
            fi
            check_supabase_cli
            check_supabase_login
            list_users "$2"
            ;;
            
        check)
            if [ -z "$2" ]; then
                echo -e "${RED}❌ Missing email${NC}"
                echo -e "${YELLOW}Usage: $0 check <email>${NC}"
                echo -e "${CYAN}Example: $0 check user@email.com${NC}"
                exit 1
            fi
            check_supabase_cli
            check_supabase_login
            check_user "$2"
            ;;
            
        remove)
            if [ -z "$2" ] || [ -z "$3" ]; then
                echo -e "${RED}❌ Missing parameters${NC}"
                echo -e "${YELLOW}Usage: $0 remove <site-url> <email>${NC}"
                echo -e "${CYAN}Example: $0 remove docs.example.com user@email.com${NC}"
                exit 1
            fi
            check_supabase_cli
            check_supabase_login
            remove_access "$2" "$3"
            ;;
            
        sites)
            check_supabase_cli
            check_supabase_login
            list_sites
            ;;
            
        delete-user)
            if [ -z "$2" ]; then
                echo -e "${RED}❌ Missing email${NC}"
                echo -e "${YELLOW}Usage: $0 delete-user <email>${NC}"
                echo -e "${CYAN}Example: $0 delete-user user@email.com${NC}"
                exit 1
            fi
            check_supabase_cli
            check_supabase_login
            delete_user "$2"
            ;;
            
        *)
            show_help
            ;;
    esac
}

# Run main function
main "$@"