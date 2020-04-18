import Hls from "hls.js";
import axios from "axios";

const HlsService = {

    hls: null,

    init() {
        this.hls = new Hls();
    },

    async createPlaylist(videoUrl) {
        const prefix = "stream-q-";
        const qualities = [{
            name: 320,
            bandwith: 460560
        }, {
            name: 480,
            bandwith: 836280
        }, {
            name: 720,
            bandwith: 2149280
        }];

        const playlistLevels = []; 
        await Promise.all(qualities.map(async ({ name, bandwith}) => {
            try {
                const streamQ = `${videoUrl}/${prefix}${name}.m3u8`;
                await axios.get(streamQ);
                playlistLevels.push(`#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=${bandwith},NAME="${name}"\n${streamQ}`);
            } catch(e) {
                return;
            }
        }));

        const playlistHeader = '#EXTM3U\n#EXT-X-VERSION:4\n';
        const playlist = playlistHeader.concat(playlistLevels.join('\n'));
        return URL.createObjectURL(new Blob([Buffer.from(playlist)], { type: 'application/x-mpegURL' }));
    },

    loadHls(playlistUrl, videoElement) {
        this.hls.loadSource(playlistUrl);
        this.hls.attachMedia(videoElement);
        this.hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
            console.log(`Hls: Switched to ${data.level}`);
        });
    },

    clear() {
        this.hls.detachMedia();
        this.hls.destroy();
    }

};

export default HlsService;