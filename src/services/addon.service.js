import AddonClient from "stremio-addon-client";

const AddonService = {

    createStreamCollection(addons) {
        const col = AddonClient.AddonCollection();
        col.load(addons);
        return col.getAddons().filter(({ manifest }) => {
            const { id, idPrefixes, resources, types } = manifest;
            return id !== 'community.peario' && idPrefixes && idPrefixes.includes('tt') && resources.includes('stream') && (types.includes('movie') || types.includes('series'));
        });
    },

    async getStreams(collection, type, id) {
        return (await Promise.all(collection.map(async addon => {
            try {
                const { streams } = await addon.get('stream', type, id);
                const { icon, logo } = addon.manifest;
                return streams.map(s => { s.icon = icon || logo; return s; });
            } catch(e) {
                return [];
            }
        }))).flat();
    }

};

export default AddonService;