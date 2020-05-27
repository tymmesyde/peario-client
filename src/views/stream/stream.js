import Error from "@/components/Error.vue";
import AddonManager from '@/components/addonManager/AddonManager.vue';
import StremioService from "@/services/stremio.service";
import StorageService from "@/services/storage.service";
import AddonService from "@/services/addon.service";
import WebSocketService from "@/services/ws.service";

export default {
    name: 'Stream',
    components: {
        Error,
        AddonManager
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
        }
    },
    data: () => {
        return {
            meta: {},
            seasons: [],
            selected: {
                season: 0,
                episode: 0
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
            this.loadStreams();
        }
    },
    methods: {
        async loadStreams() {
            const { id, type } = this.meta;
            const installedAddons = StorageService.get('installed') || [];
            const streamCol = AddonService.createStreamCollection(installedAddons);
            const episode = this.currentEpisode();
            this.streams = await AddonService.getStreams(streamCol, type, episode ? episode.id : id);
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
        },
        currentEpisode() {
            return this.meta.videos ? this.meta.videos.find(({ season, episode }) => season === this.selected.season && episode === this.selected.episode) : null;
        },
        filterVideos() {
            return this.meta.videos.filter(({ season }) => season === this.selected.season).sort((a, b) => a.episode - b.episode);
        }
    },
    async mounted() {
        const { type, id } = this.$route.params;

        const parsed = id.split(':');
        const metaId = parsed[0];

        this.meta = type === 'movie' ? await StremioService.getMetaMovie(metaId) : await StremioService.getMetaSeries(metaId);
        if (this.meta.videos) this.parseSeason();
        
        this.selected = {
            season: parsed[1] | 1,
            episode: parsed[2] | 1
        };

        StorageService.watch.subscribe(() => this.loadStreams());
    }
};