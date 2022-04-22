import axios from "axios";
import {
  CINEMETA_URL,
  OPENSUBTITLES_URL,
  STREMIO_API_URL,
  STREMIO_STREAMING_SERVER,
} from "@/common/config";

const StremioService = {
  async isServerOpen() {
    try {
      await axios.get(`${STREMIO_STREAMING_SERVER}/stats.json`);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.resolve(false);
    }
  },

  async getMetaSeries(imdbId) {
    const { data } = await axios.get(
      `${CINEMETA_URL}/meta/series/${imdbId}.json`
    );
    return data.meta;
  },

  async getMetaMovie(imdbId) {
    const { data } = await axios.get(
      `${CINEMETA_URL}/meta/movie/${imdbId}.json`
    );
    return data.meta;
  },

  async searchMovies(title) {
    const { data } = await axios.get(
      `${CINEMETA_URL}/catalog/movie/top/search=${title}.json`
    );
    return data.metas;
  },

  async searchSeries(title) {
    const { data } = await axios.get(
      `${CINEMETA_URL}/catalog/series/top/search=${title}.json`
    );
    return data.metas;
  },

  async getAddons() {
    const { data } = await axios.get(
      `${STREMIO_API_URL}/addonscollection.json`
    );
    return data;
  },

  async createStream(stream) {
    let { infoHash, fileIdx = null } = stream;
    const { data } = await axios.get(
      `${STREMIO_STREAMING_SERVER}/${infoHash}/create`
    );
    const { files } = data;
    if (!fileIdx)
      fileIdx = files.indexOf(
        files.sort((a, b) => a.length - b.length).reverse()[0]
      );
    return `${STREMIO_STREAMING_SERVER}/${infoHash}/${fileIdx}`;
  },

  async getStats(streamUrl) {
    const { data } = await axios.get(`${streamUrl}/stats.json`);
    console.log(data);

    return data;
  },

  async getSubtitles(streamUrl) {
    try {
      const { hash, size } = await getOpenSubInfo(streamUrl);

      const jsonrpc = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "subtitles.find",
        params: [
          null,
          {
            query: {
              videoHash: hash,
              videoSize: size,
            },
          },
        ],
      });

      return queryOpenSubtitles(jsonrpc);
    } catch (_) {
      return [];
    }
  },
};

async function getOpenSubInfo(streamUrl) {
  const { data } = await axios.get(
    `${STREMIO_STREAMING_SERVER}/opensubHash?videoUrl=${streamUrl}`
  );
  const { result } = data;
  return result;
}

async function queryOpenSubtitles(jsonrpc) {
  const { data } = await axios.get(
    `${OPENSUBTITLES_URL}/q.json?b=${btoa(jsonrpc)}`
  );
  const { result } = data;
  return result.all;
}

export default StremioService;
