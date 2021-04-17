import Vue from "vue";
import Vuex from "vuex";

import player from "./player";
import subtitles from "./subtitles";
import info from "./info";
import addons from "./addons";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        player,
        subtitles,
        info,
        addons
    }
});