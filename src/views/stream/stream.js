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
    data: () => {
        return {
            meta: {},
            streams: []
        }
    },
    methods: {
        async loadStreams() {
            const { id, type } = this.meta;
            const installedAddons = StorageService.get('installed');
            const streamCol = AddonService.createStreamCollection(installedAddons);
            this.streams = await AddonService.getStreams(streamCol, type, id);
            console.log(this.streams);
        },
        createRoom(infoHash) {
            WebSocketService.send('room.new', { infoHash, meta: this.meta });
            WebSocketService.events.on('room', payload => {
                const { id } = payload;
                this.$router.push({ name: 'room', params: { id }})
            });
        }
    },
    async mounted() {
        const { type, id } = this.$route.params;
        this.meta = type === 'movie' ? await StremioService.getMetaMovie(id) : await StremioService.getMetaSeries(id);
        console.log(this.meta);

        this.loadStreams();
        StorageService.watch.subscribe(() => this.loadStreams());
    }
};