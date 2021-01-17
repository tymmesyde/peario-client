export default {

    parseImdbId(id) {
        const parsed = id.split(':');

        return {
            imdb_id: parsed[0],
            season: parseInt(parsed[1]) || 1,
            episode: parseInt(parsed[2]) || 1
        };
    }

};