import axios from "axios";
import { parse } from 'subtitle';

const SubtitleService = {

    list: [],
    subtitles: null,

    getCurrent(seconds) {
        if (this.subtitles) {
            const ms = seconds * 1000;
            return this.subtitles.find(({ start, end }) => ms >= start && ms <= end)?.text;
        }
        return null;
    },

    async set(url) {
        const { data } = await axios.get(url);
        this.subtitles = parse(data);
    }

};

export default SubtitleService;