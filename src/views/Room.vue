<template>
  <div :class="['room', { 'chat-open': chatOpen }]">
    <Loading type="room" v-if="!playerOptions"></Loading>

    <div
      class="users"
      v-if="player.video"
      :class="{ show: !player.controlsHidden }"
    >
      <div class="count">
        <ion-icon name="eye-outline"></ion-icon>
        {{ users.length }}
      </div>

      <ul>
        <li v-for="user in users" :key="user.id">
          <div class="username">
            <ion-icon
              name="ribbon-outline"
              v-if="user.id == client.room.owner"
            ></ion-icon>
            <ion-icon name="person-outline" v-else></ion-icon>
            {{ user.name }}
          </div>

          <div class="status" v-if="user.id == client.room.owner">
            <ion-icon
              class="success"
              name="play-outline"
              v-if="!player.paused"
            ></ion-icon>
            <ion-icon class="danger" name="pause-outline" v-else></ion-icon>
          </div>
        </li>
      </ul>
    </div>

    <div class="controls">
      <Button
        clear
        icon="close"
        v-if="chatOpen"
        @click="chatOpen = false"
      ></Button>
      <Button clear icon="chatbubbles-outline" v-else @click="chatOpen = true"
        >Open Chat</Button
      >
    </div>

    <Player
      v-if="playerOptions"
      :options="playerOptions"
      @change="syncPlayer()"
    ></Player>

    <transition name="fade">
      <Chat v-if="chatOpen"></Chat>
    </transition>
  </div>
</template>

<script>
import store from "../store";

import Loading from "@/components/Loading.vue";
import Button from "@/components/ui/Button.vue";
import Player from "@/components/player/Player.vue";
import Chat from "@/components/Chat.vue";
import StremioService from "@/services/stremio.service";
import HlsService from "@/services/hls.service";
import ClientService from "@/services/client.service";

export default {
  name: "Room",
  components: {
    Loading,
    Button,
    Player,
    Chat,
  },
  data() {
    return {
      blob: null,
      owner: null,
      users: [],
      playerOptions: null,
      chatOpen: false,
    };
  },
  computed: {
    client: () => store.state.client,
    player() {
      return {
        video: store.getters["player/video"],
        paused: store.getters["player/paused"],
        autoSync: store.getters["player/autoSync"],
        buffering: store.getters["player/buffering"],
      };
    },
  },
  watch: {
    "client.room"() {
      this.syncRoom();
    },
  },
  methods: {
    async syncRoom() {
      const { stream, meta, player, owner, users } = this.client.room;

      if (!this.playerOptions) {
        const videoUrl = await StremioService.createStream(stream);
        this.playerOptions = {
          src: videoUrl,
          hls: null,
          meta,
          isOwner: this.client.user.id === owner,
        };

        HlsService.createPlaylist(videoUrl).then((playlistUrl) => {
          this.playerOptions = {
            ...this.playerOptions,
            hls: playlistUrl,
          };
        });
      }

      this.users = users;

      if (this.player.autoSync && this.player.video && !this.player.locked) {
        const { paused, buffering, time } = player;

        const unsync = time - this.player.video.currentTime;
        if (unsync > 1 || unsync < -1) {
          this.player.video.currentTime = time;
        }

        paused ? this.player.video.pause() : this.player.video.play();
        store.commit("player/updatePaused", this.player.video.paused);
        this.player.buffering = buffering;
      }
    },
    syncPlayer() {
      if (this.player.autoSync) {
        const { currentTime } = this.player.video;
        ClientService.send("player.sync", {
          paused: this.player.paused,
          buffering: this.player.buffering,
          time: currentTime,
        });
      }
    },
  },
  mounted() {
    const { id } = this.$route.params;
    ClientService.send("room.join", { id });

    this.interval = setInterval(() => {
      if (this.player.video && !this.player.paused) this.syncPlayer();
    }, 1000);
  },
  unmounted() {
    clearInterval(this.interval);
    this.interval = null;
  },
  beforeRouteLeave() {
    store.commit("client/updateError", null);
  },
};
</script>

<style lang="scss" scoped>
.room {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  user-select: none;

  &.chat-open {
    .users {
      display: none;
    }
  }

  .users {
    z-index: 96;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 2vw;
    opacity: 0;
    transition: opacity 0.2s ease-in;
    transition-delay: 0.3s;

    &.show {
      opacity: 1;
    }

    .count {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: "Montserrat", serif;
      font-weight: 700;
      font-size: 30px;
      color: $danger-color;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 10px;

      li {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: "Montserrat", serif;
        font-weight: 400;
        font-size: 15px;
        color: rgba(255, 255, 255, 0.7);

        .username {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .controls {
    z-index: 97;
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

@media only screen and (min-width: 768px) and (min-height: 768px) {
  .room {
    &.chat-open {
      .users {
        display: inherit;
      }
    }
  }
}
</style>
