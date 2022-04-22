<template>
  <div class="hls" @click="toggleHls()">
    <ion-icon name="color-wand-outline" v-show="!isHls"></ion-icon>
    <ion-icon name="color-wand" v-show="isHls"></ion-icon>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HlsService from "@/services/hls.service";
import store from "../../../store";

export default {
  name: "HlsControl",
  props: {
    options: Object,
  },
  computed: mapGetters({
    video: "player/video",
  }),
  data() {
    return {
      isHls: false,
    };
  },
  methods: {
    async toggleHls() {
      const currentTime = this.video.currentTime;
      const wasPlaying = !this.video.paused;

      if (!this.isHls) await HlsService.loadHls(this.options.hls, this.video);
      else store.commit("player/updateVideoSrc", this.options.src);

      this.isHls = !this.isHls;
      store.commit("player/updateVideoCurrentTime", currentTime);

      if (wasPlaying) this.video.play();
      this.isHls
        ? this.$toast.success(this.$t("toasts.hlsStream"))
        : this.$toast.success(this.$t("toasts.sourceStream"));
    },
  },
  mounted() {
    HlsService.init();
    this.video.addEventListener("error", this.toggleHls);
  },
  unmounted() {
    HlsService.clear();
    this.video.removeEventListener("onerror", this.toggleHls);
  },
};
</script>
