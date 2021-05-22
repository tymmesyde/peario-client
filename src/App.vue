<template>
  <metainfo>
      <template v-slot:title="{ content }">{{ content }}</template>
  </metainfo>

  <Header></Header>

  <Error :type="error.type" v-for="error in errors" :key="error.type" @close="removeError(error.type)"></Error>

  <router-view v-slot="{ Component }" v-if="isConnected">
    <transition name="fade-router">
      <component :is="Component" />
    </transition>
  </router-view>

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
</style>
