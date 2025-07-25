-- Doc-builder Supabase Database Setup
-- Run this in your Supabase SQL Editor

-- Table 1: Documentation sites
CREATE TABLE docbuilder_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: User access mapping
CREATE TABLE docbuilder_access (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    site_id UUID REFERENCES docbuilder_sites(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, site_id)
);

-- Enable Row Level Security
ALTER TABLE docbuilder_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE docbuilder_access ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see sites they have access to
CREATE POLICY "Users see accessible sites" ON docbuilder_sites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM docbuilder_access
            WHERE site_id = docbuilder_sites.id
            AND user_id = auth.uid()
        )
    );

-- RLS Policy: Users can see their own access
CREATE POLICY "Users see own access" ON docbuilder_access
    FOR SELECT USING (user_id = auth.uid());

-- Insert a test site for localhost development
INSERT INTO docbuilder_sites (domain, name) 
VALUES ('localhost:3000', 'Test Documentation Site')
RETURNING id, domain, name;