import AddonClient from "stremio-addon-client";

const AddonService = {

    createCollection(addons) {
        const col = AddonClient.AddonCollection();

        addons.map(descriptor => col.add(AddonClient.fromDescriptor(descriptor)));

        return col.getAddons().filter(({ manifest }) => {
            const { id, idPrefixes, resources, types } = manifest;
            return id !== 'community.peario' && (idPrefixes && idPrefixes.includes('tt') && resources && resources.includes('stream') && (types.includes('movie') || types.includes('series')) || resources.find(({ name, idPrefixes, types }) => name === 'stream' && idPrefixes && idPrefixes.includes('tt') && types && (types.includes('movie') || types.includes('series'))));
        });
    },

    async detectFromURL(url) {
        const { addon } = await AddonClient.detectFromURL(url);
        return addon;
    },

    async getStreams(collection, type, id) {
        return (await Promise.all(collection.map(async addon => {
            try {
                const { streams } = await addon.get('stream', type, id);
                const { icon, logo } = addon.manifest;
                return streams.map(s => { s.icon = icon || logo; return s; });
            } catch (e) {
                return [];
            }
        }))).flat();
    }

};

export default AddonService;