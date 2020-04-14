import axios from "axios";
import { parse } from 'subtitle';

const SubtitleService = {

    list: [],
    defaultLang: String,
    subtitles: null,

    async init({ list, defaultLang }) {
        this.list = list;
        this.defaultLang = defaultLang;

        const found = list.find(({ lang }) => lang.includes(this.defaultLang));
        if (found) {
            const { data } = await axios.get(found.url);
            this.subtitles = parse(data);
        }

        console.log(this.list);
        console.log(this.defaultLang);
        console.log(this.subtitles);
    },

    getCurrent(seconds) {
        const ms = seconds * 1000;
        return this.subtitles.find(({ start, end }) => ms >= start && ms <= end)?.text;
    }

};

export default SubtitleService;