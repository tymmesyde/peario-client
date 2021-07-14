import StorageService from '@/services/storage.service';
import locales from '../common/locales';

export default {
    namespaced: true,
    state: {
        locale: 'en',
        locales: Object.keys(locales)
    },
    mutations: {
        updateLocale(state, value) {
            state.locale = value;
        }
    },
    actions: {
        load({ commit }) {
            const storedLocale = StorageService.get('locale');
            if (storedLocale) commit('updateLocale', storedLocale);
        },
        updateLocale({ commit }, value) {
            commit('updateLocale', value);
            StorageService.set('locale', value);
        }
    }
};