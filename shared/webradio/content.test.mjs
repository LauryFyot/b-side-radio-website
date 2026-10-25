import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cleanTrackMetadata, normalizeNowPlayingPayload, splitSongText } from './content.js';

test('removes a leading RadioDJ TOPIC marker before splitting artist and title', () => {
  assert.deepEqual(splitSongText('TOPIC - Artist Name - Track Name'), ['Artist Name', 'Track Name']);
  assert.deepEqual(splitSongText('topic - Artist Name - Track Name'), ['Artist Name', 'Track Name']);
  assert.deepEqual(splitSongText('Artist Name - topic - Track Name'), ['Artist Name', 'Track Name']);
  assert.deepEqual(splitSongText('Artist Name - Track Name - Topic'), ['Artist Name', 'Track Name']);
  assert.equal(cleanTrackMetadata('TOPIC - Track Name'), 'Track Name');
});

test('normalizes Icecast and structured now-playing metadata with TOPIC', () => {
  const icecast = normalizeNowPlayingPayload({
    icestats: { source: { listenurl: 'https://radio.example/stream', title: 'TOPIC - Artist Name - Track Name - Remix comment' } },
  });
  assert.equal(icecast.artist, 'Artist Name');
  assert.equal(icecast.title, 'Track Name');
  assert.equal(icecast.comment, 'Remix comment');

  const structured = normalizeNowPlayingPayload({
    now_playing: { song: { text: 'TOPIC - Artist Name - Track Name' } },
  });
  assert.equal(structured.artist, 'Artist Name');
  assert.equal(structured.title, 'Track Name');
});

test('does not remove TOPIC when it is part of an actual song title', () => {
  assert.deepEqual(splitSongText('Artist Name - Topic Song'), ['Artist Name', 'Topic Song']);
  assert.equal(cleanTrackMetadata('Topic Song'), 'Topic Song');
});