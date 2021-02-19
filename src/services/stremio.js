import axios from 'axios';

async function _request(method, url) {
    const { data } = await axios({
        method,
        url
    });
    return data;
}

export default {

    async getMeta(type, id) {
        const { meta } = await _request('get', `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`);
        return {
            id,
            imdb_id: id,
            type,
            videos: [],
            ...meta
        };
    },

    getAddons() {
        return _request('get', 'https://api.strem.io/addonscollection.json');
    },

    async createStream(stream) {
        let { infoHash, fileIdx = null } = stream;
        const { files } = await _request('get', `http://localhost:11470/${infoHash}/create`);
        if (!fileIdx) fileIdx = files.indexOf(files.sort((a, b) => a.length - b.length).reverse()[0]);
        return `http://localhost:11470/${infoHash}/${fileIdx}`;
    }

}