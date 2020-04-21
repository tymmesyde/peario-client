import Vue from "vue";
import Vuex from "vuex";

import player from "./player";
import subtitles from "./subtitles";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        player,
        subtitles
    }
});