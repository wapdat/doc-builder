/**
 * Shared Supabase Authentication Configuration
 * 
 * These are the default Supabase credentials used by all doc-builder sites.
 * The same Supabase database is shared across all documentation sites,
 * with access control managed via the docbuilder_access table.
 */

module.exports = {
  // Shared Supabase project credentials
  supabaseUrl: 'https://xcihhnfcitjrwbynxmka.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaWhobmZjaXRqcndieW54bWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Mzc2MzcsImV4cCI6MjA2OTAxMzYzN30.zvWp3JFIR8fBIiwuFF5gqOR_Kxb42baZS5fsBz60XOY',
  
  // Function to generate a unique site ID
  generateSiteId: function(siteName) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const cleanName = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${cleanName}-${timestamp}-${random}`;
  }
};