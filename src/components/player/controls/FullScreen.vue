<template>
    <div class="fullscreen" @click="toggleFullscreen()">
        <ion-icon name="expand-outline" v-show="!fullscreen"></ion-icon>
        <ion-icon name="contract-outline" v-show="fullscreen"></ion-icon>
    </div>
</template>

<script>
export default {
    name: 'FullScreenControl',
    props: {
        player: HTMLElement,
        video: HTMLElement
    },
    data() {
        return {
            fullscreen: false
        }
    },
    methods: {
        async toggleFullscreen() {
            if (!this.fullscreen) await this.player.requestFullscreen();
            else await document.exitFullscreen();
        },
        onFullscreenChange() {
            if (document.fullscreenElement) this.fullscreen = true;
            else this.fullscreen = false;
        }
    },
    mounted() {
        this.player.addEventListener('fullscreenchange', this.onFullscreenChange);
        this.video.addEventListener('dblclick', this.toggleFullscreen);
    },
    unmounted() {
        this.player.removeEventListener('fullscreenchange', this.onFullscreenChange);
        this.video.removeEventListener('dblclick', this.toggleFullscreen);
    }
}
</script>