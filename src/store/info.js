export default {
    namespaced: true,
    state: {
        appVersion: process.env.PACKAGE_VERSION || '0',
        isStremioRunning: true
    },
    mutations: {
        updateStremioStatus(state, value) {
            state.isStremioRunning = value;
        }
    }
};