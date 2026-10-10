import assert from 'node:assert/strict';
import { createHash, createHmac } from 'node:crypto';
import { afterEach, test } from 'node:test';
import worker from './r2-upload-worker.js';

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

function fixture({ rows = {}, objects = [], failReads = false, allowed = true, pageSize = 1000 } = {}) {
  const stored = new Map(objects.map((object) => [object.key, object]));
  const env = {
    SUPABASE_URL: 'https://database.example',
    SUPABASE_SERVICE_ROLE_KEY: 'server-only-test-key',
    PUBLIC_BASE_URL: 'https://media.example',
    R2_ACCOUNT_ID: 'test-account',
    R2_BUCKET_NAME: 'bside-media',
    R2_ACCESS_KEY_ID: 'test-access',
    R2_SECRET_ACCESS_KEY: 'test-secret',
    BSIDE_MEDIA: {
      async list({ prefix, cursor }) {
        const matches = [...stored.values()].filter((object) => object.key.startsWith(prefix));
        const offset = Number(cursor || 0);
        const truncated = offset + pageSize < matches.length;
        return {
          objects: matches.slice(offset, offset + pageSize),
          truncated,
          ...(truncated ? { cursor: String(offset + pageSize) } : {})
        };
      },
      async delete(keys) {
        for (const key of keys) stored.delete(key);
      }
    }
  };
  globalThis.fetch = async (url) => {
    const path = new URL(url).pathname;
    if (path === '/auth/v1/user') return Response.json({ id: 'editor-id' });
    if (path.endsWith('/can_manage_content')) return Response.json(allowed);
    if (failReads) return new Response('unavailable', { status: 503 });
    return Response.json(rows[path.split('/').pop()] || []);
  };
  return { env, stored };
}

function cleanupRequest(candidateUrls = [], authenticated = true) {
  return new Request('https://worker.example', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(authenticated ? { Authorization: 'Bearer test-session' } : {}) },
    body: JSON.stringify({ action: 'reconcile', candidateUrls })
  });
}

const oldDate = new Date(Date.now() - 48 * 60 * 60 * 1000);

function expectedUploadSignature(url, contentType, secretAccessKey) {
  const params = new URLSearchParams(url.searchParams);
  params.delete('X-Amz-Signature');
  params.sort();
  const canonicalRequest = [
    'PUT',
    url.pathname,
    params.toString(),
    `content-type:${contentType}\nhost:${url.host}\n`,
    'content-type;host',
    'UNSIGNED-PAYLOAD'
  ].join('\n');
  const scope = params.get('X-Amz-Credential').split('/').slice(1);
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    params.get('X-Amz-Date'),
    scope.join('/'),
    createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');
  let signingKey = Buffer.from(`AWS4${secretAccessKey}`);
  for (const component of scope) {
    signingKey = createHmac('sha256', signingKey).update(component).digest();
  }
  return createHmac('sha256', signingKey).update(stringToSign).digest('hex');
}

test('publication removes replaced and deleted mixes but preserves every referenced file', async () => {
  const { env, stored } = fixture({
    rows: {
      favorite_tracks: [{ mp3_url: 'https://media.example/tracks/current.mp3' }],
      shows: [{ cover_url: 'https://media.example/tracks/shared.mp3' }]
    },
    objects: ['current', 'shared', 'replaced', 'removed'].map((name) => ({ key: `tracks/${name}.mp3`, uploaded: oldDate }))
  });
  const response = await worker.fetch(cleanupRequest(), env);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).deleted, 2);
  assert.deepEqual([...stored.keys()], ['tracks/current.mp3', 'tracks/shared.mp3']);
});

test('fresh obsolete upload is deleted only when explicitly nominated', async () => {
  const { env, stored } = fixture({ objects: [
    { key: 'tracks/replaced.mp3', uploaded: new Date() },
    { key: 'tracks/other-draft.mp3', uploaded: new Date() },
    { key: 'covers/image.jpg', uploaded: oldDate }
  ] });
  const response = await worker.fetch(cleanupRequest(['https://media.example/tracks/replaced.mp3']), env);
  assert.equal((await response.json()).deleted, 1);
  assert.deepEqual([...stored.keys()], ['tracks/other-draft.mp3', 'covers/image.jpg']);
});

test('database failure never removes objects', async () => {
  const { env, stored } = fixture({ failReads: true, objects: [{ key: 'tracks/keep.mp3', uploaded: oldDate }] });
  const response = await worker.fetch(cleanupRequest(), env);
  assert.equal(response.status, 500);
  assert.equal(stored.size, 1);
});

test('missing session and non-editor users cannot remove files', async () => {
  const { env, stored } = fixture({ allowed: false, objects: [{ key: 'tracks/keep.mp3', uploaded: oldDate }] });
  assert.equal((await worker.fetch(cleanupRequest([], false), env)).status, 403);
  assert.equal((await worker.fetch(cleanupRequest(), env)).status, 403);
  assert.equal(stored.size, 1);
});

test('daily cleanup removes abandoned drafts without touching recent drafts', async () => {
  const { env, stored } = fixture({ objects: [
    { key: 'tracks/abandoned.mp3', uploaded: oldDate },
    { key: 'tracks/recent.mp3', uploaded: new Date() }
  ] });
  await worker.scheduled({}, env);
  assert.deepEqual([...stored.keys()], ['tracks/recent.mp3']);
});

test('cleanup visits all R2 pages before deleting objects', async () => {
  const { env, stored } = fixture({
    pageSize: 1,
    rows: { favorite_tracks: [{ mp3_url: 'https://media.example/tracks/current.mp3' }] },
    objects: ['first', 'current', 'last'].map((name) => ({ key: `tracks/${name}.mp3`, uploaded: oldDate }))
  });
  const response = await worker.fetch(cleanupRequest(), env);
  assert.equal((await response.json()).deleted, 2);
  assert.deepEqual([...stored.keys()], ['tracks/current.mp3']);
});

test('final reference check protects a mix published during listing', async () => {
  const rows = { favorite_tracks: [] };
  const { env, stored } = fixture({ rows, objects: [{ key: 'tracks/newly-published.mp3', uploaded: oldDate }] });
  const list = env.BSIDE_MEDIA.list;
  env.BSIDE_MEDIA.list = async (options) => {
    const page = await list(options);
    rows.favorite_tracks.push({ mp3_url: 'https://media.example/tracks/newly-published.mp3' });
    return page;
  };
  const response = await worker.fetch(cleanupRequest(), env);
  assert.equal((await response.json()).deleted, 0);
  assert.equal(stored.size, 1);
});

test('signing encodes accents and reserved filename characters consistently', async () => {
  const { env } = fixture();
  const request = new Request('https://worker.example', {
    method: 'POST',
    headers: { Authorization: 'Bearer test-session', 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder: 'tracks', fileName: 'mix-\u00e9+#?.mp3', contentType: 'audio/mpeg' })
  });
  const response = await worker.fetch(request, env);
  assert.equal(response.status, 200);
  const payload = await response.json();
  const signed = new URL(payload.uploadUrl);
  const publicUrl = new URL(payload.publicUrl);
  assert.equal(decodeURIComponent(signed.pathname), `/bside-media/${payload.key}`);
  assert.equal(decodeURIComponent(publicUrl.pathname), `/${payload.key}`);
  assert.equal(signed.searchParams.get('X-Amz-Expires'), '600');
  assert.equal(signed.searchParams.get('X-Amz-SignedHeaders'), 'content-type;host');
  assert.equal(
    signed.searchParams.get('X-Amz-Signature'),
    expectedUploadSignature(signed, 'audio/mpeg', env.R2_SECRET_ACCESS_KEY)
  );
});