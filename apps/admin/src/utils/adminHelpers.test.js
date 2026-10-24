import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getMediaItemKey, prependMediaItem, reorderMediaItems } from './adminHelpers.js';

test('new media items are prepended and all positions are normalized', () => {
  const items = [{ id: 1, title: 'First', sort_order: 5 }, { id: 2, title: 'Second', sort_order: 8 }];
  const result = prependMediaItem(items, { id: null, draft_key: 'new', title: 'New' });
  assert.deepEqual(result.map((item) => item.title), ['New', 'First', 'Second']);
  assert.deepEqual(result.map((item) => item.sort_order), [0, 1, 2]);
  assert.deepEqual(items.map((item) => item.sort_order), [5, 8]);
});

test('multiple unpublished items keep distinct identities after adding and moving', () => {
  const first = { id: null, draft_key: 'first', title: 'First', image_url: 'first.png' };
  const second = { id: null, draft_key: 'second', title: 'Second', mp3_url: 'second.mp3' };
  const items = prependMediaItem(prependMediaItem([], first), second);
  assert.equal(new Set(items.map(getMediaItemKey)).size, 2);
  const result = reorderMediaItems(items, 'draft-second', 'draft-first');
  assert.deepEqual(result.map((item) => item.title), ['First', 'Second']);
  assert.equal(result[0].image_url, 'first.png');
  assert.equal(result[1].mp3_url, 'second.mp3');
});

test('saved and draft cards move in both directions without losing data', () => {
  const items = [{ id: 1 }, { id: null, draft_key: 'draft' }, { id: 2 }];
  const forward = reorderMediaItems(items, 'saved-1', 'saved-2');
  assert.deepEqual(forward.map(getMediaItemKey), ['draft-draft', 'saved-2', 'saved-1']);
  const backward = reorderMediaItems(forward, 'saved-1', 'draft-draft');
  assert.deepEqual(backward.map(getMediaItemKey), items.map(getMediaItemKey));
  assert.deepEqual(backward.map((item) => item.sort_order), [0, 1, 2]);
  assert.deepEqual(items, [{ id: 1 }, { id: null, draft_key: 'draft' }, { id: 2 }]);
});

test('missing targets and same-position drops are harmless', () => {
  const items = [{ id: 1 }];
  assert.equal(reorderMediaItems(items, 'saved-1', 'saved-1'), items);
  assert.equal(reorderMediaItems(items, 'saved-1', 'missing'), items);
  assert.equal(reorderMediaItems(items, 'missing', 'saved-1'), items);
  const empty = [];
  assert.equal(reorderMediaItems(empty, 'saved-1', 'saved-2'), empty);
});