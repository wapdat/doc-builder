# User Management for Doc-Builder Sites

This directory contains a simple scripted solution for managing user access to Supabase-authenticated documentation sites.

## Quick Start

```bash
# List all documentation sites
./add-users.sh sites

# Add a single user to a site
./add-users.sh add wru-bid-analysis.vercel.app john@example.com

# Add multiple users from a file
./add-users.sh bulk wru-bid-analysis.vercel.app users.txt

# List all users with access to a site
./add-users.sh list wru-bid-analysis.vercel.app

# Check if a user has access
./add-users.sh check wru-bid-analysis.vercel.app john@example.com

# Remove user access
./add-users.sh remove wru-bid-analysis.vercel.app john@example.com
```

## How It Works

1. The script generates SQL commands based on your input
2. Copy the generated SQL and run it in the Supabase SQL Editor
3. For new users, you'll need to create them in Supabase Dashboard first

## Files

- `add-users.sh` - Main user management script
- `users.txt` - Example file for bulk user additions
- `USER-MANAGEMENT.md` - This documentation

## Important URLs

- Supabase SQL Editor: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/sql
- Supabase User Management: https://supabase.com/dashboard/project/xcihhnfcitjrwbynxmka/auth/users

## Workflow for Adding New Users

1. First check if the user exists:
   ```bash
   ./add-users.sh check site-url user@email.com
   ```

2. If the user doesn't exist:
   - Go to Supabase Dashboard > Authentication > Users
   - Click "Invite user"
   - Enter the email address
   - They'll receive an email to set their password

3. Grant access to the site:
   ```bash
   ./add-users.sh add site-url user@email.com
   ```
   Copy and run the generated SQL

4. Verify access was granted:
   ```bash
   ./add-users.sh list site-url
   ```

## Bulk User Addition

1. Edit `users.txt` with one email per line
2. Run: `./add-users.sh bulk site-url users.txt`
3. The script will generate SQL for all users
4. Create any missing users in Supabase first
5. Run the SQL to grant access

## Notes

- Site URLs should be without the `https://` prefix
- Users must exist in Supabase before you can grant them access
- The script only generates SQL - you need to run it manually
- This gives you a chance to review before making changes