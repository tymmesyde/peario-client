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

<script src="./room.js"></script>
<style src="./room.scss" lang="scss" scoped></style>