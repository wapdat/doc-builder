/**
 * Shared Supabase Authentication Configuration
 * 
 * These are the default Supabase credentials used by all doc-builder sites.
 * The same Supabase database is shared across all documentation sites,
 * with access control managed via the docbuilder_access table using domains as keys.
 */

module.exports = {
  // Shared Supabase project credentials
  supabaseUrl: 'https://xcihhnfcitjrwbynxmka.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaWhobmZjaXRqcndieW54bWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Mzc2MzcsImV4cCI6MjA2OTAxMzYzN30.zvWp3JFIR8fBIiwuFF5gqOR_Kxb42baZS5fsBz60XOY'
};