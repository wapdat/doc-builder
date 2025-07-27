# Private Directory Authentication Guide

## Overview

The @knowcode/doc-builder provides flexible authentication options to protect your documentation. You can either protect specific documents using a `private` directory or secure your entire documentation site.

## Two Authentication Modes

### 1. Private Directory Mode (Mixed Public/Private)

Create a `docs/private/` directory to automatically enable authentication for sensitive documents while keeping the rest of your documentation public.

**How it works:**
- Documents in `private/` folder require authentication
- Documents outside `private/` remain publicly accessible
- Login button appears in the header
- Perfect for documentation with some sensitive content

**Example structure:**
```
docs/
├── README.md              # ✅ Public - Anyone can access
├── getting-started.md     # ✅ Public - Anyone can access
├── guides/               
│   ├── installation.md    # ✅ Public - Anyone can access
│   └── usage.md          # ✅ Public - Anyone can access
└── private/              
    ├── api-keys.md       # 🔐 Private - Login required
    ├── deployment.md     # 🔐 Private - Login required
    └── internal/         
        └── secrets.md    # 🔐 Private - Login required
```

### 2. Full Site Authentication Mode

Make your entire documentation site private by setting authentication in your configuration file.

**How it works:**
- ALL documents require authentication
- No public access whatsoever
- Login required before viewing any page
- Perfect for internal company documentation

**Configuration:**
```javascript
// doc-builder.config.js
module.exports = {
  features: {
    authentication: 'supabase'  // Entire site requires login
  },
  // ... other config
};
```

## How They Work Together

If you have **both** a private directory AND set authentication in your config:
- The private directory **always** triggers authentication (for security)
- Setting `authentication: 'supabase'` makes the entire site private
- Setting `authentication: false` is overridden by private directory presence
- This ensures private content is never accidentally exposed

## User Experience

### Private Directory Mode

**Unauthenticated users see:**
- Only public documents in navigation
- Login button in header
- Access to all public content
- Redirect to login if trying to access private URLs

**Authenticated users see:**
- Complete navigation including private folders
- Logout button in header  
- Full access to all documentation
- Seamless experience across public and private content

### Full Site Mode

**Everyone must:**
- Login before accessing any content
- Authenticate to see navigation
- Have valid credentials to view any page

## Setting Up Supabase Authentication

Both authentication modes use Supabase for secure user management. Here's how to configure it:

### 1. Credentials Are Automatic! (v1.8.2+)

No need to configure credentials anymore! The shared Supabase database is automatically configured. Each site gets a unique auto-generated site ID during build.

To override with custom credentials (optional):

```javascript
module.exports = {
  auth: {
    supabaseUrl: 'https://your-project.supabase.co',  // Optional override
    supabaseAnonKey: 'your-anon-key',                 // Optional override
    siteId: 'your-site-id'                            // Optional custom ID
  }
};
```

### 2. Create Access Control Table

In your Supabase dashboard, run this SQL (or use setup-database-v2.sql):

```sql
CREATE TABLE docbuilder_access (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, domain)
);

-- Create index for performance
CREATE INDEX idx_docbuilder_access_domain ON docbuilder_access(domain);

-- Enable Row Level Security
ALTER TABLE docbuilder_access ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users see own access" ON docbuilder_access
    FOR SELECT USING (user_id = auth.uid());
```

### 3. Grant User Access

Add authorized users by domain:

```sql
-- First, create a user in Supabase Auth
-- Then grant them access to your documentation domain
INSERT INTO docbuilder_access (user_id, domain)
VALUES ('user-uuid-from-auth-users', 'docs.example.com');

-- Or grant access to multiple domains
INSERT INTO docbuilder_access (user_id, domain) VALUES 
  ('user-uuid', 'docs.example.com'),
  ('user-uuid', 'staging-docs.example.com'),
  ('user-uuid', 'localhost:3000');
```

### Automatic Credential Configuration

Starting from version 1.8.2, authentication is truly zero-configuration:
- All doc-builder sites share the same Supabase authentication database
- Credentials are built into the package - no manual configuration needed
- No site IDs needed - the system uses your domain automatically
- Just grant users access to your domain in the database

**Note**: When you build with a private directory:
```
🔐 Found private directory - automatically enabling Supabase authentication
   Note: Grant users access by adding domain to the docbuilder_access table
```

**Example**: For a site at `docs.example.com`, grant access with:
```sql
INSERT INTO docbuilder_access (user_id, domain) 
VALUES ('user-uuid', 'docs.example.com');
```

## Best Practices

### Choosing the Right Mode

**Use Private Directory Mode when:**
- Most documentation is public
- Only specific sections need protection
- You want easy public access to general docs
- Examples: Open source projects with private contributor guides

**Use Full Site Mode when:**
- All content is confidential
- Documentation is for internal use only
- You need maximum security
- Examples: Company handbooks, internal APIs

### Organizing Private Content

Structure your private directory meaningfully:

```
private/
├── admin/              # Admin-only documentation
├── api/                # Internal API docs  
├── deployment/         # Deployment procedures
├── credentials/        # API keys and secrets
└── team/              # Team processes
```

### Security Features

1. **Build-Time Protection**: Private files excluded from public navigation during build
2. **URL Protection**: Direct access to private URLs redirects to login
3. **Session Management**: Supabase handles secure sessions
4. **Access Control**: Fine-grained permissions via database

### Migration Strategies

**Moving to Private Directory Mode:**
1. Create `docs/private/` folder
2. Move sensitive documents into it
3. Update internal links if needed
4. Deploy - authentication automatically enabled

**Moving to Full Site Mode:**
1. Add `authentication: 'supabase'` to config
2. Configure Supabase credentials
3. Deploy - entire site now requires login

## Common Scenarios

### Example 1: Open Source Project with Private Docs

```
docs/
├── README.md                    # ✅ Public - Project overview
├── contributing.md              # ✅ Public - How to contribute
├── api-reference.md            # ✅ Public - API documentation
└── private/
    ├── deployment.md           # 🔐 Private - How to deploy
    ├── api-keys.md            # 🔐 Private - Production keys
    └── maintenance.md         # 🔐 Private - Admin procedures
```

Perfect for: Open source projects where most docs are public but deployment and admin info is private.

### Example 2: Company Documentation Portal

```javascript
// doc-builder.config.js
module.exports = {
  features: {
    authentication: 'supabase'  // Everything requires login
  }
};
```

Perfect for: Internal company wikis where all content is confidential.

### Example 3: Client Documentation with Mixed Access

```
docs/
├── getting-started.md          # ✅ Public - Basic setup
├── faq.md                     # ✅ Public - Common questions
├── changelog.md               # ✅ Public - Version history
└── private/
    ├── advanced-config.md     # 🔐 Private - Advanced setup
    ├── troubleshooting.md     # 🔐 Private - Debug guides
    └── support-contacts.md    # 🔐 Private - Direct contacts
```

Perfect for: SaaS products where basic docs are public but advanced guides require authentication.

## Quick Reference

| Feature | Private Directory Mode | Full Site Mode |
|---------|----------------------|----------------|
| **Trigger** | Create `docs/private/` folder | Set `authentication: 'supabase'` in config |
| **Public Access** | Yes, for non-private docs | No, everything requires login |
| **Use Case** | Mixed public/private content | Fully private documentation |
| **Configuration** | Zero config (just create folder) | One line in config file |
| **Login Button** | Shows when private folder exists | Shows when config enabled |

## Summary

The @knowcode/doc-builder provides two simple ways to protect your documentation:

1. **Private Directory**: Just create a `private` folder for mixed public/private sites
2. **Full Authentication**: Add one line to config for completely private sites

Both approaches use the same secure Supabase authentication system, giving you flexibility to choose the right protection level for your documentation needs.