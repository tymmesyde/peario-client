<template>
    <div class="users-list" :class="{ 'show': props.show }">
        <div class="count">
            <ion-icon name="eye-outline"></ion-icon> {{ props.users.length }}
        </div>

        <ul>
            <li v-for="user in props.users" :key="user.id">
                <div class="user" @mouseleave="openedActionsMenu = null">
                    <div :class="['info', { 'clickable': isUserOwner && user.id !== props.roomOwner }]">
                        <ion-icon name="ribbon" v-if="user.id === props.roomOwner"></ion-icon>
                        <ion-icon name="person" v-else></ion-icon>
                        {{ user.name }}
                    </div>
                </div>

                <div class="actions" v-if="isUserOwner && user.id !== props.roomOwner">
                    <Button clear small icon="ribbon" @click="updateOwnership(user.id)"/>
                </div>

                <div class="status" v-if="user.id === props.roomOwner">
                    <ion-icon class="success" name="play-outline" v-if="isPlayerPaused"></ion-icon>
                    <ion-icon class="danger" name="pause-outline" v-else></ion-icon>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import Button from "@/components/ui/Button.vue";

const emit = defineEmits(['onUpdateOwnership']);

const props = defineProps({
    show: Boolean,
    roomOwner: String,
    isUserOwner: Boolean,
    users: Array,
    isPlayerPaused: Boolean
});

const updateOwnership = (userId) => {
    emit('onUpdateOwnership', userId);
};

</script>

<style lang="scss" scoped>
.users-list {
    z-index: 96;
    position: absolute;
    top: 0.5em;
    left: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1.5em;
    padding-top: 1em;
    border-radius: 1em;
    opacity: 0;
    transition: opacity 0.2s ease-in;
    transition-delay: 0.3s;
    background-color: rgba($primary-color, 0.8);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 10px 0 rgba($primary-color, 0.5);

    &.show {
        opacity: 1;
    }

    .count {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Montserrat-Bold';
        font-size: 30px;
        font-weight: bold;
        color: $danger-color;
    }

    ul {
        max-height: 10em;
        display: flex;
        flex-direction: column;
        gap: 1.5em;
        padding-right: 1em;
        overflow-y: auto;

        li {
            display: flex;
            align-items: center;
            gap: 1em;
            font-family: 'Montserrat-Bold';
            font-size: 1.2em;
            color: rgba(255, 255, 255, 0.7);

            .user {
                position: relative;

                .info {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;

                    ion-icon {
                        font-size: 1.1em;
                    }
                }
            }

            .status {
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>