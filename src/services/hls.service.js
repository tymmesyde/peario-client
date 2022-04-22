import Hls from "hls.js";
import axios from "axios";

const HlsService = {
  hls: null,

  init() {
    this.hls = new Hls({
      startLevel: 0,
      abrMaxWithRealBitrate: true,
    });
  },

  async createPlaylist(videoUrl) {
    const prefix = "stream-q-";
    const qualities = [
      {
        name: 320,
        bandwith: 500000,
      },
      {
        name: 480,
        bandwith: 800000,
      },
      {
        name: 720,
        bandwith: 1000000,
      },
    ];

    const playlistLevels = (
      await Promise.all(
        qualities.map(async ({ name, bandwith }) => {
          try {
            const streamQ = `${videoUrl}/${prefix}${name}.m3u8`;
            await axios.get(streamQ);
            return `#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=${bandwith},NAME="${name}"\n${streamQ}`;
          } catch (e) {
            return null;
          }
        })
      )
    ).filter((level) => level);

    if (!playlistLevels.length) return null;

    const playlistHeader = "#EXTM3U\n#EXT-X-VERSION:4\n";
    const playlist = playlistHeader.concat(playlistLevels.join("\n"));
    return URL.createObjectURL(
      new Blob([Buffer.from(playlist)], { type: "application/x-mpegURL" })
    );
  },

  loadHls(playlistUrl, videoElement) {
    return new Promise((resolve) => {
      this.hls.loadSource(playlistUrl);
      this.hls.attachMedia(videoElement);
      this.hls.on(Hls.Events.MEDIA_ATTACHED, resolve());
    });
  },

  clear() {
    this.hls.detachMedia();
    this.hls.destroy();
  },
};

export default HlsService;
