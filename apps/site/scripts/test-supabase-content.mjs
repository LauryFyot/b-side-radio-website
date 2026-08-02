import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

async function loadEnvFromFile(filePath) {
  const raw = await readFile(filePath, 'utf8');
  const env = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['\"]|['\"]$/g, '');
    env[key] = value;
  }

  return env;
}

async function loadOptionalEnv(filePath) {
  try {
    return await loadEnvFromFile(filePath);
  } catch {
    return {};
  }
}

async function queryTable(client, table, select, orderColumn) {
  let query = client.from(table).select(select);
  if (orderColumn) {
    query = query.order(orderColumn, { ascending: true });
  }

  const { data, error } = await query;
  return {
    table,
    ok: !error,
    count: Array.isArray(data) ? data.length : 0,
    error: error?.message || null,
    sample: Array.isArray(data) && data.length > 0 ? data[0] : null,
  };
}

async function main() {
  const fileEnv = await loadOptionalEnv(new URL('../.env', import.meta.url));
  const url = process.env.VITE_SUPABASE_URL || fileEnv.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || fileEnv.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
    console.error('Create apps/site/.env with these keys, or pass them inline when running the command.');
    process.exit(1);
  }

  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const checks = await Promise.all([
    queryTable(client, 'featured_covers', 'id,title,image_url,sort_order,is_active', 'sort_order'),
    queryTable(client, 'favorite_tracks', 'id,title,cover_url,mp3_url,sort_order,is_active', 'sort_order'),
    queryTable(client, 'featured_videos', 'id,slot,title,youtube_url,is_active', 'slot'),
    queryTable(client, 'shows', 'id,name,slug,is_active', 'id'),
    queryTable(client, 'show_slots', 'id,show_id,day_of_week,start_time,end_time,is_active', 'day_of_week'),
  ]);

  console.log('Supabase content checks (apps/site/.env):');
  for (const check of checks) {
    if (check.ok) {
      console.log(`- ${check.table}: OK (${check.count} rows)`);
      if (check.sample) {
        console.log(`  sample: ${JSON.stringify(check.sample)}`);
      }
    } else {
      console.log(`- ${check.table}: ERROR -> ${check.error}`);
    }
  }

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    process.exit(2);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
