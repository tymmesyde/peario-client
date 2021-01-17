<template>
    <div class="chat">
        <div class="heading">
            <div class="title">
                <ion-icon name="chatbubbles-outline"></ion-icon>
                Chat
            </div>
            <Button class="close" icon="close" @click="$emit('close')"></Button>
        </div>
        <Info icon="rainy-outline" v-if="!room.messages.length">
            Oooh empty ...
        </Info>
        <div ref="messages" class="messages">
            <div :class="['message', { 'right': message.peer === sharedState.identity.id }]" v-for="message in room.messages" :key="message">
                <div class="peer">
                    <ion-icon name="person-circle-outline" v-if="message.peer === room.owner"></ion-icon>
                    {{ message.peer }}
                </div>
                <div class="content">{{ message.content }}</div>
            </div>
        </div>
        <div class="inputs">
            <textarea v-model="textarea" spellcheck="false" placeholder="Send a message" @keydown.enter="sendMessage"></textarea>
            <Button icon="send" @click="sendMessage"></Button>
        </div>
    </div>
</template>

<script>
import Info from './Info.vue';
import Button from './Button.vue';
import IpfsService from '../services/ipfs';

export default {
    name: 'Chat',
    events: ['close'],
    components: {
        Info,
        Button
    },
    data() {
        return {
            sharedState: IpfsService.state,
            textarea: ''
        }
    },
    computed: {
        room() {
            return this.sharedState.room;
        },
        messages() {
            return this.sharedState.room.messages.length;
        }
    },
    watch: {
        messages() {
            const el = this.$refs.messages;
            el.scrollTop = el.scrollHeight;
        },
        textarea() {
            
        }
    },
    methods: {
        sendMessage() {
            IpfsService.sendMessage(this.textarea);
            this.textarea = '';
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.chat {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    height: 100%;
    width: 350px;
    background-color: #0a0811;

    $chat-padding: 20px;

    .heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $chat-padding $chat-padding;

        .title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Montserrat-Bold';
            font-size: 25px;
            color: white;
            user-select: none;
        }

        .close {
            opacity: 0;
        }
    }

    .messages {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 20px;
        padding: 10px $chat-padding $chat-padding $chat-padding;
        overflow-y: auto;

        .message {
            max-width: 90%;
            display: flex;
            flex-direction: column;
            gap: 5px;

            &.right {
                align-self: flex-end;
                align-items: flex-end;
            }

            .peer {
                width: 60%;
                font-family: 'Montserrat-SemiBold';
                font-size: 12px;
                color: white;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                opacity: 0.5;

                ion-icon {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 2px;
                    flex-shrink: 0;
                    font-size: 15px;
                }
            }

            .content {
                font-family: 'Montserrat-Regular';
                font-size: 15px;
                color: white;
            }
        }
    }

    .inputs {
        height: 50px;
        width: 100%;
        display: flex;

        textarea {
            flex: 1;
            border: 0;
            padding: 0 15px;
            padding-top: 15px;
            outline: none;
            font-family: 'Montserrat-Regular';
            font-size: 15px;
            color: white;
            background-color: rgba(white, 0.05);
            resize: none;
        }

        button {
            height: 100%;
            width: 45px;
            border-radius: 0;
        }
    }
}

@media only screen and (max-width: 768px) {
    .chat {
        position: absolute;
        left: 0;
        right: 0;
        width: 100% !important;

        .close {
            opacity: 1 !important;
        }
    }
}
</style>