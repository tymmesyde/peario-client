import Hls from "hls.js";
import MimeDb from "mime-db";
import { HLS_PLAYLIST } from "@/common/config";

const hls = new Hls();

const Utils = {

    isVideo(filename) {
        const videoTypes = Object.keys(MimeDb).filter(m => m.startsWith('video') && MimeDb[m].extensions).map(m => MimeDb[m].extensions).flat();
        return videoTypes.find(t => filename.includes(t)) ? true : false;
    },

    loadHls(streamFile, videoElement) {
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            console.log("video and hls.js are now bound together !");
            hls.loadSource(`${streamFile}/${HLS_PLAYLIST}`);
            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                console.log("manifest loaded, found " + data.levels.length + " quality level");
            });
        });
    }

};

export default Utils;