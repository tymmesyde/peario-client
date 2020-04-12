<template>
  <div id="app">
    <Error type="stremio" v-if="!stremioRunning"></Error>

    <transition name="fade">
      <router-view v-if="stremioRunning && ready"></router-view>
    </transition>

    <footer></footer>
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
      stremioRunning: true
    }
  },
  mounted() {
    WebSocketService.init(this.$socket, this.$options.sockets);
    WebSocketService.events.on('ready', ({ user }) => {
      StorageService.set('user', user);
      this.ready = true;
    });

    const isRunningInterval = setInterval(async () => {
      this.stremioRunning = await StremioService.isServerOpen();
      if (this.stremioRunning) clearInterval(isRunningInterval);
    }, 2000);
  }
};
</script>

<style lang="scss">

@import './style.scss';

.error {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;

  ion-icon {
    font-size: 15vh;
  }
}

#app {
  height: calc(100% - #{$header-height} - #{$footer-height});
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;
}

</style>
