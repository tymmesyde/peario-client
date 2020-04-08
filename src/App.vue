<template>
  <div id="app">
    <Error type="stremio" v-if="!stremioRunning"></Error>

    <transition name="fade">
      <router-view v-if="stremioRunning"></router-view>
    </transition>

    <footer></footer>
  </div>
</template>

<script>
import Error from "@/components/Error.vue";
import WebSocketService from "@/services/ws.service";
import StremioService from "@/services/stremio.service";

export default {
  name: 'App',
  components: {
    Error
  },
  data() {
    return {
      stremioRunning: true,
    }
  },
  mounted() {
    WebSocketService.init(this.$socket, this.$options.sockets);
    // WebSocketService.events.on('client.token', payload => {
    //   console.log(payload);
    // });

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
