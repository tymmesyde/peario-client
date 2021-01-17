import { reactive } from 'vue';
import AddonClient from 'stremio-addon-client';
import Stremio from './stremio';

export default {

    state: reactive({
        addons: [],
        localAddons: []
    }),

    async init() {
        const col = AddonClient.AddonCollection();
        col.load(await Stremio.getAddons());
        this.state.addons = col.getAddons().filter(({ manifest }) => {
            const { id, idPrefixes, resources, types } = manifest;
            return id !== 'community.peario' && (resources.find(({ idPrefixes, name, types }) => (idPrefixes && idPrefixes.includes('tt')) && name === 'stream' && (types.includes('movie') || types.includes('series'))) || (idPrefixes && idPrefixes.includes('tt')) && resources.includes('stream') && (types.includes('movie') || types.includes('series')));
        });

        const localAddons = localStorage.getItem('addons');
        if (localAddons) {
            const parsedIds = JSON.parse(localAddons);
            this.state.localAddons = this.state.addons.filter(({ manifest }) => parsedIds.includes(manifest.id));
        }
    },

    async getStreams(type, id, addon_id) {
        return (await Promise.all(
            this.state.localAddons
                .filter(({ manifest }) => addon_id ? manifest.id === addon_id : true)
                .map(async addon => {
                    try {
                        const { streams } = await addon.get('stream', type, id);
                        return streams || [];
                    } catch (e) {
                        return [];
                    }
                })
        )).flat();
    },

    toggleInstall(addon) {
        const index = this.state.localAddons.indexOf(addon);
        if (index > -1) this.state.localAddons.splice(index, 1);
        else this.state.localAddons.push(addon);

        localStorage.setItem('addons', JSON.stringify(this.state.localAddons.map(({ manifest }) => manifest.id)));
    }

}