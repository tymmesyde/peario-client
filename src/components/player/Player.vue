<template>
    <div class="player" ref="player" :class="{ 'hide': hide }">
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

        <Subtitle v-if="video && currentSub" v-show="toggleSub" :subtitles="options.subtitles" :timecode="video.currentTime" :current="currentSub"></Subtitle>

        <video ref="video" :poster="options.meta.background" @click="togglePlay()" @timeupdate="onTimeUpdate()" @mousewheel="updateVolume($event)"></video>
        
        <div class="controls" v-if="!locked && video">
            <div class="auto-sync" @click="toggleAutoSync()">
                <ion-icon name="toggle-outline" class="flip" v-show="!autoSync"></ion-icon>
                <ion-icon name="toggle" v-show="autoSync"></ion-icon>
                Auto-Sync
            </div>

            <div class="control" @click="togglePlay()" :class="{ 'disabled': autoSync && !options.isOwner }">
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
            <input class="time-bar" type="range" min="0" max="10000" v-bind:value="timebar" :disabled="autoSync && !options.isOwner" @input="seek($event)" >
            <div class="timer">
                {{ timer }}
            </div>

            <div class="subtitles">
                <span @click="toggleSubPanel = !toggleSubPanel">
                    <ion-icon name="text-outline" v-show="!toggleSubPanel"></ion-icon>
                    <ion-icon name="text" v-show="toggleSubPanel"></ion-icon>
                </span>

                <transition name="fade">
                    <div class="panel" v-if="toggleSubPanel">
                        <div class="toggle" @click="toggleSub = !toggleSub">
                            <div v-show="toggleSub" class="status">
                                <ion-icon name="toggle"></ion-icon> On
                            </div>
                            <div v-show="!toggleSub" class="status">
                                <ion-icon name="toggle-outline" class="flip"></ion-icon> Off
                            </div>
                        </div>
                        
                        <ul class="list langs">
                            <li v-for="lang in subsLangs" :key="lang" :class="{ 'active': lang === subPanelLang }" @click="subPanelLang = lang">
                                {{ lang }}
                            </li>
                        </ul>
                        <ul class="list subs">
                            <li v-for="(sub, i) in filterSubs(subPanelLang)" :key="sub.id" :class="{ 'active': sub === currentSub }" @click="currentSub = sub">
                                Subtitle {{ i+1 }}
                            </li>
                        </ul>
                    </div>
                </transition>
            </div>

            <div class="fullscreen" @click="toggleFullscreen()">
                <ion-icon name="expand-outline" v-show="!fullscreen"></ion-icon>
                <ion-icon name="contract-outline" v-show="fullscreen"></ion-icon>
            </div>
        </div>
    </div>
</template>

<script src="./player.js"></script>
<style src="./player.scss" lang="scss" scoped></style>