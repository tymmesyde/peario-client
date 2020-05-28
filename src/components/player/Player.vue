<template>
    <div class="player" ref="player" :class="{ 'hideControls': hideControls }" @mousemove="showControls()" @touchmove="showControls()" @dragover="dropSubtitles($event)" @drop="dropSubtitles($event)">
        <div class="locked" v-if="locked">
            <div>
                <img v-if="options.meta.logo" :src="options.meta.logo" :alt="options.meta.name">
                <button @click="unlockPlayer()"><ion-icon name="checkmark-outline"></ion-icon> {{ $t(`components.player.ready`) }}</button>
            </div>

            <div class="share" v-if="options.isOwner">
                <p>{{ $t(`components.player.share`) }}</p>
                <input type="text" :value="shareUrl" spellcheck="false" @click="copyShareUrl()">
            </div>
        </div>

        <div class="buffering" v-if="!locked && !video.paused && buffering">
            <div>
                <ion-icon name="sync-outline" class="spin"></ion-icon>
            </div>
        </div>

        <Subtitle v-if="video" :timecode="video.currentTime"></Subtitle>

        <video ref="video" :src="options.src" :poster="options.meta.background" @click="showControls()" @timeupdate="onTimeUpdate()" @mousewheel="updateVolume($event)"></video>

        <div class="controls" v-if="!locked && video">
            <div class="panel">
                <div class="play-pause control big" @click="togglePlay()" :class="{ 'disabled': autoSync && !options.isOwner }">
                    <ion-icon name="play-outline" v-show="video.paused"></ion-icon>
                    <ion-icon name="pause-outline" v-show="!video.paused"></ion-icon>
                </div>

                <div class="timer control small">
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
                    <input type="range" min="0" max="10000" v-bind:value="timebar" :disabled="autoSync && !options.isOwner" @input="seek($event)" >
                </div>
            </div>

            <div class="panel">
                <div class="volume control">
                    <input class="volume-bar" type="range" min="0" max="1" step="0.1" v-model="volume" @input="video.volume = volume">
                    <span class="icon" @click="toggleVolume()">
                        <ion-icon name="volume-mute-outline" v-show="video.volume === 0"></ion-icon>
                        <ion-icon name="volume-off-outline" v-show="video.volume > 0 && video.volume <= 0.2"></ion-icon>
                        <ion-icon name="volume-low-outline" v-show="video.volume > 0.2 && video.volume < 0.5"></ion-icon>
                        <ion-icon name="volume-medium-outline" v-show="video.volume >= 0.5 && video.volume < 0.8"></ion-icon>
                        <ion-icon name="volume-high-outline" v-show="video.volume >= 0.8"></ion-icon>
                    </span>
                </div>

                <SubtitlesControl :videoUrl="options.src" :userSubtitle="userSubtitle" class="control"></SubtitlesControl>

                <div class="fullscreen control" @click="toggleFullscreen()">
                    <ion-icon name="expand-outline" v-show="!fullscreen"></ion-icon>
                    <ion-icon name="contract-outline" v-show="fullscreen"></ion-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./player.js"></script>
<style src="./player.scss" lang="scss" scoped></style>