import { fetchWebRadioNowPlaying, getWebRadioNowPlayingUrl, getWebRadioStreamUrl } from '../../../shared/webradio/index.js';

async function main() {
  console.log(`nowplaying url: ${getWebRadioNowPlayingUrl()}`);
  console.log(`stream url: ${getWebRadioStreamUrl()}`);

  const nowPlaying = await fetchWebRadioNowPlaying();
  console.log('normalized nowplaying:');
  console.log(JSON.stringify(nowPlaying, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
