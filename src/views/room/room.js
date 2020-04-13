import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Loading from "@/components/Loading.vue";
import Error from "@/components/Error.vue";
import Player from "@/components/player/Player.vue";
import StremioService from "@/services/stremio.service";
import WebSocketService from "@/services/ws.service";
import StorageService from "@/services/storage.service";

export default {
    name: 'Room',
    components: {
        Header,
        Footer,
        Loading,
        Error,
        Player
    },
    data() {
        return {
            blob: null,
            owner: null,
            users: [],
            playerOptions: null,
        }
    },
    computed: {
        player() {
            return this.$store.getters.player;
        },
        user() {
            return StorageService.get('user');
        }
    },
    methods: {
        async syncRoom(room) {            
            const { infoHash, meta, player, owner, users } = room;

            if (!this.owner) this.owner = owner;

            if (!this.playerOptions) {
                const streamUrl = await StremioService.getStreamUrl(infoHash);
                const lang = this.$i18n.locale;
                const subtitles = await StremioService.getSubtitles(streamUrl);
                this.playerOptions = { src: streamUrl, lang, subtitles, meta, isOwner: this.user.id === owner };
            }

            this.users = users;

            if (this.player.autoSync && this.player.video && !this.player.locked) {
                const { paused, buffering, time } = player;

                const unsync = time - this.player.video.currentTime;
                if (unsync > 1 || unsync < -1) {
                    this.player.video.currentTime = time;
                }

                paused ? this.player.video.pause() : this.player.video.play();
                this.player.buffering = buffering;
            }

            this.$forceUpdate();
        },
        syncPlayer() {
            if (this.player.autoSync) {
                const { paused, currentTime } = this.player.video;
                WebSocketService.send('player.sync', { paused, buffering: this.player.buffering, time: currentTime });
            }
        }
    },
    mounted() {
        const { id } = this.$route.params;
        WebSocketService.send('room.join', { id });
        WebSocketService.events.on('sync', this.syncRoom);

        this.interval = setInterval(() => {
            if (this.player.video && !this.player.video.paused) this.syncPlayer();
        }, 1000);
    },
    destroyed() {
        clearInterval(this.interval);
        this.interval = null;
    }
};
