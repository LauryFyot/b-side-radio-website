import { AwsClient } from 'aws4fetch';

const DRAFT_RETENTION_MS = 24 * 60 * 60 * 1000;
const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'https://b-side-radio-website.vercel.app',
  'https://b-side-radio-admin.vercel.app',
  'http://b-side-radio.com',
  'https://b-side-radio.com'
]);

function responseJson(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}

async function supabaseRequest(env, path, token, options = {}) {
  const response = await fetch(`${env.SUPABASE_URL.replace(/\/$/, '')}${path}`, {
    ...options,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Supabase verification failed (${response.status}). No R2 cleanup performed.`);
  }
  return response.json();
}

async function authorize(request, env) {
  const header = request.headers.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) {
    return false;
  }
  const token = header.slice(7);
  const user = await supabaseRequest(env, '/auth/v1/user', token);
  if (!user.id) {
    return false;
  }
  const allowed = await supabaseRequest(env, '/rest/v1/rpc/can_manage_content', token, {
    method: 'POST',
    body: JSON.stringify({ uid: user.id })
  });
  return allowed === true;
}

function objectKey(publicUrl, env) {
  try {
    const base = new URL(`${env.PUBLIC_BASE_URL.replace(/\/$/, '')}/`);
    const url = new URL(publicUrl);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) {
      return null;
    }
    return decodeURIComponent(url.pathname.slice(base.pathname.length));
  } catch {
    return null;
  }
}

async function readReferencedKeys(env) {
  const keys = new Set();
  const tables = [
    ['favorite_tracks', ['mp3_url', 'cover_url']],
    ['shows', ['cover_url']],
    ['featured_covers', ['image_url']]
  ];
  for (const [table, fields] of tables) {
    for (let offset = 0; ; offset += 1000) {
      const rows = await supabaseRequest(
        env,
        `/rest/v1/${table}?select=${fields.join(',')}&order=id.asc&limit=1000&offset=${offset}`,
        env.SUPABASE_SERVICE_ROLE_KEY
      );
      if (!Array.isArray(rows)) {
        throw new Error('Invalid Supabase media response. No R2 cleanup performed.');
      }
      for (const row of rows) {
        for (const field of fields) {
          const key = objectKey(row[field], env);
          if (key) {
            keys.add(key);
          }
        }
      }
      if (rows.length < 1000) {
        break;
      }
    }
  }
  return keys;
}

async function reconcileMixes(env, candidateUrls = []) {
  const referenced = await readReferencedKeys(env);
  const candidates = new Set(candidateUrls.map((url) => objectKey(url, env)).filter(Boolean));
  const deletable = [];
  let cursor;
  do {
    const page = await env.BSIDE_MEDIA.list({ prefix: 'tracks/', limit: 1000, ...(cursor ? { cursor } : {}) });
    for (const object of page.objects) {
      const abandoned = Date.now() - new Date(object.uploaded).getTime() > DRAFT_RETENTION_MS;
      if (!referenced.has(object.key) && (candidates.has(object.key) || abandoned)) {
        deletable.push(object.key);
      }
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  const latestReferences = deletable.length ? await readReferencedKeys(env) : referenced;
  const keys = deletable.filter((key) => !latestReferences.has(key));
  for (let offset = 0; offset < keys.length; offset += 1000) {
    await env.BSIDE_MEDIA.delete(keys.slice(offset, offset + 1000));
  }
  return { action: 'reconcile', deleted: keys.length };
}

async function signUpload(body, env) {
  const folder = String(body.folder || 'tracks');
  if (!['tracks', 'covers', 'shows'].includes(folder)) {
    throw new Error('Invalid upload folder.');
  }
  const fileName = String(body.fileName || 'file.mp3').replace(/[\/\\]/g, '_');
  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}-${fileName}`;
  const encodeSegment = (segment) => encodeURIComponent(segment).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  );
  const path = [env.R2_BUCKET_NAME, ...key.split('/')].map(encodeSegment).join('/');
  const url = new URL(`https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${path}`);
  url.searchParams.set('X-Amz-Expires', '600');
  const signer = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto'
  });
  const signed = await signer.sign(url, {
    method: 'PUT',
    headers: { 'Content-Type': String(body.contentType || 'application/octet-stream') },
    aws: { signQuery: true, allHeaders: true }
  });
  const publicPath = key.split('/').map(encodeSegment).join('/');
  return {
    uploadUrl: signed.url,
    publicUrl: `${env.PUBLIC_BASE_URL.replace(/\/$/, '')}/${publicPath}`,
    key
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      ...(ALLOWED_ORIGINS.has(origin) ? { 'Access-Control-Allow-Origin': origin } : {}),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin'
    };
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return responseJson({ error: 'Origin not allowed.' }, 403, cors);
    }
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return responseJson({ error: 'Method not allowed.' }, 405, cors);
    }
    try {
      if (!await authorize(request, env)) {
        return responseJson({ error: 'Admin authentication required.' }, 403, cors);
      }
      const body = await request.json();
      if (body.action === 'reconcile') {
        if (body.candidateUrls !== undefined && !Array.isArray(body.candidateUrls)) {
          return responseJson({ error: 'Invalid cleanup candidates.' }, 400, cors);
        }
        return responseJson(await reconcileMixes(env, body.candidateUrls || []), 200, cors);
      }
      if (body.action) {
        return responseJson({ error: 'Unknown action.' }, 400, cors);
      }
      return responseJson(await signUpload(body, env), 200, cors);
    } catch (error) {
      return responseJson({ error: error instanceof Error ? error.message : 'Unknown error' }, 500, cors);
    }
  },
  async scheduled(event, env) {
    await reconcileMixes(env);
  }
};
