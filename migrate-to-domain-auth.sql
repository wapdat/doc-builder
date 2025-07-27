-- Migration Script: From Site IDs to Domain-based Authentication
-- IMPORTANT: Backup your database before running this!

-- Step 1: Create new table structure
CREATE TABLE IF NOT EXISTS docbuilder_access_new (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, domain)
);

-- Step 2: Migrate existing data (join access with sites to get domains)
INSERT INTO docbuilder_access_new (user_id, domain, created_at)
SELECT 
    da.user_id,
    ds.domain,
    da.created_at
FROM docbuilder_access da
JOIN docbuilder_sites ds ON da.site_id = ds.id
ON CONFLICT (user_id, domain) DO NOTHING;

-- Step 3: Create index
CREATE INDEX IF NOT EXISTS idx_docbuilder_access_new_domain ON docbuilder_access_new(domain);

-- Step 4: Enable RLS
ALTER TABLE docbuilder_access_new ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policy
CREATE POLICY "Users see own access" ON docbuilder_access_new
    FOR SELECT USING (user_id = auth.uid());

-- Step 6: Verify migration (check counts)
SELECT 'Old access records:' as info, COUNT(*) as count FROM docbuilder_access
UNION ALL
SELECT 'New access records:' as info, COUNT(*) as count FROM docbuilder_access_new
UNION ALL
SELECT 'Sites migrated:' as info, COUNT(DISTINCT domain) as count FROM docbuilder_access_new;

-- Step 7: Once verified, swap tables (CAREFUL - This is the point of no return!)
-- DROP TABLE IF EXISTS docbuilder_access;
-- ALTER TABLE docbuilder_access_new RENAME TO docbuilder_access;
-- DROP TABLE IF EXISTS docbuilder_sites;

-- Step 8: Update index name
-- ALTER INDEX idx_docbuilder_access_new_domain RENAME TO idx_docbuilder_access_domain;

-- Note: Uncomment steps 7 and 8 only after verifying the migration worked correctly!