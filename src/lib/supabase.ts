import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client configuration
 * 
 * Environment variables required:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous key
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Database operations will fail.');
}

// Create a single Supabase client for use in the entire app
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Initialize Supabase tables (runs on first API call)
 * Creates all necessary tables if they don't exist
 */
export async function initSupabase() {
  try {
    // Check if tables exist by querying the public schema
    const { data, error } = await supabase
      .from('competitors')
      .select('count', { count: 'exact', head: true });

    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, create all tables
      console.log('Creating Supabase tables...');
      await createAllTables();
    }
  } catch (error) {
    console.error('Error checking/initializing Supabase:', error);
  }
}

/**
 * Create all database tables with proper schema
 */
async function createAllTables() {
  try {
    // We'll use the Supabase SQL editor for table creation
    // This function is a placeholder - actual table creation happens in Supabase dashboard
    console.log('Tables should be created via Supabase SQL editor');
    console.log('See docs/SUPABASE_SETUP.md for SQL scripts');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}
