<template>
    <div class="player" ref="player" :class="{ 'controlsHidden': controlsHidden }"
        @mousemove="showControls()"
        @touchmove="showControls()"
        @dragover="dropSubtitles($event)"
        @drop="dropSubtitles($event)"
        @mouseleave="hideControls()">

        <LockScreen :options="options" v-if="locked"></LockScreen>
        
        <div class="buffering" v-if="!locked && !paused && buffering">
            <div>
                <ion-icon name="sync-outline" class="spin"></ion-icon>
            </div>
        </div>

        <Subtitle v-if="video" :timecode="currentTime"></Subtitle>

        <video ref="video" :src="options.src" :poster="options.meta.background"
            @click="showControls()"
            @timeupdate="updateCurrentTime()"
            @waiting="updateBuffering(true)"
            @loadedmetadata="updateBuffering(false)"
            @canplay="updateBuffering(false)">
        </video>

        <div class="controls" v-if="!locked && video">
            <div class="panel">
                <PlayPauseControl class="control" :options="options" @change="onPlayerChange()"></PlayPauseControl>

                <div class="timer control" v-to-timer="currentTime"></div>
            </div>

            <div class="panel stretch">
                <AutoSyncControl></AutoSyncControl>

                <TimeBarControl class="control" :options="options"></TimeBarControl>
            </div>

            <div class="panel">
                <VolumeContol class="control"></VolumeContol>

                <SubtitlesControl class="control" :videoUrl="options.src" :meta="options.meta" :userSubtitle="userSubtitle"></SubtitlesControl>

                <HlsControl class="control" :options="options"></HlsControl>

                <FullScreenControl class="control" :player="player" :video="video"></FullScreenControl>
            </div>
        </div>
    </div>
</template>

<script>
import LockScreen from "./LockScreen.vue";
import Subtitle from "@/components/Subtitle.vue";
import AutoSyncControl from "./controls/AutoSync.vue";
import PlayPauseControl from "./controls/PlayPause.vue";
import TimeBarControl from "./controls/TimeBar.vue";
import VolumeContol from "./controls/Volume.vue";
import SubtitlesControl from "./controls/Subtitles.vue";
import HlsControl from "./controls/Hls.vue";
import FullScreenControl from "./controls/FullScreen.vue";

import store from '../../store';
import { mapGetters } from 'vuex';

export default {
    name: 'Player',
    components: {
        LockScreen,
        Subtitle,
        AutoSyncControl,
        PlayPauseControl,
        TimeBarControl,
        VolumeContol,
        SubtitlesControl,
        HlsControl,
        FullScreenControl
    },
    props: {
        options: {
            src: String,
            meta: {
                id: String,
                type: String,
                logo: String,
                background: String,
            },
            isOwner: Boolean
        }
    },
    computed: mapGetters({
        locked: 'player/locked',
        paused: 'player/paused',
        currentTime: 'player/currentTime',
        controlsHidden: 'player/controlsHidden',
        buffering: 'player/buffering',
        volume: 'player/volume',
        autoSync: 'player/autoSync'
    }),
    data() {
        return {
            player: null,
            video: null,
            hideTimeout: null,
            userSubtitle: null
        };
    },
    watch: {
        volume(value) {
            this.video.volume = value;
        }
    },
    methods: {
        showControls() {
            clearTimeout(this.hideTimeout);
            store.commit('player/updateHideState', false);

            this.hideTimeout = setTimeout(this.hideControls, 3000);
        },
        hideControls() {
            if (!this.paused) store.commit('player/updateHideState', true);
        },
        onPlayerChange() {
            if (this.paused) this.showControls();
            this.$emit('change');
        },
        updateBuffering(value) {
            store.commit('player/updateBuffering', value);
        },
        updateCurrentTime() {
            store.commit('player/updateCurrentTime', this.video.currentTime);
        },
        dropSubtitles(event) {
            event.preventDefault();

            const { files } = event.dataTransfer;
            if (files.length) {
                const file = files[0];
                if (file.name.endsWith('.srt')) this.userSubtitle = file;
            }
        }
    },
    mounted() {
        store.commit('player/updateLockState', true);
        this.player = this.$refs.player;
        this.video = this.$refs.video;
        store.commit('player/updateVideo', this.video);
        this.video.volume = this.volume;
    }
}
</script>

<style lang="scss" scoped>
$overlay-background-color: rgba(0, 0, 0, 0.5);

.player {
    position: relative;
    font-family: 'Montserrat-Regular';
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: black;

    &.controlsHidden {
        cursor: none;

        .controls {
            opacity: 0;
            visibility: hidden;
        }
    }

    .buffering {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $text-color;
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
        color: $text-color;
        background-color: $overlay-background-color;
        box-shadow: 0px -40px 100px 60px $overlay-background-color;

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

        .timer {
            width: 82px;
            padding: 0;
            font-size: 20px;
            text-align: center;
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