<template>
    <div id="addons">
        <transition name="fade">
            <div class="menu" v-if="isOpen">
                <Title class="title" type="secondary" icon="cube-outline">ADDONS</Title>
                <div class="close" v-on:click="isOpen = false">
                    <ion-icon name="close-outline"></ion-icon>
                </div>

                <div class="input-container">
                    <TextInput v-model="manifestUrl" placeholder="Paste addon manifest URL" @change="addFromURL()"></TextInput>
                </div>

                <ul v-if="isOpen">
                    <li class="addon" v-bind:class="{ active: isInstalled(addon) }" v-for="addon in collection" v-bind:key="addon.transportUrl" v-on:click="toggleAddon(addon)">
                        <div class="icon"><img v-bind:src="addon.manifest.icon || addon.manifest.logo" alt=""></div>
                        <div class="info">
                            <div class="name">{{ addon.manifest.name }}</div>
                            <div class="types">
                                <span v-for="type in addon.manifest.types" v-bind:key="type">
                                    {{ capitalize(type) }}
                                </span>
                            </div>
                        </div>
                        <div class="switch">
                            <ion-icon name="toggle-outline" class="flip" v-show="!isInstalled(addon)"></ion-icon>
                            <ion-icon name="toggle" v-show="isInstalled(addon)"></ion-icon>
                        </div>
                    </li>
                </ul>
            </div>
        </transition>

        <div class="backdrop" v-if="isOpen" v-on:click="isOpen = false"></div>
    </div>
</template>

<script src="./addonManager.js"></script>
<style src="./addonManager.scss" lang="scss" scoped></style>