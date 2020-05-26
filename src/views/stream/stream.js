import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Error from "@/components/Error.vue";
import AddonManager from '@/components/addonManager/AddonManager.vue';
import StremioService from "@/services/stremio.service";
import StorageService from "@/services/storage.service";
import AddonService from "@/services/addon.service";
import WebSocketService from "@/services/ws.service";

export default {
    name: 'Stream',
    components: {
        Header,
        Footer,
        Error,
        AddonManager
    },
    computed: {
        season() {
            return this.selected.season;
        },
        episode() {
            return this.selected.episode;
        }
    },
    data: () => {
        return {
            meta: {},
            seasons: [],
            selected: {
                season: 1,
                episode: 1
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
        }
    },
    async mounted() {
        const { type, id } = this.$route.params;

        this.meta = type === 'movie' ? await StremioService.getMetaMovie(id) : await StremioService.getMetaSeries(id);
        if (this.meta.videos) this.parseSeason();
        this.loadStreams();

        StorageService.watch.subscribe(() => this.loadStreams());
    }
};