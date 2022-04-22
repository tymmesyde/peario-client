<template>
  <div class="auto-sync" @click="toggleAutoSync()">
    <ion-icon name="toggle-outline" class="flip" v-show="!autoSync"></ion-icon>
    <ion-icon name="toggle" v-show="autoSync"></ion-icon>
    {{ $t(`components.player.autoSync`) }}
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";

export default {
  name: "AutoSyncControl",
  computed: mapGetters({
    autoSync: "player/autoSync",
  }),
  methods: {
    toggleAutoSync() {
      store.commit("player/updateAutoSync", !this.autoSync);
    },
  },
};
</script>

<style lang="scss" scoped>
.auto-sync {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 6vw;
  left: 2.5vw;
  padding: 10px 0;
  font-size: 20px;

  ion-icon {
    margin-right: 10px;
  }
}
</style>
