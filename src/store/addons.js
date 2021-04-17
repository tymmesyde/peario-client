import StremioService from '../services/stremio.service';
import AddonService from '../services/addon.service';
import StorageService from '../services/storage.service';

export default {
    state: {
        collection: [],
        installed: [],
        user: []
    },
    getters: {
        collection: state => state.collection,
        installed: state => state.installed
    },
    mutations: {
        updateCollection(state, addons) {
            state.collection = addons;
        },
        updateInstalled(state, addons) {
            state.installed = addons;
            StorageService.set('addons.installed', state.installed);
        },
        updateUser(state, addons) {
            state.user = addons;
            StorageService.set('addons.user', state.user);
        },
        addToCollection(state, addon) {
            state.collection.push(addon);
        },
        addToInstalled(state, addon_id) {
            state.installed.push(addon_id);
            StorageService.set('addons.installed', state.installed);
        },
        addToUser(state, addon) {
            state.user.push(addon);
            StorageService.set('addons.user', state.user);
        },
        removeFromInstalled(state, addon_id) {
            state.installed = state.installed.filter(id => id !== addon_id);
            StorageService.set('addons.installed', state.installed);
        }
    },
    actions: {
        async loadAddons({ commit }) {
            const listed = await StremioService.getAddons();
            const user = StorageService.get('addons.user') || [];
            const installed = StorageService.get('addons.installed') || [];
            
            const collection = [
                ...AddonService.createCollection(listed),
                ...AddonService.createCollection(user)
            ];

            commit('updateCollection', collection);
            commit('updateUser', user);
            commit('updateInstalled', installed);
        },
        installAddon({ commit }, addon) {
            commit('addToInstalled', addon.manifest.id);
        },
        uninstallAddon({ commit }, addon) {
            commit('removeFromInstalled', addon.manifest.id);
        },
        async addUserAddon({ commit }, addon_url) {
            const addon = await AddonService.detectFromURL(addon_url);
            commit('addToUser', addon);
        }
    }
};