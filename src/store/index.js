import { createStore } from "vuex";

import player from "./player";
import subtitles from "./subtitles";
import info from "./info";
import addons from "./addons";
import client from "./client";
import settings from "./settings";

export default createStore({
  modules: {
    player,
    subtitles,
    info,
    addons,
    client,
    settings,
  },
});
