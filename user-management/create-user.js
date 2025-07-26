#!/usr/bin/env node

// Helper script to create users using Supabase Admin API
// This requires the service_role key which has admin privileges

const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Get arguments
const [,, email, projectUrl, serviceKey] = process.argv;

if (!email || !projectUrl || !serviceKey) {
  console.error('Usage: node create-user.js <email> <project-url> <service-role-key>');
  console.error('Example: node create-user.js user@example.com https://xxx.supabase.co YOUR_SERVICE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(projectUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createUser(email) {
  try {
    // Create user with Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: true,
      // Generate a random password (user will reset it)
      password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2).toUpperCase()
    });

    if (error) {
      if (error.message.includes('already been registered')) {
        console.log('User already exists');
        return true;
      }
      throw error;
    }

    console.log('User created successfully');
    
    // Send password reset email
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
    
    if (resetError) {
      console.error('Warning: Could not send password reset email:', resetError.message);
    } else {
      console.log('Password reset email sent');
    }
    
    return true;
  } catch (error) {
    console.error('Error creating user:', error.message);
    return false;
  }
}

// Run the function
createUser(email).then(success => {
  process.exit(success ? 0 : 1);
});