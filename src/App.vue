<template>
    <metainfo>
        <template v-slot:title="{ content }">{{ content }}</template>
    </metainfo>

    <Header></Header>

    <Error :type="error.type" v-for="error in errors" :key="error.type" @close="removeError(error.type)"></Error>

    <div class="view-container">
        <div class="inner">
            <router-view v-slot="{ Component }" v-if="isConnected">
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

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Error from "@/components/Error.vue";
import WebSocketService from "@/services/ws.service";
import StremioService from "@/services/stremio.service";
import StorageService from "@/services/storage.service";
import { APP_TITLE, WS_SERVER } from "@/common/config";

export default {
    name: 'App',
    components: {
        Header,
        Footer,
        Error
    },
    data() {
        return {
            isConnected: false,
            errors: []
        }
    },
    methods: {
        checkIfStreamioRunning() {
            const isRunningInterval = setInterval(async () => {
                if (await StremioService.isServerOpen()) {
                    this.removeError('stremio');
                    clearInterval(isRunningInterval);
                }
                else this.errors.push({
                    type: 'stremio'
                });
            }, 2000);
        },
        removeError(type) {
            this.errors = this.errors.filter(e => e.type !== type);
        }
    },
    setup() {
        useMeta({
            title: APP_TITLE
        });
    },
    async mounted() {
        this.$store.dispatch('loadAddons');

        await WebSocketService.connect(WS_SERVER);
        this.isConnected = true;

        WebSocketService.events.on('ready', ({ user }) => StorageService.set('user', user));
        WebSocketService.events.on('error', error => this.errors.push(error));

        this.checkIfStreamioRunning();
    },
    unmounted() {
        WebSocketService.clear();
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
    margin-top: $header-height;
    height: calc(100vh - #{$header-height} - #{$footer-height});
    width: 100%;
    overflow-y: overlay;

    .inner {
        margin: auto;
        padding: 0 $padding;
    }
}

@media only screen and (min-width: 768px) {
    .view-container {
        overflow-y: auto;

        .inner {
            width: $inner-width;
            padding: 0;
        }
    }
}
</style>
