export default {
    namespaced: true,
    state: {
        video: null,
        paused: true,
        currentTime: 0,
        locked: true,
        controlsHidden: false,
        buffering: true,
        volume: 0.5,
        autoSync: true
    },
    getters: {
        video(state) {
            return state.video;
        },
        paused(state) {
            return state.paused;
        },
        currentTime(state) {
            return state.currentTime;
        },
        locked(state) {
            return state.locked;
        },
        controlsHidden(state) {
            return state.controlsHidden;
        },
        buffering(state) {
            return state.buffering;
        },
        volume(state) {
            return state.volume;
        },
        autoSync(state) {
            return state.autoSync;
        }
    },
    mutations: {
        updateVideo(state, value) {
            state.video = value;
        },
        updatePaused(state, value) {
            state.paused = value;
        },
        updateCurrentTime(state, value) {
            state.currentTime = value;
        },
        updateVideoSrc(state, value) {
            state.video.src = value;
        },
        updateVideoCurrentTime(state, value) {
            state.video.currentTime = value;
        },
        updateAutoSync(state, value) {
            state.autoSync = value;
        },
        updateLockState(state, value) {
            state.locked = value;
        },
        updateHideState(state, value) {
            state.controlsHidden = value;
        },
        updateBuffering(state, value) {
            state.buffering = value;
        },
        updateVolume(state, value) {
            state.volume = value;
        }
    },
    actions: {
        setCurrentTime(context, time) {
            context.commit('updateCurrentTime', time);
            context.commit('updateVideoCurrentTime', time);
        }
    }
};