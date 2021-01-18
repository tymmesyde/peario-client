export default {

    parseImdbId(imdb_id) {
        const parsed = imdb_id.split(':');

        return {
            id: parsed[0],
            season: parseInt(parsed[1]) || 1,
            episode: parseInt(parsed[2]) || 1
        };
    }

};