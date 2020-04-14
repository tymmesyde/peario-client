<template>
  <div id="app">
    <Error :type="error.type" v-if="error"></Error>
    <Error type="stremio" v-if="!stremioRunning"></Error>

    <transition name="fade">
      <router-view v-if="stremioRunning && ready"></router-view>
    </transition>
  </div>
</template>

<script>
import Error from "@/components/Error.vue";
import WebSocketService from "@/services/ws.service";
import StremioService from "@/services/stremio.service";
import StorageService from "@/services/storage.service";
import { APP_TITLE } from "@/common/config";

export default {
  name: 'App',
  metaInfo: {
    titleTemplate: APP_TITLE
  },
  components: {
    Error
  },
  data() {
    return {
      ready: false,
      stremioRunning: true,
      error: null,
    }
  },
  mounted() {
    WebSocketService.init(this.$socket, this.$options.sockets);
    WebSocketService.events.on('ready', ({ user }) => {
      StorageService.set('user', user);
      this.ready = true;
    });

    WebSocketService.events.on('error', error => this.error = error);

    const isRunningInterval = setInterval(async () => {
      this.stremioRunning = await StremioService.isServerOpen();
      if (this.stremioRunning) clearInterval(isRunningInterval);
    }, 2000);
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
