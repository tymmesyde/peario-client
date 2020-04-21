export default {
    state: {
        subtitles: {
            active: null,
            activePanel: null,
            current: null,
            list: [],
            langs: [],
            panelLang: null,
            size: null,
        }
    },
    getters: {
        subtitles(state) {
            return state.subtitles;
        }
    },
    mutations: {
        updateSubtitles(state, payload) {
            state.subtitles = {
                ...state.subtitles,
                ...payload
            }; 
        }
    },
    actions: {
        updateList(context, list) {
            context.commit('updateSubtitles', { list });
        },
        updateLangs(context, langs) {
            context.commit('updateSubtitles', { langs });
        },
        updateActive(context, active) {
            context.commit('updateSubtitles', { active });
        },
        updateCurrent(context, current) {
            context.commit('updateSubtitles', { current });
        },
        updateSize(context, size) {
            context.commit('updateSubtitles', { size });
        },
    }
};