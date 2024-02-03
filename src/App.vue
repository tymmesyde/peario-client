<template>
    <metainfo>
        <template v-slot:title="{ content }">{{ content }}</template>
    </metainfo>

    <Header></Header>
    
    <Error :type="client.error.type" v-if="client.error"></Error>
    <Error type="server" v-if="!client.connected"></Error>
    <Error type="stremio" v-if="!info.isStremioRunning"></Error>

    <div class="view-container">
        <div class="inner">
            <router-view v-slot="{ Component }" v-if="client.connected">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useMeta } from 'vue-meta';

import Header from '@/components/Header.vue';
import Error from '@/components/Error.vue';
import { APP_TITLE } from '@/common/config';

import store from './store';
import StremioService from './services/stremio.service';
import ClientService from './services/client.service';

const client = computed(() => store.state.client);
const info = computed(() => store.state.info);
const settings = computed(() => store.state.settings);

const updateUserSettings = () => {
    if (settings.value.username)
        ClientService.send('user.update', { username: settings.value.username });
};

const updateLocaleNavigator = () => {
    const navigatorLocale = navigator.language.slice(0, 2);
    if (Object.keys(settings.value.locales).includes(navigatorLocale))
        store.dispatch('settings/updateLocale', navigatorLocale);
};

const checkServerRunning = () => {
    setInterval(async () => {
        const status = await StremioService.isServerOpen();
        store.commit('info/updateStremioStatus', status);
    }, 5000);
};

watch(() => client.value.ready, updateUserSettings);

onMounted(() => {
    store.dispatch('loadAddons');
    store.dispatch('client/start');
    store.dispatch('settings/load');

    checkServerRunning();
    updateLocaleNavigator();
});

useMeta({
    title: APP_TITLE
});
</script>

<style lang="scss">
@import './assets/styles/main.scss';

#app {
    min-height: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

$padding: 25px;

.view-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    top: $header-height-mobile;
    height: calc(100vh - #{$header-height-mobile});
    width: 100%;
    overflow-y: auto;

    .inner {
        max-width: 100vw;
        margin: auto;
        padding: 0 $padding;
    }
}

@media only screen and (min-width: 768px) and (min-height: 768px) {
    .view-container {
        overflow-y: auto;
        top: $header-height;
        height: calc(100vh - #{$header-height});

        .inner {
            width: $inner-width;
            padding: 0;
        }
    }
}
</style>
