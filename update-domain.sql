-- Update domain for Vercel deployment
UPDATE docbuilder_sites 
SET domain = 'doc-builder-2znroyb5z-lindsay-1340s-projects.vercel.app'
WHERE id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';

-- Verify the update
SELECT id, domain, name 
FROM docbuilder_sites 
WHERE id = '4d8a53bf-dcdd-48c0-98e0-cd1451518735';