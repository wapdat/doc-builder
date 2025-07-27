-- Doc-builder Supabase Database Setup V2
-- Simplified schema using domains instead of site IDs
-- Run this in your Supabase SQL Editor

-- Drop old tables if migrating
-- DROP TABLE IF EXISTS docbuilder_access;
-- DROP TABLE IF EXISTS docbuilder_sites;

-- Single table for user access control
CREATE TABLE docbuilder_access (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, domain)
);

-- Create index for faster lookups
CREATE INDEX idx_docbuilder_access_domain ON docbuilder_access(domain);

-- Enable Row Level Security
ALTER TABLE docbuilder_access ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own access
CREATE POLICY "Users see own access" ON docbuilder_access
    FOR SELECT USING (user_id = auth.uid());

-- Example: Grant access to a user for a specific domain
-- INSERT INTO docbuilder_access (user_id, domain) 
-- VALUES ('user-uuid-here', 'doc-builder-delta.vercel.app');

-- Example: Grant access to multiple users for a domain
-- INSERT INTO docbuilder_access (user_id, domain) VALUES 
--   ('user-1-uuid', 'mydocs.vercel.app'),
--   ('user-2-uuid', 'mydocs.vercel.app'),
--   ('user-3-uuid', 'mydocs.vercel.app');

-- Example: Grant a user access to multiple domains
-- INSERT INTO docbuilder_access (user_id, domain) VALUES 
--   ('user-uuid', 'docs.example.com'),
--   ('user-uuid', 'internal-docs.example.com'),
--   ('user-uuid', 'api-docs.example.com');

-- View all access for a domain (admin use)
-- SELECT u.email, da.created_at
-- FROM docbuilder_access da
-- JOIN auth.users u ON da.user_id = u.id
-- WHERE da.domain = 'mydocs.vercel.app';

-- Migration from old schema (if needed)
-- INSERT INTO docbuilder_access (user_id, domain)
-- SELECT da.user_id, ds.domain
-- FROM old_docbuilder_access da
-- JOIN docbuilder_sites ds ON da.site_id = ds.id;