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

<script src="./player.js"></script>
<style src="./player.scss" lang="scss" scoped></style>