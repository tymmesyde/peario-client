<template>
    <div class="lock-screen">
        <div>
            <img v-if="options.meta.logo" :src="options.meta.logo" :alt="options.meta.name">
            <Button icon="checkmark-outline" translate="components.player.ready" @click="unlockPlayer()"/>
        </div>

        <div class="share" v-if="options.isOwner">
            <p>{{ $t(`components.player.share`) }}</p>
            <TextInput :value="shareUrl" @click="copyShareUrl()"/>
        </div>
    </div>
</template>

<script>
import store from '../../store';
import { mapGetters } from 'vuex';

import Button from "@/components/ui/Button.vue";
import TextInput from "@/components/ui/TextInput.vue";

export default {
    name: 'LockScreen',
    components: {
        Button,
        TextInput
    },
    props: {
        options: Object
    },
    computed: {
        shareUrl() {
            return window.location.href;
        },
        ...mapGetters({
            video: 'player/video'
        })
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
            store.commit('player/updateLockState', false);
        }
    }
}
</script>

<style lang="scss" scoped>
.lock-screen {
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
</style>