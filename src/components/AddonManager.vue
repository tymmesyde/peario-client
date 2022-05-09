<template>
    <div id="addons">
        <div class="menu">
            <Title class="title" type="secondary" icon="cube-outline">ADDONS</Title>
            <div class="close" @click="close()">
                <ion-icon name="close-outline"></ion-icon>
            </div>

            <div class="filters-container">
                <TextInput v-model="manifestUrl" placeholder="Paste addon manifest URL" @change="addFromURL()"></TextInput>
                <Segments :segments="types" v-model="type">
                    <template #segment="{ segment }">
                        {{ $t(`components.addons.types.${segment}`) }}
                    </template>
                </Segments>
            </div>

            <ul>
                <li class="addon" :class="{ active: isInstalled(addon) }" v-for="addon in collection[type]" :key="addon.transportUrl" @click="toggleAddon(addon)">
                    <div class="info">
                        <div class="icon">
                            <img :src="addon.manifest.icon || addon.manifest.logo" alt="" v-if="addon.manifest.icon || addon.manifest.logo">
                            <ion-icon name="cube-outline" v-else></ion-icon>
                        </div>
                        <div class="text">
                            <div class="name">{{ addon.manifest.name }}</div>
                            <div class="types">
                                <span v-for="type in addon.manifest.types" :key="type">
                                    {{ capitalize(type) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="switch">
                        <ion-icon name="toggle-outline" class="off flip" v-show="!isInstalled(addon)"></ion-icon>
                        <ion-icon name="toggle" class="on" v-show="isInstalled(addon)"></ion-icon>
                    </div>
                </li>
            </ul>
        </div>

        <div class="backdrop" @click="close()"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Title from '@/components/ui/Title.vue';
import TextInput from '@/components/ui/TextInput.vue';
import Segments from '@/components/ui/Segments.vue';

export default {
    name: 'AddonManager',
    components: {
        Title,
        TextInput,
        Segments
    },
    props: {
        modelValue: Boolean
    },
    emits: ['update:modelValue'],
    data() {
        return {
            manifestUrl: '',
            type: 'streams',
            types: ['streams', 'subtitles']
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
            return this.installed.includes(addon.transportUrl);
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
    position: absolute;
}

.menu {
    z-index: 98;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: rgba($primary-color, 0.8);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 10px 0 rgba($primary-color, 0.5);
    overflow: hidden;

    .title {
        height: 4em;
        line-height: 4em;
        padding: 0 1em;
    }

    .close {
        position: absolute;
        top: 0.8em;
        right: 0.5em;
        font-size: 2.5em;
        color: $text-color;
        cursor: pointer;
        transition: all 0.1s ease-in-out;

        &:ho1er {
            transform: scale(1.1);
        }
    }

    .filters-container {
        display: flex;
        flex: 1 0 auto;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        padding: 0 20px;

        input {
            width: 100%;
        }
    }

    ul {
        flex: 1 1 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
        overflow-y: auto;
        padding: 0 1.5em;
        padding-bottom: 1.5em;

        .addon {
            display: flex;
            justify-content: space-between;
            color: $text-color;
            user-select: none;
            cursor: pointer;
            transition: all 0.1s ease-in-out;

            &.active {
                opacity: 1;
            }

            &:not(.active):hover {
                opacity: 0.7;
            }

            .info {
                display: flex;
                align-items: center;
                gap: 15px;

                .icon {
                    display: grid;
                    align-content: center;
                    justify-content: center;
                    height: 3em;
                    width: 3em;
                    border-radius: 15px;
                    font-size: 30px;
                    overflow: hidden;
                    background-color: rgba(white, 0.1);

                    img {
                        width: 100%;
                    }
                }

                .text {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5em;

                    .name {
                        font-family: 'Montserrat-SemiBold';
                        font-size: 1.2em;
                    }

                    .types {
                        display: flex;
                        gap: 5px;

                        span {
                            display: flex;
                            align-items: center;
                            height: 2.5em;
                            background-color: rgba(white, 0.1);
                            padding: 0 12px;
                            border-radius: 2.5em;
                            font-family: 'Montserrat-SemiBold';
                            font-size: 10px;
                            user-select: none;
                        }
                    }
                }
            }

            .switch {
                display: flex;
                align-items: center;
                font-size: 2em;

                ion-icon {
                    &.on {
                        color: $accent-color;
                    }

                    &.off {
                        opacity: 0.5;
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: 768px) and (min-height: 768px) {
    .menu {
        width: 30em;
    }
}
</style>