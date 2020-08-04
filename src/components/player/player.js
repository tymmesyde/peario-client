import Button from "@/components/ui/Button.vue";
import TextInput from "@/components/ui/TextInput.vue";
import RangeInput from "@/components/ui/RangeInput.vue";
import Subtitle from "@/components/Subtitle.vue";
import SubtitlesControl from "./controls/SubtitlesControl.vue";

import HlsService from "@/services/hls.service";

export default {
    name: 'Player',
    components: {
        Button,
        TextInput,
        RangeInput,
        Subtitle,
        SubtitlesControl
    },
    props: {
        options: {
            src: String,
            meta: {
                logo: String,
                background: String,
            },
            isOwner: Boolean
        }
    },
    computed: {
        shareUrl() {
            return window.location.href;
        }
    },
    data() {
        return {
            hideTimeout: null,
            userSubtitle: null,
            volumeTmp: 0,
            timebar: 0,
            timer: '0:00',
            ...this.$store.getters.player
        };
    },
    methods: {
        copyShareUrl() {
            this.$copyText(this.shareUrl);
            this.$toasted.global.clipboard();
        },
        unlockPlayer() {
            const canPlay = this.video.play();
            canPlay.catch(() => {});
            this.video.pause();
            this.locked = false;
            this.disptachAll();
        },
        showControls() {
            clearTimeout(this.hideTimeout);
            this.hideControls = false;
            this.disptachAll();

            this.hideTimeout = setTimeout(() => {
                if (!this.video.paused && !this.hideControls) {
                    this.hideControls = true;
                    this.disptachAll();
                }
            }, 3000);
        },
        togglePlay() {
            if ((!this.options.isOwner && !this.autoSync) || this.options.isOwner) {
                this.video.paused ? this.video.play() : this.video.pause();
                this.hideControls = !this.video.paused;
                
                this.disptachAll();
                this.$emit('paused');
                this.$forceUpdate();
            }
        },
        toggleAutoSync() {
            this.autoSync = !this.autoSync;
            this.disptachAll();
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
        seek(value) {
            if ((!this.options.isOwner && !this.autoSync) || this.options.isOwner) {
                this.video.currentTime = value * this.video.duration / 10000;
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
        dropSubtitles(event) {
            event.preventDefault();

            const { files } = event.dataTransfer;
            if (files.length) {
                const file = files[0];
                if (file.name.endsWith('.srt')) this.userSubtitle = file;
            }
        },
        disptachAll() {
            this.$store.dispatch('updateVideo', this.video);
            this.$store.dispatch('updateHideState', this.hideControls);
            this.$store.dispatch('updateAutoSync', this.autoSync);
            this.$store.dispatch('updateBuffering', this.buffering);
            this.$store.dispatch('updateLockState', this.locked);
        },
        async toggleHls() {
            const currentTime = this.video.currentTime;
            const wasPlaying = !this.video.paused;

            if (!this.isHls) await HlsService.loadHls(this.options.hls, this.video);
            else this.video.src = this.options.src;
            this.isHls = !this.isHls;

            this.video.currentTime = currentTime;
            if (wasPlaying) this.video.play();
        }
    },
    mounted() {
        HlsService.init();

        this.player = this.$refs.player;
        this.video = this.$refs.video;
        this.video.volume = this.volume;

        this.disptachAll();

        this.player.onmouseleave = () => {
            if (!this.video.paused) {
                clearTimeout(this.hideTimeout);
                this.hideControls = true;
                this.disptachAll();
            }
        }

        this.video.onerror = () => this.toggleHls();

        this.video.onwaiting = () => {
            this.buffering = true;
            this.disptachAll();
        };
        this.video.onloadeddata = () => {
            this.buffering = false;
            this.disptachAll();
        };
        this.video.oncanplay = () => {
            this.buffering = false;
            this.disptachAll();
        };

        document.addEventListener('keyup', ({ keyCode }) => {
            if (keyCode === 32) this.togglePlay();
        });

        document.addEventListener('fullscreenchange', () => {
            if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) this.fullscreen = false;
        });
    },
    destroyed() {
        HlsService.clear();
    }
}