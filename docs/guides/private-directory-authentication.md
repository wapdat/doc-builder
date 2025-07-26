# Private Directory Authentication Guide

## Overview

The @knowcode/doc-builder now includes automatic authentication for documents placed in a `private` directory. This feature provides a simple, convention-based approach to protecting sensitive documentation without requiring complex configuration.

## How It Works

### Automatic Detection

When the doc-builder detects a `docs/private/` directory during the build process, it automatically:

1. Enables Supabase authentication for the entire site
2. Hides all private documents from unauthenticated users
3. Shows a login button in the header
4. Requires authentication to access any document in the private directory

### Zero Configuration

Simply create a `private` folder in your docs directory:

```
docs/
├── README.md           # Public documentation
├── guides/            # Public guides
│   └── setup.md
└── private/           # 🔐 Protected documents
    ├── api-keys.md
    ├── internal/
    │   └── architecture.md
    └── team-notes.md
```

That's it! No configuration changes needed.

## User Experience

### For Unauthenticated Users

- Private documents are completely invisible in the navigation menu
- Attempting to access a private URL directly redirects to login
- Only public documentation is shown
- Login icon appears in the header

### For Authenticated Users

- Full navigation menu including private documents
- Seamless access to all documentation
- Logout icon replaces login icon in header
- No visual distinction between public and private docs

## Setting Up Authentication

While the private directory triggers authentication automatically, you still need to configure Supabase credentials:

### 1. Configure Supabase

In your `doc-builder.config.js`:

```javascript
module.exports = {
  auth: {
    supabaseUrl: 'https://your-project.supabase.co',
    supabaseAnonKey: 'your-anon-key',
    siteId: 'your-site-id'
  }
};
```

### 2. Set Up Database Access

Create the `docbuilder_access` table in Supabase:

```sql
CREATE TABLE docbuilder_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, site_id)
);
```

### 3. Grant User Access

Add users to your site:

```sql
INSERT INTO docbuilder_access (user_id, site_id)
VALUES ('user-uuid-here', 'your-site-id');
```

## Best Practices

### Organizing Private Content

Structure your private directory logically:

```
private/
├── admin/              # Admin-only documentation
├── api/                # Internal API docs
├── deployment/         # Deployment guides
├── keys-and-secrets/   # Sensitive configurations
└── team/               # Team-specific docs
```

### Security Considerations

1. **Complete Isolation**: Private documents are never sent to unauthenticated users
2. **No Partial Access**: Users either see all private docs or none
3. **Server-Side Protection**: Navigation filtering happens during build time
4. **Client-Side Verification**: Additional checks on the client prevent unauthorized access

### Migration Tips

If you have existing documentation:

1. Identify sensitive documents
2. Move them to the `private/` directory
3. Update any internal links
4. Rebuild and deploy

## Examples

### Simple Private Document

Create `docs/private/api-keys.md`:

```markdown
# API Keys and Secrets

## Production Keys

- API Gateway: `sk_live_...`
- Database: `postgres://...`
- Third-party service: `...`
```

This document will only be visible to authenticated users.

### Mixed Public/Private Structure

```
docs/
├── README.md                    # ✅ Public
├── guides/
│   ├── getting-started.md      # ✅ Public
│   └── troubleshooting.md      # ✅ Public
├── api/
│   ├── overview.md             # ✅ Public
│   └── endpoints.md            # ✅ Public
└── private/
    ├── deployment-guide.md     # 🔐 Private
    ├── internal-api.md         # 🔐 Private
    └── team/
        ├── onboarding.md       # 🔐 Private
        └── processes.md        # 🔐 Private
```

## Troubleshooting

### Private Directory Not Detected

Ensure your private directory is directly under the docs folder:
- ✅ `docs/private/`
- ❌ `docs/guides/private/`

### Authentication Not Working

Check the console for messages:
- "🔐 Found private directory - automatically enabling Supabase authentication"
- "⚠️ Supabase credentials not configured"

### Users Can't Access Private Docs

Verify:
1. User exists in Supabase Auth
2. User has entry in `docbuilder_access` table
3. `site_id` matches your configuration

## Summary

The private directory feature provides the simplest way to protect sensitive documentation:

1. Create `docs/private/` directory
2. Put sensitive docs inside
3. Configure Supabase credentials
4. Deploy

No complex configuration, no manual setup - just organize your files and go!