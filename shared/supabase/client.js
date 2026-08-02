import { createClient } from '@supabase/supabase-js';

const viteSupabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
const viteSupabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';

const nodeSupabaseUrl = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL)
  || (typeof process !== 'undefined' && process.env?.SUPABASE_URL)
  || '';
const nodeSupabaseAnonKey = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY)
  || (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY)
  || '';

const supabaseUrl = viteSupabaseUrl || nodeSupabaseUrl;
const supabaseAnonKey = viteSupabaseAnonKey || nodeSupabaseAnonKey;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
