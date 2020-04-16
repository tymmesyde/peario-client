import Hls from "hls.js";
import MimeDb from "mime-db";
import axios from "axios";

const hls = new Hls();

const Utils = {

    isVideo(filename) {
        const videoTypes = Object.keys(MimeDb).filter(m => m.startsWith('video') && MimeDb[m].extensions).map(m => MimeDb[m].extensions).flat();
        return videoTypes.find(t => filename.includes(t)) ? true : false;
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

    async loadHls(playlistUrl, videoElement) {
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            console.log("video and hls.js are now bound together !");
            hls.loadSource(playlistUrl);
            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                console.log("manifest loaded, found " + data.levels.length + " quality level");
                console.log(data.levels);
                hls.loadLevel = data.levels.length - 1;
            });
        });
    }

};

export default Utils;