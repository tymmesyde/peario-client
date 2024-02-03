<template>
    <div class="lock-screen">
        <div class="header">
            <img v-if="options.meta.logo" :src="options.meta.logo" :alt="options.meta.name">
            <AButton large icon="checkmark-outline" @click="unlockPlayer()">
                {{ $t('components.player.ready') }}
            </AButton>
        </div>

        <div class="share" v-if="options.isOwner">
            <div class="text">
                {{ $t(`components.player.share`) }}
            </div>
            <TextInput :value="shareUrl" @click="copyShareUrl()"/>
        </div>
    </div>
</template>

<script>
import store from '../../store';
import { mapGetters } from 'vuex';

import AButton from "@/components/ui/Button.vue";
import TextInput from "@/components/ui/TextInput.vue";

export default {
    name: 'LockScreen',
    components: {
        AButton,
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    background-color: rgba(0, 0, 0, 0.8);

    .header {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
            width: 300px;
            line-height: 10rem;
            font-size: 5rem;
            font-weight: 500;
            color: $text-color;
        }

        button {
            width: auto;
        }
    }

    .share {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .text {
            font-family: 'Montserrat-SemiBold';
            font-size: 20px;
            color: $text-color;
        }

        input {
            width: 100%;
            cursor: pointer;
        }
    }
}

@media only screen and (min-width: 768px) and (min-height: 768px) {
    .lock-screen {
        gap: 50px;

        .header {
            img {
                width: 600px;
            }
        }
    }
}
</style>