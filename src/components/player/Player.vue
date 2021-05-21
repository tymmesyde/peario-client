<template>
    <div class="player" ref="player" :class="{ 'hideControls': hideControls }" @mousemove="showControls()" @touchmove="showControls()" @dragover="dropSubtitles($event)" @drop="dropSubtitles($event)">
        <div class="locked" v-if="locked">
            <div>
                <img v-if="options.meta.logo" :src="options.meta.logo" :alt="options.meta.name">
                <Button icon="checkmark-outline" translate="components.player.ready" @click="unlockPlayer()"/>
            </div>

            <div class="share" v-if="options.isOwner">
                <p>{{ $t(`components.player.share`) }}</p>
                <TextInput :value="shareUrl" @click="copyShareUrl()"/>
            </div>
        </div>

        <div class="buffering" v-if="!locked && !video.paused && buffering">
            <div>
                <ion-icon name="sync-outline" class="spin"></ion-icon>
            </div>
        </div>

        <Subtitle v-if="video" :timecode="video.currentTime"></Subtitle>

        <video ref="video" :src="options.src" :poster="options.meta.background" @click="showControls()" @dblclick="toggleFullscreen()" @timeupdate="onTimeUpdate()" @mousewheel="updateVolume($event)"></video>

        <div class="controls" v-if="!locked && video">
            <div class="panel">
                <div class="play-pause control" @click="togglePlay()" :class="{ 'disabled': autoSync && !options.isOwner }">
                    <ion-icon name="play-outline" v-show="video.paused"></ion-icon>
                    <ion-icon name="pause-outline" v-show="!video.paused"></ion-icon>
                </div>

                <div class="timer control">
                    {{ timer }}
                </div>
            </div>

            <div class="panel stretch">
                 <div class="auto-sync" @click="toggleAutoSync()">
                    <ion-icon name="toggle-outline" class="flip" v-show="!autoSync"></ion-icon>
                    <ion-icon name="toggle" v-show="autoSync"></ion-icon>
                    {{ $t(`components.player.autoSync`) }}
                </div>

                <div class="time-bar control">
                    <RangeInput v-model="timebar" max="10000" step="1" :disabled="(autoSync && !options.isOwner) || !video.duration" @seek="seek($event)"></RangeInput>
                </div>
            </div>

            <div class="panel">
                <div class="volume control">
                    <RangeInput class="volume-bar" v-model="volume" @seek="video.volume = volume"></RangeInput>
                    <span class="icon" @click="toggleVolume()">
                        <ion-icon name="volume-mute-outline" v-show="video.volume === 0"></ion-icon>
                        <ion-icon name="volume-off-outline" v-show="video.volume > 0 && video.volume <= 0.2"></ion-icon>
                        <ion-icon name="volume-low-outline" v-show="video.volume > 0.2 && video.volume < 0.5"></ion-icon>
                        <ion-icon name="volume-medium-outline" v-show="video.volume >= 0.5 && video.volume < 0.8"></ion-icon>
                        <ion-icon name="volume-high-outline" v-show="video.volume >= 0.8"></ion-icon>
                    </span>
                </div>

                <SubtitlesControl :videoUrl="options.src" :userSubtitle="userSubtitle" class="control"></SubtitlesControl>

                <div class="hls control" @click="toggleHls()">
                    <ion-icon name="color-wand-outline" v-show="!isHls"></ion-icon>
                    <ion-icon name="color-wand" v-show="isHls"></ion-icon>
                </div>

                <div class="fullscreen control" @click="toggleFullscreen()">
                    <ion-icon name="expand-outline" v-show="!fullscreen"></ion-icon>
                    <ion-icon name="contract-outline" v-show="fullscreen"></ion-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
            navigator.clipboard.writeText(this.shareUrl);
            this.$toast.success(this.$t('toasts.clipboard'));
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
            this.isHls ? this.$toast.success(this.$t('toasts.hlsStream')) : this.$toast.success(this.$t('toasts.sourceStream'));
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
    unmounted() {
        HlsService.clear();
    }
}
</script>

<style lang="scss" scoped>
$overlay-background-color: rgba(0, 0, 0, 0.5);

.player {
    position: relative;
    font-family: 'Montserrat';
    height: 100%;
    width: 100%;
    overflow: hidden;

    &.hideControls {
        cursor: none;

        .controls {
            opacity: 0;
            visibility: hidden;
        }
    }

    .locked {
        z-index: 98;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.8);

        img {
            width: 65%;
            margin-bottom: 2vh;
            font-size: 9vh;
            font-weight: 500;
        }

        button {
            display: block;
            margin: auto;
        }

        .share {
            position: absolute;
            width: 100%;
            bottom: 7vh;

            input {
                width: 50vh;
                margin-top: 1vh;
                cursor: pointer;
            }
        }
    }

    .buffering {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: $overlay-background-color;

        ion-icon {
            font-size: 7vh;
        }
    }

    video {
        height: 100%;
        width: 100%;
        outline: none;
        align-self: center;
    }

    .controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 1vw;
        user-select: none;
        opacity: 1;
        transition: all 0.2s ease-in;
        background-color: $overlay-background-color;
        box-shadow: 0px -40px 100px 60px $overlay-background-color;

        .auto-sync {
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 6vw;
            left: 2.5vw;
            padding: 10px 0;
            font-size: 20px;

            ion-icon {
                margin-right: 10px;
            }
        }

        .panel {
            display: flex;
            align-items: center;

            &.stretch {
                width: 100%;

                .control {
                    display: flex;
                    width: 100%;
                }
            }
        }

        .control {
            position: relative;
            padding: 1.5vw 1vw;
            font-size: 30px;
            line-height: 29px;
            cursor: pointer;
        }

        .play-pause {
            font-size: 55px;

            &.disabled {
                user-select: none;
                opacity: 0.3;
            }
        }

        .timer {
            width: 82px;
            padding: 0;
            font-size: 20px;
            text-align: center;
        }

        .volume {
            display: flex;
            justify-content: center;

            input {
                position: absolute;
                top: -70px;
                width: 120px;
                transform: rotate(-90deg);
                transform-origin: center;
                opacity: 0;
            }

            &:hover {
                input {
                    opacity: 1;
                }
            }
        }

        .time-bar {
            input {
                width: 100%;
            }
        }
    }
}

@media only screen and (max-width: 768px) {
    .panel.stretch {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 70px;
        padding: 0 10px;
    }
}
</style>