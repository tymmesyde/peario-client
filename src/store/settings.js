import StorageService from '@/services/storage.service';
import locales from '../common/locales';

export default {
    namespaced: true,
    state: {
        locale: 'en',
        locales: Object.keys(locales),
        username: null
    },
    mutations: {
        updateLocale(state, value) {
            state.locale = value;
        },
        updateUsername(state, value) {
            state.username = value;
        }
    },
    actions: {
        load({ commit }) {
            const storedLocale = StorageService.get('locale');
            const storedUsername = StorageService.get('username');
            if (storedLocale) commit('updateLocale', storedLocale);
            if (storedUsername) commit('updateUsername', storedUsername);
        },
        updateLocale({ commit }, value) {
            commit('updateLocale', value);
            StorageService.set('locale', value);
        },
        updateUsername({ commit }, value) {
            commit('updateUsername', value);
            StorageService.set('username', value);
        }
    }
};