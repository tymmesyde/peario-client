<template>
    <AButton class="auto-sync" clear @click="toggleAutoSync()">
        <ion-icon name="toggle-outline" class="flip" v-show="!autoSync"></ion-icon>
        <ion-icon name="toggle" v-show="autoSync"></ion-icon>
        {{ $t(`components.player.autoSync`) }}
    </AButton>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';

import AButton from '@/components/ui/Button.vue';

export default {
    name: 'AutoSyncControl',
    components: {
        AButton
    },
    computed: mapGetters({
        autoSync: 'player/autoSync'
    }),
    methods: {
        toggleAutoSync() {
            store.commit('player/updateAutoSync', !this.autoSync);
        }
    }
}
</script>

<style lang="scss" scoped>
.auto-sync {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: calc(#{$player-controls-height} + 1rem);
    left: 1.5em;
    cursor: pointer;

    ion-icon {
        margin-right: 0.5em;
    }
}

@media only screen and (max-width: 768px) and (orientation: portrait) {
    .auto-sync {
        bottom: calc(#{$player-controls-height} + 2.5rem) !important;
    }
}
</style>