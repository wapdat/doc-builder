// doc-builder.config.js - Configuration with Supabase Authentication
module.exports = {
  siteName: 'WRU Bid Analysis Documentation',
  siteDescription: 'Analysis and documentation for WRU bidding process',
  
  // Enable Supabase authentication
  features: {
    authentication: 'supabase'  // This turns on auth (set to false for public)
  },
  
  // Supabase configuration
  auth: {
    supabaseUrl: 'https://xcihhnfcitjrwbynxmka.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaWhobmZjaXRqcndieW54bWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Mzc2MzcsImV4cCI6MjA2OTAxMzYzN30.zvWp3JFIR8fBIiwuFF5gqOR_Kxb42baZS5fsBz60XOY',
    siteId: '4d8a53bf-dcdd-48c0-98e0-cd1451518735'
  }
};