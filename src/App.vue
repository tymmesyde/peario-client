<template>
  <div id="app">
    <Header></Header>

    <Error v-model="error" v-if="error"></Error>

    <transition name="fade-router">
      <router-view v-if="isConnected"></router-view>
    </transition>

    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Error from "@/components/Error.vue";
import WebSocketService from "@/services/ws.service";
import StremioService from "@/services/stremio.service";
import StorageService from "@/services/storage.service";
import { APP_TITLE, WS_SERVER } from "@/common/config";

export default {
  name: 'App',
  metaInfo: {
    titleTemplate: APP_TITLE
  },
  components: {
    Header,
    Footer,
    Error
  },
  data() {
    return {
      isConnected: false,
      error: null
    }
  },
  methods: {
    checkIfStreamioRunning() {
      const isRunningInterval = setInterval(async () => {
        if (await StremioService.isServerOpen()) {
          this.error = null;
          clearInterval(isRunningInterval);
        }
        else this.error = {
          type: 'stremio'
        };
      }, 2000);
    }
  },
  async mounted() {
    this.$store.dispatch('loadAddons');
    
    await WebSocketService.connect(WS_SERVER);
    this.isConnected = true;

    WebSocketService.events.on('ready', ({ user }) => StorageService.set('user', user));
    WebSocketService.events.on('error', error => this.error = error);

    this.checkIfStreamioRunning();
  },
  destroyed() {
    WebSocketService.clear();
  }
};
</script>

<style lang="scss">

@import './style.scss';

#app {
  position: relative;
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
