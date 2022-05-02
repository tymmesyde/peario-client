<template>
    <div :class="['room', { 'chat-open': isChatOpen }]">
        <Loading type="room" v-if="!playerOptions"></Loading>

        <div class="users" v-if="playerState.video" :class="{ 'show': !playerState.controlsHidden }">
            <div class="count">
                <ion-icon name="eye-outline"></ion-icon> {{ usersList.length }}
            </div>

            <ul>
                <li v-for="user in usersList" :key="user.id">
                    <div class="username">
                        <ion-icon name="ribbon-outline" v-if="user.id == clientState.room.owner"></ion-icon>
                        <ion-icon name="person-outline" v-else></ion-icon>
                        {{ user.name }}
                    </div>

                    <div class="status" v-if="user.id == clientState.room.owner">
                        <ion-icon class="success" name="play-outline" v-if="!playerState.paused"></ion-icon>
                        <ion-icon class="danger" name="pause-outline" v-else></ion-icon>
                    </div>
                </li>
            </ul>
        </div>

        <div class="controls">
            <Button clear icon="close" v-if="isChatOpen" @click="isChatOpen = false"></Button>
            <Button clear icon="chatbubbles-outline" v-else @click="isChatOpen = true">Open Chat</Button>
        </div>

        <Player v-if="playerOptions" :options="playerOptions" @change="syncPlayer()"></Player>

        <transition name="fade">
            <Chat v-if="isChatOpen"></Chat>
        </transition>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import router from '@/router';
import store from '@/store';

import Loading from "@/components/Loading.vue";
import Button from "@/components/ui/Button.vue";
import Player from "@/components/player/Player.vue";
import Chat from "@/components/Chat.vue";
import StremioService from "@/services/stremio.service";
import HlsService from "@/services/hls.service";
import ClientService from "@/services/client.service";
import { onBeforeRouteLeave } from 'vue-router';

const usersList = ref([]);
const playerOptions = ref(null);
const isChatOpen = ref(false);

const clientState = computed(() => store.state.client);
const clientRoomState = computed(() => store.state.client.room);
const playerState = computed(() => store.state.player);

const syncRoom = async () => {
    const { stream, meta, player, owner, users } = clientState.value.room;

    if (!playerOptions.value) {
        const videoUrl = await StremioService.createStream(stream);
        playerOptions.value = { src: videoUrl, hls: null, meta, isOwner: clientState.value.user.id === owner };

        HlsService.createPlaylist(videoUrl).then(playlistUrl => {
            playerOptions.value = {
                ...playerOptions.value,
                hls: playlistUrl
            };
        });
    }

    usersList.value = users;

    if (playerState.value.autoSync && playerState.value.video && !playerState.value.locked) {
        const { paused, buffering, time } = player;

        const unsync = time - playerState.value.video.currentTime;
        if (unsync > 1 || unsync < -1) {
            playerState.value.video.currentTime = time;
        }

        paused ? playerState.value.video.pause() : playerState.value.video.play();
        store.commit('player/updatePaused', playerState.value.video.paused);
        playerState.value.buffering = buffering;
    }
};

const syncPlayer = () => {
    if (playerState.value.autoSync) {
        const { currentTime } = playerState.value.video;
        ClientService.send('player.sync', { paused: playerState.value.paused, buffering: playerState.value.buffering, time: currentTime });
    }
};

watch(clientRoomState, () => {
    syncRoom();
});

let syncPlayerInterval = null;

onMounted(() => {
    const { id } = router.currentRoute.value.params;
    ClientService.send('room.join', { id });

    syncPlayerInterval = setInterval(() => {
        if (playerState.value.video && !playerState.value.paused)
            syncPlayer();
    }, 1000);
});

onUnmounted(() => {
    clearInterval(syncPlayerInterval);
    syncPlayerInterval = null;
});

onBeforeRouteLeave(() => {
    store.commit('client/updateError', null);
});
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
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
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
                font-family: 'Montserrat', sans-serif;
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
