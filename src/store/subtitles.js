export default {
    state: {
        subtitles: {
            active: true,
            current: null,
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