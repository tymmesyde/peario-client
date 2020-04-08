<template>
    <div class="player" ref="player" v-bind:class="{ 'hide': hide }" @mousewheel="updateVolume($event)">
        <div class="locked" v-if="locked">
            <div>
                <img v-if="options.meta.logo" :src="options.meta.logo" :alt="options.meta.name">
                <button @click="unlockPlayer()"><ion-icon name="checkmark-outline"></ion-icon> READY</button>
            </div>
        </div>

        <div class="buffering" v-if="!locked && !video.paused && buffering">
            <div>
                <ion-icon name="sync-outline" class="spin"></ion-icon>
            </div>
        </div>

        <video ref="video" :poster="options.meta.background" @click="togglePlay()" @timeupdate="onTimeUpdate()"></video>
        
        <div class="controls" v-if="!locked && video">
            <div class="auto-sync" @click="toggleAutoSync()">
                <ion-icon name="toggle-outline" class="flip" v-show="!autoSync"></ion-icon>
                <ion-icon name="toggle" v-show="autoSync"></ion-icon>
                Auto-Sync
            </div>

            <div class="control" @click="togglePlay()">
                <ion-icon name="play-outline" v-show="video.paused"></ion-icon>
                <ion-icon name="pause-outline" v-show="!video.paused"></ion-icon>
            </div>
            <div class="volume">
                <input class="volume-bar" type="range" min="0" max="1" step="0.1" v-model="volume" @input="video.volume = volume">
                <span class="icon" @click="toggleVolume()">
                    <ion-icon name="volume-mute-outline" v-show="video.volume === 0"></ion-icon>
                    <ion-icon name="volume-off-outline" v-show="video.volume > 0 && video.volume <= 0.2"></ion-icon>
                    <ion-icon name="volume-low-outline" v-show="video.volume > 0.2 && video.volume < 0.5"></ion-icon>
                    <ion-icon name="volume-medium-outline" v-show="video.volume >= 0.5 && video.volume < 0.8"></ion-icon>
                    <ion-icon name="volume-high-outline" v-show="video.volume >= 0.8"></ion-icon>
                </span>
            </div>
            <input class="time-bar" type="range" min="0" max="10000" v-bind:value="timebar" @input="seek($event)">
            <div class="timer">
                {{ timer }}
            </div>
            <div class="fullscreen" @click="toggleFullscreen()">
                <ion-icon name="expand-outline" v-show="!fullscreen"></ion-icon>
                <ion-icon name="contract-outline" v-show="fullscreen"></ion-icon>
            </div>
        </div>
    </div>
</template>

<script>
import UtilsService from "@/services/utils.service";

export default {
    name: 'Player',
    props: {
        options: {
            src: String,
            lang: String,
            subtitles: [],
            meta: {
                logo: String,
                background: String,
            }
        }
    },
    data() {
        return this.$store.getters.player;
    },
    methods: {
        unlockPlayer() {
            const canPlay = this.video.play();
            canPlay.catch(() => {});
            this.video.pause();
            this.locked = false;
        },
        togglePlay() {
            this.video.paused ? this.video.play() : this.video.pause();
            this.video.paused ? this.hide = false : this.hide = true;
            
            this.disptach();
            this.$emit('paused');
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
            this.video.currentTime = event.target.value * this.video.duration / 10000;
        },
        onTimeUpdate() {
            const { currentTime, duration } = this.video;
            
            const date = new Date(currentTime * 1000);
            const sec = date.getUTCSeconds();
            const min = date.getUTCMinutes();
            const hours = date.getUTCHours();

            console.log(currentTime);
            
            this.timebar = Number(((currentTime * 10000 / duration) || 0).toFixed());
            this.timer = `${hours > 0 ? hours + ':' : ''}${hours && min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
        },
        disptach() {
            this.$store.dispatch('updateVideo', this.video);
            this.$store.dispatch('updateHideState', this.hide);
            this.$store.dispatch('updateAutoSync', this.autoSync);
            this.$store.dispatch('updateBuffering', this.buffering);
        }
    },
    mounted() {
        this.player = this.$refs.player;
        this.video = this.$refs.video;
        this.video.volume = this.volume;
        this.disptach();
        console.log(this.video);

        UtilsService.loadHls(this.options.src, this.video);

        let hideTimeout = null;
        this.player.onmousemove = () => {
            clearTimeout(hideTimeout);
            this.hide = false;

            if (!this.video.paused) hideTimeout = setTimeout(() => {
                this.hide = true;
                this.disptach();
            }, 3000);

            this.disptach();
        };

        this.video.onwaiting = () => {
            console.log('WAIING');
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
    }
}
</script>

<style lang="scss" scoped>
    .player {
        height: 100%;
        display: grid;
        position: relative;
        align-self: center;

        &.hide {
            cursor: none;
        }

        &:not(.hide):hover {
            .controls {
                opacity: 1;
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
                font-family: 'Montserrat';
                font-size: 9vh;
                font-weight: 500;
            }

            button {
                display: block;
                margin: auto;
            }
        }

        .buffering {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.5);

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

        .auto-sync {
            position: absolute;
            bottom: 8vh;
            padding: 1vh 1vh 1vh 3vh;

            ion-icon {
                margin-right: 0.5vh;
            }
        }

        .controls {
            display: grid;
            align-items: center;
            grid-template-columns: 5vh 5vh auto 6vh 5vh;
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 2vh 3vh;
            user-select: none;
            opacity: 0;
            transition: all 0.2s ease-in;

            .control {
                font-size: 3.5vh;
                cursor: pointer;
            }

            .volume, .fullscreen {
                position: relative;
                font-size: 2.5vh;
                line-height: 0;
                cursor: pointer;
            }

            .volume {
                justify-self: center;

                input {
                    position: absolute;
                    left: -3.2vh;
                    top: -6vh;
                    width: 9vh;
                    transform: rotate(-90deg);
                    opacity: 0;
                    transition: all 0.2s ease-in;
                }

                &:hover {
                    input {
                        opacity: 1;
                    }
                }
            }

            .time-bar {
                margin-left: 1.5vh !important;
                margin-right: 2vh !important;
            }

            .timer {
                justify-self: center;
                font-weight: 500;
                line-height: 0;
            }

            .fullscreen {
                justify-self: right;
            }

            input[type=range] {
                -webkit-appearance: none;
                background: transparent;
                outline: none;
                overflow: hidden;
                margin: 0;
                border-radius: 1vh;

                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 0;
                    box-shadow: -100rem 0 0 100rem white;
                }

                &::-webkit-slider-runnable-track {
                    height: 0.3rem;
                    background-color: rgba(white, 0.35);
                    transition: height 0.1s ease-in-out;
                }

                &:hover::-webkit-slider-runnable-track {
                    height: 0.5rem;
                }
            }
        }
    }
</style>