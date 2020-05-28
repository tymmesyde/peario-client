export default {
    state: {
        player: {
            player: null,
            locked: true,
            buffering: true,
            hideControls: false,
            video: null,
            volume: 0.5,
            autoSync: true,
            fullscreen: false,
        }
    },
    getters: {
        player(state) {
            return state.player;
        }
    },
    mutations: {
        updatePlayer(state, payload) {
            state.player = {
                ...state.player,
                ...payload
            }; 
        }
    },
    actions: {
        updateVideo(context, video) {
            context.commit('updatePlayer', { video });
        },
        updateAutoSync(context, autoSync) {
            context.commit('updatePlayer', { autoSync });
        },
        updateHideState(context, hideControls) {
            context.commit('updatePlayer', { hideControls });
        },
        updateBuffering(context, buffering) {
            context.commit('updatePlayer', { buffering });
        },
        updateLockState(context, locked) {
            context.commit('updatePlayer', { locked });
        }
    }
};