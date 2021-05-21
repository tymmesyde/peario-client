<template>
    <div id="room" class="container">
        <Loading type="room" v-if="!playerOptions"></Loading>

        <div class="users" v-if="player.video" :class="{ 'show': !player.hide }">
            <div class="count">
                <ion-icon name="eye-outline"></ion-icon> {{ users.length }}
            </div>

            <ul>
                <li v-for="user in users" v-bind:key="user.id">
                    <div class="status">
                        <span v-if="user.id == owner">
                            <ion-icon name="play-outline" v-show="!player.video.paused" class="success"></ion-icon>
                            <ion-icon name="pause-outline" v-show="player.video.paused" class="danger"></ion-icon>
                        </span>
                        <span v-else>
                            <ion-icon name="checkmark-outline"></ion-icon>
                        </span>
                    </div>
                    <div class="username">
                        {{ user.name }}
                        <ion-icon name="ribbon-outline" v-show="user.id == owner"></ion-icon>
                    </div>
                </li>
            </ul>
        </div>

        <Player v-if="playerOptions" v-bind:options="playerOptions" v-on:paused="syncPlayer()"></Player>
    </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import Player from "@/components/player/Player.vue";
import StremioService from "@/services/stremio.service";
import HlsService from "@/services/hls.service";
import WebSocketService from "@/services/ws.service";
import StorageService from "@/services/storage.service";

export default {
    name: 'Room',
    components: {
        Loading,
        Player
    },
    data() {
        return {
            blob: null,
            owner: null,
            users: [],
            playerOptions: null,
        }
    },
    computed: {
        player() {
            return this.$store.getters.player;
        },
        user() {
            return StorageService.get('user');
        }
    },
    methods: {
        async syncRoom(room) {            
            const { stream, meta, player, owner, users } = room;

            if (!this.owner) this.owner = owner;

            if (!this.playerOptions) {
                const videoUrl = await StremioService.createStream(stream);
                const playlistUrl = await HlsService.createPlaylist(videoUrl);
                this.playerOptions = { src: videoUrl, hls: playlistUrl, meta, isOwner: this.user.id === owner };
            }

            this.users = users;

            if (this.player.autoSync && this.player.video && !this.player.locked) {
                const { paused, buffering, time } = player;

                const unsync = time - this.player.video.currentTime;
                if (unsync > 1 || unsync < -1) {
                    this.player.video.currentTime = time;
                }

                paused ? this.player.video.pause() : this.player.video.play();
                this.player.buffering = buffering;
            }

            this.$forceUpdate();
        },
        syncPlayer() {
            if (this.player.autoSync) {
                const { paused, currentTime } = this.player.video;
                WebSocketService.send('player.sync', { paused, buffering: this.player.buffering, time: currentTime });
            }
        }
    },
    mounted() {
        const { id } = this.$route.params;
        WebSocketService.send('room.join', { id });
        WebSocketService.events.on('sync', this.syncRoom);

        this.interval = setInterval(() => {
            if (this.player.video && !this.player.video.paused) this.syncPlayer();
        }, 1000);
    },
    unmounted() {
        clearInterval(this.interval);
        this.interval = null;
    }
};
</script>

<style lang="scss" scoped>
@import '../variables.scss';

#room {
    background-color: black;
    user-select: none;

    .count {
        font-family: 'Montserrat-Medium';
        font-size: 30px;
        font-weight: bold;
        color: $accent-color;
    }

    .users {
        z-index: 99;
        position: absolute;
        top: 0;
        left: 0;
        padding: 2vw;
        opacity: 0;
        transition: opacity 0.2s ease-in;
        transition-delay: 0.3s;

        &.show {
            opacity: 1;
        }

        ul {
            margin-top: 1vh;

            li {
                display: flex;
                align-content: center;
                padding-bottom: 1.5vh;
                font-family: 'Montserrat';
                font-size: 15px;
                color: rgba(255, 255, 255, 0.7);

                ion-icon {
                    padding-right: 0.5vw;
                }
            }
        }
    }
}
</style>