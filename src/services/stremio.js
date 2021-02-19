import axios from 'axios';

async function _request(method, url, body = {}) {
    const { data } = await axios({
        method,
        url,
        data: body
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
        let { infoHash, sources, fileIdx = null } = stream;
        const options = {
            peerSearch: {
                max: 150,
                min: 40,
                sources
            },
            torrent: {
                infoHash
            }
        };
        const { files } = await _request('post', `http://localhost:11470/${infoHash}/create`, options);
        if (!fileIdx) fileIdx = files.indexOf(files.sort((a, b) => a.length - b.length).reverse()[0]);
        return `http://localhost:11470/${infoHash}/${fileIdx}`;
    }

}