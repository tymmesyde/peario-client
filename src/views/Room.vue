<template>
    <RoomModal v-model="ready" :room="room" :loading="loading"></RoomModal>

    <div class="container">
        <div class="player">
            <video ref="video" :src="src" :poster="room.meta.background" controls></video>

            <div class="details">
                <div class="info">
                    <div class="heading">
                        <div class="title">
                            {{ room.stream.title }}
                        </div>
                        <div class="viewers">
                            {{ room.peers.length }}
                            <ion-icon name="eye-outline"></ion-icon>
                        </div>
                    </div>
                    
                    <div class="owner">
                        <ion-icon name="person-circle-outline"></ion-icon>
                        {{ room.owner }}
                    </div>
                </div>
                <div class="options">
                    <Button icon="link" @click="copyLink()">Share</Button>
                    <Button icon="chatbubbles" v-model="toggleChat">Chat</Button>
                </div>
            </div>
        </div>

        <transition name="fade">
            <Chat v-if="toggleChat" @close="toggleChat = false"></Chat>
        </transition>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import RoomModal from '../components/modals/RoomModal.vue';
import Chat from '../components/Chat.vue';
import Button from '../components/Button.vue';
import IpfsService from '../services/ipfs';
import StremioService from '../services/stremio';

export default {
    name: 'Room',
    components: {
        RoomModal,
        Chat,
        Button
    },
    data() {
        return {
            src: '',
            loading: true,
            ready: true,
            toggleChat: false,
            sharedState: IpfsService.state
        }
    },
    computed: {
        room() {
            return this.sharedState.room;
        }
    },
    methods: {
        copyLink() {
            navigator.clipboard.writeText(window.location.href);
            this.$toast.success('Copied to clipboard !');
        },
        sendSync() {
            IpfsService.syncRoom({
                paused: this.$refs.video.paused,
                time: this.$refs.video.currentTime
            });
        },
        syncPlayer({ paused, time }) {
            paused ? this.$refs.video.pause() : this.$refs.video.play();
            this.$refs.video.currentTime = time;
        }
    },
    async mounted() {
        const { params } = useRoute();
        const { id } = params;

        const { stream } = await IpfsService.joinRoom(id);
        this.src = await StremioService.createStream(stream);

        this.sharedState.room.on('sync', this.syncPlayer);

        this.$refs.video.onplay = this.sendSync;
        this.$refs.video.onpause = this.sendSync;
        this.$refs.video.onwaiting = () => this.buffering = true;
        this.$refs.video.oncanplaythrough = () => this.loading = false;
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.container {
    display: flex;
    position: absolute;
    top: $header-height;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;

    $details-height: 180px;

    .player {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;

        video {
            height: calc(100% - #{$details-height});
            width: 100%;
            outline: none;
            background-color: black;
        }

        .details {
            height: $details-height;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 20px;
            padding: 20px 25px;

            .info {
                display: flex;
                flex-direction: column;
                gap: 10px;

                .heading {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 25px;

                    .title {
                        overflow: hidden;
                        white-space: pre;
                        text-overflow: ellipsis;
                        font-family: 'Montserrat-Bold';
                        font-size: 22px;
                        color: white;
                    }

                    .viewers {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        font-family: 'Montserrat-Bold';
                        font-size: 25px;
                        color: #e74a4a;
                        user-select: none;

                        ion-icon {
                            --ionicon-stroke-width: 50px;
                        }
                    }
                }

                .owner {
                    overflow: hidden;
                    white-space: pre;
                    text-overflow: ellipsis;
                    font-family: 'Montserrat-Medium';
                    font-size: 14px;
                    color: white;
                    opacity: 0.5;

                    ion-icon {
                        display: inline-block;
                        vertical-align: bottom;
                        margin-right: 2px;
                        font-size: 17px;
                        flex-shrink: 0;
                    }
                }
            }

            .options {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 15px;
            }
        }
    }
}
</style>