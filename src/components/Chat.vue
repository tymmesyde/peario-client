<template>
    <div class="chat">
        <div class="topbar">
            <ATitle type="secondary" icon="chatbubbles">Chat</ATitle>
        </div>
        
        <div class="placeholder" v-show="!client.messages.length">
            <ion-icon name="chatbubbles-outline"></ion-icon>
            <div class="text">
                No one is talking here...
            </div>
        </div>

        <div ref="messages" class="messages" v-show="client.messages.length">
            <transition-group name="fade" mode="out-in">
                <div :class="['message', { 'right': client.user.id === message.user }]" v-for="message in client.messages" :key="message">
                    <div class="user">
                        <ion-icon name="ribbon" v-if="client.room.owner === message.user"></ion-icon>
                        <ion-icon name="person" v-else></ion-icon>
                        {{ getUsername(message.user) }}
                    </div>
                    <div class="content">
                        {{ message.content }}
                    </div>
                </div>
            </transition-group>
        </div>

        <div class="form">
            <ATextInput v-model="message" placeholder="Say something nice" maxlength="300" @keyup.stop="" @keyup.enter="sendMessage()" />
            <AButton icon="send" @click="sendMessage()" />
        </div>
    </div>
</template>

<script>
import store from '../store';
import ClientService from "@/services/client.service";

import ATitle from '@/components/ui/Title.vue';
import ATextInput from '@/components/ui/TextInput.vue';
import AButton from '@/components/ui/Button.vue';

export default {
    name: 'Chat',
    components: {
        ATitle,
        ATextInput,
        AButton
    },
    computed: {
        client: () => store.state.client
    },
    data() {
        return {
            message: '',
            cooldown: null
        }
    },
    watch: {
        'client.messages'() {
            this.scrollToBottom();
        }
    },
    methods: {
        sendMessage() {
            ClientService.send('room.message', { content: this.message });
            this.message = '';

            clearTimeout(this.cooldown);
            this.cooldown = setTimeout(() => store.commit('client/updateError', null), 3000);
        },
        getUsername(user_id) {
            const user = this.client.room.users.find(({ id }) => id === user_id);
            return user ? user.name: 'Unknown';
        },
        scrollToBottom() {
            setTimeout(() => {
                const element = this.$refs.messages;
                element.scrollTo({
                    top: element.scrollHeight,
                    behavior: 'smooth'
                });
            }, 50);
        }
    }
}
</script>

<style lang="scss" scoped>
.chat {
    z-index: 96;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    height: 100%;
    width: 100%;

    .topbar {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        height: 65px;
        padding: 0 20px;
    }

    .placeholder {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px;
        color: $text-color;
        text-align: center;
        opacity: 0.2;

        ion-icon {
            padding-bottom: 5px;
            font-size: 30px;
        }

        .text {
            width: 50%;
            font-family: 'Montserrat-SemiBold';
            font-size: 15px;
        }
    }

    .messages {
        display: flex;
        flex-direction: column;
        gap: 15px;
        height: 100%;
        padding: 15px;
        overflow-y: auto;

        .message {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 5px;
            overflow: hidden;
            word-break: break-word;
            font-family: 'Montserrat-Regular';
            color: $text-color;

            .user {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 12px;
                opacity: 0.5;
            }
            
            &.right {
                align-self: flex-end;
                text-align: right;

                .user {
                    align-self: flex-end;
                }
            }
        }
    }

    .form {
        display: flex;
        gap: 5px;
        padding: 5px 10px;

        input {
            width: 100%;
        }
    }
}

@media only screen and (min-width: 768px) and (min-height: 768px) {
    .chat {
        width: $chat-width;
    }
}
</style>