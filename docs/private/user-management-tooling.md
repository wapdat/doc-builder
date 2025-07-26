# User Management Tooling

This document provides comprehensive documentation for the Supabase user management system created for doc-builder authenticated sites.

## Overview

The user management system is a set of tools designed to manage user access to Supabase-authenticated documentation sites built with `@knowcode/doc-builder`. It provides a command-line interface for adding users, managing site access, and handling bulk operations.

## System Architecture

### Components

1. **Main Script** (`user-management/add-users.sh`)
   - Bash script providing the primary CLI interface
   - Handles all user management operations
   - Beautiful colored output with comprehensive help system

2. **Node.js Helper** (`user-management/create-user.js`)
   - Programmatic user creation using Supabase Admin API
   - Uses service role key for admin privileges
   - Handles password reset email sending

3. **Configuration Files**
   - `.env.example` - Template for environment variables
   - `.supabase-config` - Stores project ID after setup
   - `users.txt` - Example bulk user file

### Database Schema

The system works with two main tables:

**docbuilder_sites**
- `id` (UUID) - Primary key
- `domain` (TEXT) - Site URL without https://
- `name` (TEXT) - Display name
- `created_at` (TIMESTAMP)

**docbuilder_access**
- `user_id` (UUID) - References auth.users
- `site_id` (UUID) - References docbuilder_sites
- `created_at` (TIMESTAMP)
- Composite primary key on (user_id, site_id)

## Implementation Details

### User Creation Methods

Due to Supabase CLI limitations (no direct user creation commands), the system offers three methods:

1. **Manual Dashboard Creation** (Recommended)
   - Opens Supabase dashboard
   - User creates account via invitation
   - Most reliable method

2. **Programmatic Creation** (Advanced)
   - Requires service role key
   - Uses Supabase Admin API
   - Automatically sends password reset email
   - Implementation:
     ```javascript
     const { data, error } = await supabase.auth.admin.createUser({
       email: email,
       email_confirm: true,
       password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2).toUpperCase()
     });
     ```

3. **Skip Creation**
   - For users that already exist in the system
   - Proceeds directly to access granting

### SQL Execution Fallback Strategy

The script implements multiple fallback methods for SQL execution to handle different Supabase CLI versions:

1. **psql with DATABASE_URL**
   - First attempt if DATABASE_URL is set
   - Direct PostgreSQL connection

2. **Supabase db execute**
   - For newer CLI versions (2.7+)
   - Pipes SQL through stdin

3. **Manual execution**
   - Shows SQL in terminal
   - Provides dashboard link
   - Waits for user confirmation

### Key Functions

**execute_sql()**
- Attempts multiple SQL execution methods
- Provides graceful degradation
- Always ensures operation completion

**create_user()**
- Checks if user exists
- Offers creation options
- Handles all three creation methods

**grant_access()**
- Uses PL/pgSQL for atomic operations
- Validates site and user existence
- Handles duplicate access gracefully

## Usage Guide

### Initial Setup

```bash
# First time setup
cd user-management
./add-users.sh setup

# Enter your Supabase project ID when prompted
# This links the project and saves configuration
```

### Common Operations

**Add a single user:**
```bash
./add-users.sh add wru-bid-analysis.vercel.app user@email.com
```

**Bulk add from file:**
```bash
./add-users.sh bulk wru-bid-analysis.vercel.app users.txt
```

**List users for a site:**
```bash
./add-users.sh list wru-bid-analysis.vercel.app
```

**Check user status:**
```bash
./add-users.sh check user@email.com
```

**Remove access:**
```bash
./add-users.sh remove wru-bid-analysis.vercel.app user@email.com
```

### File Formats

**users.txt format:**
```
# Comments start with #
# One email per line
john@example.com
jane@example.com
admin@company.com
```

**.env format:**
```bash
# Your Supabase project ID
SUPABASE_PROJECT_ID=your-project-id-here

# Optional: Service role key for programmatic creation
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional: Direct database URL
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
```

## Security Considerations

1. **Service Role Key**
   - Never commit to version control
   - Only stored temporarily in memory
   - Used only for user creation

2. **Password Management**
   - System never handles user passwords
   - Random temporary passwords generated
   - Users must reset password via email

3. **Access Control**
   - Users only see sites they have access to
   - All operations are logged with timestamps
   - Destructive operations require confirmation

## Troubleshooting

### Common Issues

**"unknown command 'users' for 'supabase'"**
- Expected behavior - Supabase CLI doesn't have user commands
- Use the manual dashboard method or service role key

**"unknown shorthand flag: 'f' in -f"**
- Old Supabase CLI version
- Script automatically falls back to piping method

**"command not found: supabase db execute"**
- CLI version 2.6.8 or older
- Script provides SQL for manual execution

### Recommended Solutions

1. **Update Supabase CLI**
   ```bash
   npm update -g supabase
   ```

2. **Set DATABASE_URL**
   - Get from Supabase dashboard
   - Add to .env file
   - Enables direct psql execution

3. **Use Service Role Key**
   - For automated user creation
   - Find in project API settings

## Limitations

1. **User Deletion**
   - CLI cannot delete users from auth.users
   - Only removes access records
   - Full deletion requires dashboard

2. **Batch Operations**
   - No transaction support across user creation
   - Failures are reported but don't roll back

3. **CLI Version Dependencies**
   - Features vary by Supabase CLI version
   - Script handles gracefully but manual steps may be needed

## Best Practices

1. **User Onboarding**
   - Create users.txt file for teams
   - Use bulk add for efficiency
   - Verify with list command

2. **Access Management**
   - Regularly audit with list/check commands
   - Remove access promptly when needed
   - Document site ownership

3. **Security**
   - Keep service role key secure
   - Use .gitignore for sensitive files
   - Rotate keys periodically

## Integration with doc-builder

The user management system integrates seamlessly with `@knowcode/doc-builder`:

1. **Authentication Flow**
   - Users receive password reset email
   - Set password and login
   - Access controlled by docbuilder_access table

2. **Site Management**
   - Each deployed doc site has entry in docbuilder_sites
   - Access is per-site, not global
   - Multiple sites can share users

3. **Deployment Workflow**
   - Deploy site with doc-builder
   - Add site to docbuilder_sites table
   - Use this tool to grant user access

## Future Enhancements

Potential improvements identified:

1. **API Integration**
   - REST API for user management
   - Web interface for non-technical users
   - Webhook notifications

2. **Enhanced Features**
   - Role-based access control
   - Temporary access grants
   - Access expiration dates

3. **Better CLI Integration**
   - Direct integration with doc-builder CLI
   - Automated site creation on deployment
   - User sync from external systems

## Conclusion

This user management system provides a robust solution for managing access to Supabase-authenticated documentation sites. Despite Supabase CLI limitations, it offers multiple workarounds and maintains a user-friendly interface with comprehensive error handling and beautiful terminal output.

The system successfully demonstrates how to work around platform limitations while providing a professional tool that handles real-world authentication and authorization requirements.