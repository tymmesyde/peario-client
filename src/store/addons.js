import StremioService from '../services/stremio.service';
import AddonService from '../services/addon.service';
import StorageService from '../services/storage.service';

export default {
    state: {
        collection: {
            streams: [],
            subtitles: []
        },
        installed: [],
        user: []
    },
    getters: {
        collection: state => state.collection,
        installed: state => state.installed,
        installedSubtitles: state => state.collection.subtitles.filter(({ transportUrl }) => state.installed.includes(transportUrl))
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
        addToInstalled(state, addon_id) {
            state.installed = [
                ...state.installed,
                addon_id
            ];
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

            const { streams, subtitles } = AddonService.createCollection(listed);
            const { streams: userStreams, subtitles: userSubtitles } = AddonService.createCollection(user); 
            
            const collection = {
                streams: [
                    ...userStreams,
                    ...streams
                ],
                subtitles: [
                    ...userSubtitles,
                    ...subtitles
                ]
            };

            commit('updateCollection', collection);
            commit('updateUser', user);
            commit('updateInstalled', installed);
        },
        installAddon({ commit }, addon) {
            commit('addToInstalled', addon.transportUrl);
        },
        uninstallAddon({ commit }, addon) {
            commit('removeFromInstalled', addon.transportUrl);
        },
        async addUserAddon({ commit }, addon_url) {
            try {
                let url = addon_url;
                const { hash } = new URL(addon_url);
                if (hash) {
                    const [, encodedAddonUrl] = hash.split('addon=');
                    if (encodedAddonUrl)
                        url = decodeURIComponent(encodedAddonUrl);
                }

                const addon = await AddonService.detectFromURL(url);
                commit('addToUser', addon);
                return Promise.resolve(addon);
            } catch(e) {
                console.error('Failed to parse url');
                return Promise.resolve(false);
            }
        }
    }
};