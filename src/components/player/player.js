import Subtitle from "@/components/Subtitle.vue";

export default {
    name: 'Player',
    components: {
        Subtitle
    },
    props: {
        options: {
            src: String,
            lang: String,
            subtitles: [],
            meta: {
                logo: String,
                background: String,
            },
            isOwner: Boolean
        }
    },
    computed: {
        subsLangs() {
            return this.options.subtitles.map(({ lang }) => lang).filter((el, i, self) => i == self.indexOf(el)).sort();
        }
    },
    data() {
        return {
            toggleSub: true,
            toggleSubPanel: false,
            currentSub: null,
            subPanelLang: null,
            volumeTmp: 0,
            timebar: 0,
            timer: '0:00',
            ...this.$store.getters.player
        };
    },
    methods: {
        filterSubs(lang) {
            return this.options.subtitles.filter(s => s.lang === lang);
        },
        unlockPlayer() {
            const canPlay = this.video.play();
            canPlay.catch(() => {});
            this.video.pause();
            this.locked = false;
        },
        togglePlay() {
            if ((!this.options.isOwner && !this.autoSync) || this.options.isOwner) {
                this.video.paused ? this.video.play() : this.video.pause();
                this.video.paused ? this.hide = false : this.hide = true;
                
                this.disptach();
                this.$emit('paused');
                this.$forceUpdate();
            }
        },
        toggleAutoSync() {
            this.autoSync = !this.autoSync;
            this.disptach();
        },
        async toggleFullscreen() {
            if (!this.fullscreen) {
                await this.player.requestFullscreen();
                this.fullscreen = true;
            } else {
                await document.exitFullscreen();
                this.fullscreen = false;
            }
        },
        updateVolume(event) {
            let volume = this.video.volume;
            volume = (event.deltaY < 0 ? volume += 0.1 : volume -= 0.1).toFixed(1);
            this.volume = volume >= 0 && volume <= 1 ? volume : this.video.volume;
            this.video.volume = this.volume;
        },
        toggleVolume() {
            if (this.video.volume) {
                this.volumeTmp = this.volume;
                this.volume = 0;
            } else {
                this.volume = this.volumeTmp;
            }

            this.video.volume = this.volume;
        },
        seek(event) {
            if ((!this.options.isOwner && !this.autoSync) || this.options.isOwner) {
                this.video.currentTime = event.target.value * this.video.duration / 10000;
            }
        },
        onTimeUpdate() {
            const { currentTime, duration } = this.video;
            
            const date = new Date(currentTime * 1000);
            const sec = date.getUTCSeconds();
            const min = date.getUTCMinutes();
            const hours = date.getUTCHours();
            
            this.timebar = Number(((currentTime * 10000 / duration) || 0).toFixed());
            this.timer = `${hours > 0 ? hours + ':' : ''}${hours && min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
        },
        disptach() {
            this.$store.dispatch('updateVideo', this.video);
            this.$store.dispatch('updateHideState', this.hide);
            this.$store.dispatch('updateAutoSync', this.autoSync);
            this.$store.dispatch('updateBuffering', this.buffering);
            this.$store.dispatch('updateLockState', this.locked);
        }
    },
    mounted() {
        this.player = this.$refs.player;
        this.video = this.$refs.video;
        this.video.volume = this.volume;

        this.currentSub = this.options.subtitles.find(s => s.lang.includes(this.options.lang));
        this.subPanelLang = this.currentSub.lang;

        this.disptach();

        let hideTimeout = null;
        this.player.onmousemove = () => {
            clearTimeout(hideTimeout);
            this.hide = false;
            this.disptach();

            if (!this.video.paused) hideTimeout = setTimeout(() => {
                this.hide = true;
                this.disptach();
            }, 3000);
        };

        this.video.onwaiting = () => {
            console.log('WAITING');
            this.buffering = true;
        };
        this.video.onloadeddata = () => {
            console.log('LOADEDDATA');
            this.buffering = false;
        };
        this.video.oncanplay = () => {
            console.log('CANPLAY');
            this.buffering = false;
        };

        document.addEventListener('keyup', ({ keyCode }) => {
            if (keyCode === 32) this.togglePlay();
        });

        document.addEventListener('fullscreenchange', () => {
            if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) this.fullscreen = false;
        });
    },
    destroyed() {
        this.video.src = null;
    }
}