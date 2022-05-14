<template>
    <div class="volume">
        <RangeInput class="volume-bar" v-model="volumeInput"></RangeInput>
        <span class="icon" @click="toggleVolume()">
            <ion-icon name="volume-mute-outline" v-show="volume === 0"></ion-icon>
            <ion-icon name="volume-off-outline" v-show="volume > 0 && volume <= 0.2"></ion-icon>
            <ion-icon name="volume-low-outline" v-show="volume > 0.2 && volume < 0.5"></ion-icon>
            <ion-icon name="volume-medium-outline" v-show="volume >= 0.5 && volume < 0.8"></ion-icon>
            <ion-icon name="volume-high-outline" v-show="volume >= 0.8"></ion-icon>
        </span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import RangeInput from '@/components/ui/RangeInput.vue';
import store from '../../../store';

export default {
    name: 'VolumeControl',
    components: {
        RangeInput
    },
    computed: mapGetters({
        video: 'player/video',
        volume: 'player/volume'
    }),
    data() {
        return {
            volumeTmp: 0,
            volumeInput: this.volume
        };
    },
    watch: {
        volumeInput(value) {
            store.commit('player/updateVolume', parseFloat(value));
        }
    },
    methods: {
        toggleVolume() {
            if (this.volume) {
                this.volumeTmp = this.volume;
                this.volumeInput = 0;
            } else {
                this.volumeInput = this.volumeTmp;
            }
        },
        onMouseWheel({ deltaY }) {
            this.volumeInput = parseFloat((deltaY < 0 ? this.volumeInput < 1 ? this.volumeInput += 0.1 : 1 : this.volumeInput > 0 ? this.volumeInput -= 0.1 : 0).toFixed(1));
        }
    },
    mounted() {
        this.video.onmousewheel = this.onMouseWheel;
    },
    unmounted() {
        this.video.removeEventListener('mousewheel', this.onMouseWheel);
    }
}
</script>

<style lang="scss" scoped>
.volume {
    display: flex;
    justify-content: center;

    .volume-bar {
        position: absolute;
        top: -70px;
        width: 120px;
        transform: rotate(-90deg);
        transform-origin: center;
        opacity: 0;
    }

    .icon {
        display: contents;
    }

    &:hover {
        .volume-bar {
            opacity: 1;
        }
    }
}
</style>