import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

const schema = readFileSync(new URL('../../../supabase/schema.sql', import.meta.url), 'utf8');
const migration = readFileSync(new URL('../../../supabase/comment-replies-migration.sql', import.meta.url), 'utf8');

test('reply migration matches the initial schema', () => {
  const definitions = migration.trim().replace(/^begin;\s*/, '').replace(/\s*commit;$/, '').replace(/\s+/g, ' ');
  assert.ok(schema.replace(/\s+/g, ' ').includes(definitions));
});

test('PostgreSQL enforces staff reply permissions and visibility', async (suite) => {
  const db = new PGlite();
  suite.after(() => db.close());
  await db.exec(`
    create role anon; create role authenticated; create schema auth;
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    grant usage on schema auth to anon, authenticated;
    create table profiles(id uuid primary key, display_name text, is_active boolean default true);
    create table roles(id bigint primary key, slug text);
    create table user_roles(user_id uuid, role_id bigint);
    create table comments(id bigint primary key, status text);
    alter table comments enable row level security;
    create policy public_comments on comments for select to anon using (status = 'approved');
    create policy staff_comments on comments for select to authenticated using (true);
    grant select on comments to anon, authenticated;
    insert into roles values (1, 'admin'), (2, 'moderator'), (3, 'editor'), (4, 'super_admin');
    insert into comments values (1, 'approved'), (2, 'removed');
  `);
  for (const name of ['has_role', 'can_moderate_comments']) {
    const definition = schema.match(new RegExp(`create or replace function public\\.${name}\\([\\s\\S]*?\\$\\$;`));
    assert.ok(definition, `${name} must use the real schema definition`);
    await db.exec(definition[0]);
  }
  const uuid = (id) => `00000000-0000-0000-0000-${String(id).padStart(12, '0')}`;
  for (const [id, name, active, role] of [[1, 'Alice', true, 1], [2, 'Bob', true, 2], [3, 'Visitor', true, null], [4, 'Editor', true, 3], [5, 'Inactive', false, 2], [6, '', true, 2], [7, 'Super', true, 4]]) {
    await db.query('insert into profiles values ($1,$2,$3)', [uuid(id), name, active]);
    if (role) await db.query('insert into user_roles values ($1,$2)', [uuid(id), role]);
  }
  await db.exec(migration);
  await db.exec(migration);
  async function user(id) {
    await db.exec(`reset role; set request.jwt.claim.sub = '${uuid(id)}'; set role authenticated;`);
  }
  let alice;

  await suite.test('admins and moderators can each reply once to the same comment', async () => {
    await user(1);
    alice = (await db.query("insert into comment_replies(comment_id,body) values(1,'  Alice reply  ') returning *")).rows[0];
    assert.equal(alice.author_name, 'Alice');
    assert.equal(alice.author_id, uuid(1));
    assert.equal(alice.body, 'Alice reply');
    await assert.rejects(() => db.query("insert into comment_replies(comment_id,body) values(1,'Duplicate')"), (error) => error.code === '23505');
    await user(2);
    await db.query("insert into comment_replies(comment_id,body) values(1,'Bob reply')");
  });

  await suite.test('visitors, editors, inactive staff and nameless profiles cannot reply', async () => {
    for (const id of [3, 4, 5, 6]) {
      await user(id);
      await assert.rejects(() => db.query("insert into comment_replies(comment_id,body) values(1,'Not allowed')"));
    }
  });

  await suite.test('neither other moderators nor super-admins can edit or delete another author reply', async () => {
    for (const id of [2, 7]) {
      await user(id);
      assert.equal((await db.query('update comment_replies set body=$1 where id=$2 returning id', ['Spoof', alice.id])).rows.length, 0);
      assert.equal((await db.query('delete from comment_replies where id=$1 returning id', [alice.id])).rows.length, 0);
    }
  });

  await suite.test('identity and parent cannot be spoofed; empty and oversized messages are rejected', async () => {
    await user(1);
    await assert.rejects(() => db.query('insert into comment_replies(comment_id,body,author_id) values(2,$1,$2)', ['Spoof', uuid(2)]));
    await assert.rejects(() => db.query('update comment_replies set author_name=$1 where id=$2', ['Bob', alice.id]));
    await assert.rejects(() => db.query('update comment_replies set comment_id=2 where id=$1', [alice.id]));
    for (const body of ['   ', 'x'.repeat(1001)]) await assert.rejects(() => db.query('update comment_replies set body=$1 where id=$2', [body, alice.id]));
    const edited = (await db.query('update comment_replies set body=$1 where id=$2 returning *', ['Correction', alice.id])).rows[0];
    assert.equal(edited.author_name, 'Alice');
    assert.equal(edited.body, 'Correction');
  });

  await suite.test('anonymous users see public text, never account identifiers, and cannot write', async () => {
    await db.exec('reset role; set role anon;');
    assert.equal((await db.query('select body,author_name from comment_replies')).rows.length, 2);
    await assert.rejects(() => db.query('select author_id from comment_replies'));
    await assert.rejects(() => db.query("insert into comment_replies(comment_id,body) values(1,'Anonymous')"));
    await assert.rejects(() => db.query("update comment_replies set body='Anonymous'"));
    await assert.rejects(() => db.query('delete from comment_replies'));
  });

  await suite.test('hidden parents hide all replies, including from authenticated visitors', async () => {
    await db.exec("reset role; update comments set status='removed' where id=1; set role anon;");
    assert.equal((await db.query('select body from comment_replies')).rows.length, 0);
    await user(3);
    assert.equal((await db.query('select body from comment_replies')).rows.length, 0);
    await user(2);
    assert.equal((await db.query('select body from comment_replies')).rows.length, 2);
  });

  await suite.test('the author can delete; deleting a parent removes remaining replies', async () => {
    await user(1);
    assert.equal((await db.query('delete from comment_replies where id=$1 returning id', [alice.id])).rows.length, 1);
    await db.exec('reset role; delete from comments where id=1;');
    assert.equal((await db.query('select * from comment_replies')).rows.length, 0);
  });
});