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

    <Footer></Footer>
</template>

<script>
import { useMeta } from 'vue-meta';

import Header from '@/components/Header.vue';
import Error from '@/components/Error.vue';
import Footer from '@/components/Footer.vue';
import { APP_TITLE } from '@/common/config';

import store from './store';
import StremioService from './services/stremio.service';
import ClientService from './services/client.service';

export default {
    name: 'App',
    components: {
        Header,
        Error,
        Footer
    },
    computed: {
        client: () => store.state.client,
        info: () => store.state.info,
        settings: () => store.state.settings
    },
    watch: {
        'client.ready'() {
            this.updateUserSettings();
        }
    },
    setup() {
        useMeta({
            title: APP_TITLE
        });
    },
    methods: {
        updateUserSettings() {
            if (this.settings.username) ClientService.send('user.update', { username: this.settings.username });
        },
        updateLocaleNavigator() {
            const navigatorLocale = navigator.language.substr(0, 2);
            if (Object.keys(this.settings.locales).includes(navigatorLocale)) store.dispatch('settings/updateLocale', navigatorLocale);
        },
        checkServerRunning() {
            setInterval(async () => {
                const status = await StremioService.isServerOpen();
                store.commit('info/updateStremioStatus', status);
            }, 5000);
        }
    },
    mounted() {
        store.dispatch('loadAddons');
        store.dispatch('client/start');
        store.dispatch('settings/load');

        this.checkServerRunning();
        this.updateLocaleNavigator();
    }
};
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
    overflow-y: overlay;

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
        height: calc(100vh - #{$header-height} - #{$footer-height});

        .inner {
            width: $inner-width;
            padding: 0;
        }
    }
}
</style>
