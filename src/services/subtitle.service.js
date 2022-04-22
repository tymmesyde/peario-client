import axios from "axios";
import { parseSync } from "subtitle";

const SubtitleService = {
  subtitles: null,

  getCurrent(seconds) {
    if (this.subtitles) {
      const ms = seconds * 1000;
      const line = this.subtitles.find(
        ({ data }) => ms >= data.start && ms <= data.end
      );
      return line ? line.data.text : "";
    }
    return null;
  },

  async set(url) {
    try {
      const { data } = await axios.get(url);
      if (!Object.keys(data).length) return Promise.reject();

      this.subtitles = parseSync(data);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },

  setCustom(data) {
    this.subtitles = parseSync(data);
  },
};

export default SubtitleService;
