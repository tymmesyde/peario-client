import axios from "axios";
import { parseSync } from 'subtitle';

const SubtitleService = {
    
    subtitles: null,

    getCurrent(seconds) {
        if (this.subtitles) {
            const ms = seconds * 1000;
            const line = this.subtitles.find(({ data }) => ms >= data.start && ms <= data.end);
            return line ? line.data.text : '';
        }
        return null;
    },

    async set(url) {
        const { data } = await axios.get(url);
        this.subtitles = parseSync(data);
    },

    setCustom(data) {
        this.subtitles = parseSync(data);
    }

};

export default SubtitleService;