# Doc-Builder User Management System

A comprehensive user management solution for Supabase-authenticated documentation sites using the Supabase CLI.

## 🚀 Quick Start

```bash
# Initial setup
./add-users.sh setup

# Add a user
./add-users.sh add wru-bid-analysis.vercel.app user@email.com

# List all users for a site
./add-users.sh list wru-bid-analysis.vercel.app
```

## 📋 Prerequisites

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project** (or use the setup command):
   ```bash
   ./add-users.sh setup
   ```

## 🔧 Installation

The user management system is self-contained in this folder:

```
user-management/
├── add-users.sh     # Main script
├── users.txt        # Example bulk user file
├── README.md        # This documentation
└── .env.example     # Environment variables template
```

## 📖 Commands

### Setup

Initialize and link your Supabase project:

```bash
./add-users.sh setup
```

This will:
- Check if Supabase CLI is installed
- Verify you're logged in
- Link your project (prompts for project ID)
- Test the database connection
- Save configuration for future use

### Add User

Create a user and grant them access to a specific site:

```bash
./add-users.sh add <site-url> <email>

# Example
./add-users.sh add docs.example.com john@company.com
```

This will:
- Create the user account if it doesn't exist
- Send them a password reset email
- Grant access to the specified site
- Show confirmation of access granted

### Bulk Add Users

Add multiple users from a file:

```bash
./add-users.sh bulk <site-url> <file>

# Example
./add-users.sh bulk docs.example.com users.txt
```

File format (users.txt):
```
# Comments start with #
# One email per line
john@example.com
jane@example.com
admin@company.com
```

### List Users

Show all users with access to a site:

```bash
./add-users.sh list <site-url>

# Example
./add-users.sh list wru-bid-analysis.vercel.app
```

Output includes:
- Email address
- When user was created
- When access was granted
- Last login time
- Total user count

### Check User

Check a user's status across all sites:

```bash
./add-users.sh check <email>

# Example
./add-users.sh check user@example.com
```

Shows:
- If user exists
- All sites they have access to
- Last login information

### Remove Access

Remove a user's access to a specific site:

```bash
./add-users.sh remove <site-url> <email>

# Example
./add-users.sh remove docs.example.com user@example.com
```

Note: This only removes access, it doesn't delete the user account.

### List Sites

Show all documentation sites in the system:

```bash
./add-users.sh sites
```

Shows:
- Site ID
- Domain
- Site name
- Creation date
- Number of users

### Delete User

Permanently delete a user (removes from ALL sites):

```bash
./add-users.sh delete-user <email>

# Example
./add-users.sh delete-user user@example.com
```

⚠️ **Warning**: This is permanent and cannot be undone!

## ⚠️ Important Limitations

1. **User Creation**: The Supabase CLI doesn't support direct user creation. The script offers two workarounds:
   - **Manual Creation** (Recommended): Opens the Supabase dashboard where you can invite users
   - **Programmatic Creation** (Advanced): If you provide your service_role key, the script can create users using the Admin API

2. **SQL Execution**: Older versions of Supabase CLI (< 2.7) don't support `db execute`. The script will:
   - Try to use `psql` if you have `DATABASE_URL` set
   - Fall back to showing SQL for manual execution in the dashboard
   - Consider updating: `npm update -g supabase`

## 🔐 Security Notes

1. **User Creation**: When users are created, they receive a password reset email to set their own password
2. **Access Control**: Users only see sites they have explicit access to
3. **Audit Trail**: All access grants are timestamped in the database
4. **No Passwords**: The system never handles or stores passwords directly
5. **Service Role Key**: If using programmatic creation, your service_role key is never stored

## 🛠️ Troubleshooting

### "Supabase CLI not found"

Install the Supabase CLI:
```bash
npm install -g supabase
```

### "Not logged in to Supabase"

Login to your Supabase account:
```bash
supabase login
```

### "Project not linked"

Run the setup command:
```bash
./add-users.sh setup
```

### "Site not found"

With the new domain-based system, sites no longer need to be registered. Just use the domain directly when granting access.

### "User already exists"

This is fine - the script will continue and grant access to the site.

### "Access already granted"

The user already has access to this site. No action needed.

## 📊 Database Schema

The system uses a single table with domain-based access:

### docbuilder_access
- `user_id` (UUID) - References auth.users
- `domain` (TEXT) - Site domain (e.g., docs.example.com)
- `created_at` (TIMESTAMP)
- Primary key on (user_id, domain)

## 🎯 Common Workflows

### Setting up a new documentation site

No site registration needed! Just add users with domain access:
```bash
./add-users.sh add my-docs.vercel.app user1@example.com
./add-users.sh add my-docs.vercel.app user2@example.com
```

### Onboarding multiple team members

1. Create a users.txt file with all email addresses
2. Run bulk add:
   ```bash
   ./add-users.sh bulk my-docs.vercel.app users.txt
   ```

### Auditing access

Check who has access to a site:
```bash
./add-users.sh list my-docs.vercel.app
```

Check what sites a user can access:
```bash
./add-users.sh check user@example.com
```

### Offboarding a user

Remove from specific site:
```bash
./add-users.sh remove my-docs.vercel.app former-employee@example.com
```

Or remove completely:
```bash
./add-users.sh delete-user former-employee@example.com
```

## 🔧 Configuration

The script stores its configuration in `.supabase-config` after setup. You can also set environment variables:

- `SUPABASE_PROJECT_ID` - Your project ID
- `SUPABASE_DB_URL` - Database connection URL (optional)

## 📝 Notes

- Site URLs should be entered without `https://` prefix
- Users receive password reset emails when created
- The script uses the Supabase CLI for all operations
- All actions are logged with colored output for clarity
- Destructive operations require confirmation

## 🆘 Support

- GitHub: https://github.com/wapdat/doc-builder
- Documentation: https://doc-builder-delta.vercel.app
- Supabase Dashboard: https://supabase.com/dashboard