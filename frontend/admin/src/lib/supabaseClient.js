// Supabase client bootstrap for browser-side admin usage.
// Reads URL/key from Vite environment variables and exposes a safe flag.
// Returns null when config is missing so callers can fail with clear messages.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const hasSupabaseConfig = supabaseUrl !== '' && supabaseAnonKey !== '';

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
