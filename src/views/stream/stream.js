import StremioService from "@/services/stremio.service";
import StorageService from "@/services/storage.service";
import AddonService from "@/services/addon.service";
import WebSocketService from "@/services/ws.service";

import Error from "@/components/Error.vue";
import AddonManager from '@/components/addonManager/AddonManager.vue';
import Segments from '@/components/ui/Segments.vue';
import List from '@/components/ui/List.vue';
import Button from '@/components/ui/Button.vue';
import Title from '@/components/ui/Title.vue';

export default {
    name: 'Stream',
    components: {
        Error,
        AddonManager,
        Segments,
        List,
        Button,
        Title
    },
    computed: {
        season() {
            return this.selected.season;
        },
        episode() {
            return this.selected.episode;
        },
        isSeries() {
            return this.meta.type === 'series';
        },
        filterVideos() {
            return this.meta.videos.filter(({ season }) => season === this.selected.season).sort((a, b) => a.episode - b.episode);
        }
    },
    data: () => {
        return {
            meta: {},
            seasons: [],
            selected: {
                season: 1,
                episode: null
            },
            streams: [],
            openAddons: false,
        }
    },
    watch: {
        season() {
            this.loadStreams();
        },
        episode() {
            this.$router.replace({ path: this.selected.episode.id });
            this.loadStreams();
        }
    },
    methods: {
        async loadStreams() {
            const { id, type } = this.$route.params;
            const installedAddons = StorageService.get('installed') || [];
            const streamCol = AddonService.createStreamCollection(installedAddons);
            this.streams = await AddonService.getStreams(streamCol, type, id);
        },
        createRoom(infoHash) {
            WebSocketService.send('room.new', { infoHash, meta: this.meta });
            WebSocketService.events.on('room', payload => {
                const { id } = payload;
                this.$router.push({ name: 'room', params: { id }})
            });
        },
        parseSeason() {
            this.seasons = Array.from(new Set(this.meta.videos.map(({ season }) => season).sort((a, b) => a - b)));
            if (this.seasons.includes(0)) {
                const misc = this.seasons.shift();
                this.seasons.push(misc);
            }
        }
    },
    async mounted() {
        const { type, id } = this.$route.params;

        const parsed = id.split(':');
        const metaId = parsed[0];
        const seasonId = parseInt(parsed[1]);

        this.meta = type === 'movie' ? await StremioService.getMetaMovie(metaId) : await StremioService.getMetaSeries(metaId);

        if (this.meta.videos.length) {
            const episode = this.meta.videos.find(({ id: imdb_id }) => imdb_id === id) || this.meta.videos[0];

            this.selected = {
                season: seasonId || 1,
                episode
            };

            this.parseSeason();
        }

        StorageService.watch.subscribe(() => this.loadStreams());
        this.loadStreams();
    }
};