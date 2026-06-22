import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback detection: If keys are missing, we log a warning.
// The rest of the app will gracefully degrade to 'Demo Mode' using mock data.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Running in demo mode with mock data.'
  );
}

/**
 * Singleton Supabase client instance.
 * Used globally across the application for DB, Auth, and Storage queries.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper function to determine if the app is connected to a real Supabase backend.
 * Checks for both the presence of the keys and ensures they aren't the default placeholder text.
 * 
 * @returns {boolean} True if valid Supabase credentials exist, false otherwise.
 */
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your_anon_key'
  );
};
