import { hasSupabaseConfig } from '../shared/supabase/client.js';
import { fetchPublicContent, mapSupabaseContentToSiteModel } from '../shared/supabase/content.js';

if (!hasSupabaseConfig) {
  console.error('Missing Supabase config. Run with: node --env-file=.env notebooks/test_shared_supabase.mjs');
  process.exit(1);
}

const data = await fetchPublicContent();
const mapped = mapSupabaseContentToSiteModel(data);

console.log(data);