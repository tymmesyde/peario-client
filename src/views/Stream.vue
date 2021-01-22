<template>
    <div class="background">
        <div class="blur"></div>
        <div class="image" :style="{ 'background-image': 'url(' + meta.background + ')' }"></div>
    </div>

    <Meta :value="meta"/>

    <div v-if="meta.type === 'series'">
        <Segments v-model="season" :segments="seasons">
            <template #default="{ item }">
                Season {{ item }}
            </template>
        </Segments>
        <List v-model="episode" :items="episodes" fixed>
            <template #left="{ item }">
                Ep. {{ item.episode }}
            </template>
            <template #right="{ item }">
                {{ item.name }}
            </template>
        </List>
    </div>

    <div>
        <Segments v-model="addon" :segments="addons">
            <template #default="{ item }">
                {{ item.name }}
            </template>
        </Segments>
        <Info icon="sad-outline" v-if="!streams.length || !sharedState.localAddons.length">
            No streams available
        </Info>
        <List :items="streams" @itemclick="createRoom($event)" v-else>
            <template #left="{ item }">
                {{ item.name }}
            </template>
            <template #right="{ item }">
                {{ item.title }}
            </template>
        </List>
    </div>

    <div class="button-container">
        <Button icon="extension-puzzle" large @click="addonsModal = true">Manage Addons</Button>
    </div>

    <AddonsModal v-model="addonsModal"></AddonsModal>
</template>

<script>
import { useRoute } from 'vue-router';
import router from '../router';
import Meta from '../components/Meta';
import Segments from '../components/Segments';
import List from '../components/List';
import AddonsModal from '../components/modals/AddonsModal';
import Info from '../components/Info';
import Button from '../components/Button';
import Stremio from '../services/stremio';
import AddonsService from '../services/addons';
import IpfsService from '../services/ipfs';
import Utils from '../services/utils';

export default {
    name: 'Stream',
    components: {
        Meta,
        Segments,
        List,
        AddonsModal,
        Info,
        Button
    },
    data() {
        return {
            meta: {},
            season: null,
            episode: null,
            addon: null,
            streams: [],
            addonsModal: false,
            sharedState: AddonsService.state
        }
    },
    computed: {
        seasons() {
            return [...new Set(this.meta.videos.map(({ season }) => season))];
        },
        episodes() {
            return this.meta.videos ? this.meta.videos.filter(({ season }) => season === this.season).sort((a, b) => a.episode - b.episode) : [];
        },
        addons() {
            const mapped = this.sharedState.localAddons.map(({ manifest }) => ({ id: manifest.id, name: manifest.name }));
            mapped.unshift({ id: null, name: 'All Streams' });
            return mapped;
        }
    },
    watch: {
        episode({ id }) {
            router.replace({ name: 'stream', params: { type: this.meta.type, imdb_id: id } });
            this.getStreams();
        },
        addon() {
            this.getStreams();
        },
        addons() {
            this.getStreams();
        }
    },
    methods: {
        async init() {
            const { params } = useRoute();
            const { type, imdb_id } = params;

            const { id, season, episode } = Utils.parseImdbId(imdb_id);

            this.meta = await Stremio.getMeta(type, id) || {};
            this.season = season;

            const episodeFromMeta = this.episodes.find(({ episode: ep_id }) => ep_id === episode);
            if (episodeFromMeta) this.episode = episodeFromMeta;
            else this.createTempVideo(imdb_id, season, episode);
        },
        createTempVideo(imdb_id, season, episode) {
            const video = {
                id: imdb_id,
                season,
                episode
            };
            this.meta.videos.push(video);
            this.episode = video;
        },
        async getStreams() {
            this.streams = [];
            this.streams = await AddonsService.getStreams(this.meta.type, this.episode ? this.episode.id : this.meta.id, this.addon ? this.addon.id : null);
        },
        async createRoom(stream) {
            const id = await IpfsService.createRoom(this.meta, stream);
            this.$router.push(`/room/${id}`);
        }
    },
    mounted() {
        this.init();
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.background {
    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    .blur, .image {
        position: absolute;
        height: 100%;
        width: 100%;
    }

    .blur {
        z-index: 1;
        backdrop-filter: blur(100px);
    }

    .image {
        background-size: cover;
    }
}

.button-container {
    position: sticky;
    bottom: 15px;
}
</style>