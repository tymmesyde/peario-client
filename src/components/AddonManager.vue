<template>
    <div id="addons">
        <transition name="fade">
            <div class="menu">
                <Title class="title" type="secondary" icon="cube-outline">ADDONS</Title>
                <div class="close" @click="close()">
                    <ion-icon name="close-outline"></ion-icon>
                </div>

                <div class="input-container">
                    <TextInput v-model="manifestUrl" placeholder="Paste addon manifest URL" @change="addFromURL()"></TextInput>
                </div>

                <ul>
                    <li class="addon" :class="{ active: isInstalled(addon) }" v-for="addon in collection" :key="addon.transportUrl" @click="toggleAddon(addon)">
                        <div class="icon"><img :src="addon.manifest.icon || addon.manifest.logo" alt=""></div>
                        <div class="info">
                            <div class="name">{{ addon.manifest.name }}</div>
                            <div class="types">
                                <span v-for="type in addon.manifest.types" :key="type">
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

        <div class="backdrop" @click="close()"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Title from '@/components/ui/Title.vue';
import TextInput from '@/components/ui/TextInput.vue';

export default {
    name: 'AddonManager',
    components: {
        Title,
        TextInput
    },
    props: {
        modelValue: Boolean
    },
    emits: ['update:modelValue'],
    data() {
        return {
            manifestUrl: ''
        }
    },
    computed: mapGetters(['collection', 'installed']),
    methods: {
        close() {
            this.$emit('update:modelValue', false);
        },
        capitalize(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        isInstalled(addon) {
            return this.installed.includes(addon.manifest.id);
        },
        toggleAddon(addon) {
            if (this.isInstalled(addon)) this.$store.dispatch('uninstallAddon', addon);
            else this.$store.dispatch('installAddon', addon);
        },
        async addFromURL() {
            this.$store.dispatch('addUserAddon', this.manifestUrl);
            this.$store.dispatch('loadAddons', this.manifestUrl);
            this.manifestUrl = '';
        }
    }
};
</script>

<style lang="scss" scoped>
$title-height: 9vh;
$input-container-height: 70px;
$menu-width: 45vh;
$menu-padding: 2vh;
$addon-icon-size: 8vh;

.backdrop {
    z-index: 97;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: black;
    opacity: 0.8;
    cursor: pointer;
}

#addons {
    z-index: 99;
}

.menu {
    z-index: 98;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    width: $menu-width;
    background-color: $background-color;
    overflow: hidden;

    .title {
        height: $title-height;
        line-height: $title-height;
        padding: 0 calc(#{$menu-padding} + 1vh);
    }

    .close {
        position: absolute;
        top: 2vh;
        right: 1vh;
        font-size: 4vh;
        cursor: pointer;
        transition: all 0.1s ease-in-out;

        &:hover {
            transform: scale(1.1);
        }
    }

    .input-container {
        height: $input-container-height;
        display: flex;
        justify-content: center;
        padding: 0 20px;

        input {
            width: 100%;
        }
    }

    ul {
        height: calc(100% - #{$title-height} - #{$input-container-height});
        overflow-y: auto;
        padding: 0 $menu-padding;
    }
}

.addon {
    display: grid;
    grid-template-columns: $addon-icon-size auto 3vh;
    column-gap: 1.5vh;
    margin-bottom: 2.5vh;
    color: $text-color;
    opacity: 0.7;
    user-select: none;
    cursor: pointer;
    transition: all 0.1s ease-in-out;

    &.active {
        opacity: 1;
    }

    &:not(.active):hover {
        opacity: 0.8;
    }

    .icon {
        display: grid;
        align-content: center;
        height: $addon-icon-size;
        width: $addon-icon-size;
        border-radius: 2vh;
        overflow: hidden;
        background-color: rgba(white, 0.1);

        img {
            width: 100%;
        }
    }

    .info {
        padding-top: 1vh;

        .name {
            font-size: 2vh;
            margin-bottom: 0.25vh;
        }

        .types {
            font-size: 1.5vh;
        }
    }

    .switch {
        font-size: 3vh;
        line-height: $addon-icon-size;
        text-align: right;

        .ion {
            vertical-align: 0 !important;
        }
    }
}
</style>