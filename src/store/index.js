import { createStore } from 'vuex';

import player from "./player";
import subtitles from "./subtitles";
import info from "./info";
import addons from "./addons";

export default createStore({
    modules: {
        player,
        subtitles,
        info,
        addons
    }
});