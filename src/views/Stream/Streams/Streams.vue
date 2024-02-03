<template>
    <div class="streams">
        <ATitle class="streams-title" icon="play-outline" type="secondary" translate="views.stream.streams.title"/>

        <div class="content">
            <Segments :segments="addons" v-model="selectedAddon">
                <template #segment="{ segment }">
                    <span v-if="segment.id !== null">{{ segment.label }}</span>
                    <span v-else>{{ t(`views.stream.all`) }}</span>
                </template>
            </Segments>

            <div class="no-streams" v-show="!props.loading && !filteredStreams.length">
                <div>
                    <ion-icon name="sad"></ion-icon>
                    <p>{{ t(`views.stream.streams.error`) }}</p>
                </div>
            </div>

            <Loading class="loading" v-show="props.loading" />

            <List class="list" :items="filteredStreams" @click="streamClick" v-show="!props.loading && filteredStreams.length">
                <template #left="{ item }">
                    <div class="icon">
                        <img v-bind:src="item.icon" alt="">
                        <ion-icon class="outline" name="play-outline"></ion-icon>
                        <ion-icon class="filled" name="play"></ion-icon>
                    </div>
                </template>
                <template #right="{ item }">
                    <div class="info">
                        <div class="name" v-if="item.name">
                            <div class="small-icon">
                                <img v-bind:src="item.icon" alt="">
                            </div>
                            {{ item.name }}
                        </div>
                        <div class="title" :class="{ 'extend': !item.name }">{{ item.title }}</div>
                    </div>
                    <div class="type" v-if="item.type">{{ item.type }}</div>
                </template>
            </List>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import ATitle from '@/components/ui/Title.vue';
import Segments from '@/components/ui/Segments.vue';
import List from '@/components/ui/List.vue';
import Loading from '@/components/ui/Loading.vue';

const { t } = useI18n();

const props = defineProps({
    streams: Array,
    loading: Boolean,
});

const emit = defineEmits(['streamClick']);

const selectedAddon = ref(null);

const addons = computed(() => {
    const transportUrls = [...new Set(props.streams.map(({ addon }) => addon.transportUrl))];
    return transportUrls.length ? [
        { id: null },
        ...transportUrls
            .map((transportUrl) => {
                const stream = props.streams.find(({ addon }) => addon.transportUrl === transportUrl);
                return stream && stream.addon ? {
                    id: stream.addon.transportUrl,
                    label: stream.addon.manifest.name
                } : null;
            })
            .filter(addon => addon)
    ] : [];
});

const filteredStreams = computed(() => {
    return selectedAddon.value !== null ? props.streams.filter(({ addon }) => addon.transportUrl === selectedAddon.value) : props.streams;
});

const streamClick = (stream) => {
    emit('streamClick', stream);
};
</script>

<style lang="scss" scoped>
.streams {
    display: flex;
    flex-direction: column;

    .content {
        flex: none;
        margin-top: 1.5em;

        .no-streams {
            flex: none;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-family: 'Montserrat-Medium';
            color: $text-color;

            ion-icon {
                font-size: 50px;
                color: $text-color;
            }
        }

        .loading {
            height: 200px;
        }

        .list {
           :deep(.item) {
                align-items: flex-start;
                padding: 1.5em 15px;

                .icon {
                    display: none;
                    position: relative;
                    align-content: center;
                    height: 60px;
                    width: 60px;
                    overflow: hidden;
                    
                    > * {
                        transition: opacity 0.1s ease-in-out;
                        transition-delay: 0.1s;
                    }

                    img {
                        width: 100%;
                    }

                    ion-icon {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        margin: auto;
                        font-size: 45px;
                        opacity: 0;
                    }
                }

                .right-content {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    width: 100%;

                    .info {
                        display: flex;
                        flex-direction: column;
                        gap: 5px;

                        .name {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            gap: 0.5em;
                            font-family: 'Montserrat-SemiBold';

                            .small-icon {
                                height: 1.5em;
                                width: 1.5em;

                                img {
                                    width: 100%;
                                }
                            }
                        }

                        .title {
                            font-size: 15px;
                            opacity: 0.8;
                        }
                    }

                    .type {
                        flex: none;
                        height: 25px;
                        line-height: 25px;
                        align-self: flex-start;
                        background-color: rgba(white, 0.1);
                        padding: 0 11px;
                        border-radius: 25px;
                        font-family: 'Montserrat-Medium';
                        font-size: 11px;
                        user-select: none;
                    }
                }

                &:hover {
                    .icon {
                        img {
                            opacity: 0;
                        }

                        ion-icon.outline {
                            opacity: 1;
                        }
                    }

                    &:active {
                        .icon {
                            ion-icon.filled {
                                transition-delay: 0s;
                                opacity: 1;
                            }
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: 768px) and (min-height: 768px) {
    .streams {
        .list {
            .item {
                .icon {
                    display: flex !important;
                }

                .info {
                    .name {
                        .small-icon {
                            display: none !important;
                        }
                    }
                }
            }
        }
    }
}
</style>