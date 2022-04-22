<template>
  <div class="time-bar">
    <RangeInput
      v-model="range"
      max="10000"
      step="1"
      :disabled="(autoSync && !options.isOwner) || !video.duration"
      @change="updateCurrentTime($event)"
    ></RangeInput>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import RangeInput from "@/components/ui/RangeInput.vue";

export default {
  name: "TimeBarControl",
  components: {
    RangeInput,
  },
  props: {
    options: Object,
  },
  computed: {
    currentTime() {
      return this.video.currentTime;
    },
    ...mapGetters({
      video: "player/video",
      autoSync: "player/autoSync",
    }),
  },
  data() {
    return {
      range: 0,
    };
  },
  methods: {
    currentTimeToRange() {
      const { currentTime, duration } = this.video;
      this.range = Number(((currentTime * 10000) / duration || 0).toFixed());
    },
    updateCurrentTime(value) {
      if ((!this.options.isOwner && !this.autoSync) || this.options.isOwner) {
        const currentTime = (value * this.video.duration) / 10000;
        store.dispatch("player/setCurrentTime", currentTime);
      }
    },
  },
  mounted() {
    this.video.addEventListener("timeupdate", this.currentTimeToRange);
  },
  unmounted() {
    this.video.removeEventListener("timeupdate", this.currentTimeToRange);
  },
};
</script>

<style lang="scss" scoped>
.time-bar {
  input {
    width: 100%;
  }
}
</style>
