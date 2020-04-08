export default {
    state: {
        player: {
            player: null,
            locked: true,
            buffering: true,
            hide: false,
            video: null,
            volume: 0.5,
            volumeTmp: 0,
            autoSync: true,
            timebar: 0,
            timer: '0:00',
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
        updateHideState(context, hide) {
            context.commit('updatePlayer', { hide });
        },
        updateBuffering(context, buffering) {
            context.commit('updateBuffering', { buffering });
        }
    }
};