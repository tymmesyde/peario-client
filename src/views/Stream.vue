<template>
	<div class="stream">
        <transition name="fade">
            <AddonManager v-model="isAddonsMenuOpen" v-if="isAddonsMenuOpen"></AddonManager>
        </transition>

        <div class="background">
            <div class="blur"></div>
            <div class="image" :style="`background-image: url(${meta.background})`" v-if="meta && meta.background"></div>
        </div>

        <div class="meta" v-if="meta">
            <img class="logo" :src="meta.logo" alt="" v-if="meta.logo">
            <div class="title" v-else>{{ meta.name }}</div>

            <div class="details">
                <div class="year">{{ meta.year }}</div>
                <div class="runtime">{{ meta.runtime }}</div>
            </div>

            <div class="description">{{ meta.description }}</div>

            <div class="tags">
                <div class="tag" v-for="genre in meta.genres" :key="genre">
                    {{ genre }}
                </div>
            </div>
        </div>

        <div class="series" v-if="isSeries">
            <Segments :segments="seasons" v-model="selectedSeason">
                <template #segment="{ segment }">
                    <span v-if="segment > 0">{{ $t(`views.stream.season`) }} {{ segment }}</span>
                    <span v-else>{{ $t(`views.stream.misc`) }}</span>
                </template>
            </Segments>

            <List fixed class="list" v-model="selectedEpisode" :items="episodes" itemKey="id">
                <template #left="{ item }">
                    <div class="number">{{ item.episode }}</div>
                </template>
                <template #right="{ item }">
                    <div class="name">{{ item.name }}</div>
                </template>
            </List>
        </div>

        <div class="streams">
            <Title class="streams-title" icon="play-outline" type="secondary" translate="views.stream.streams.title"/>

            <div class="no-streams" v-show="!streams.length">
                <div>
                    <ion-icon name="sad"></ion-icon>
                    <p>{{ $t(`views.stream.streams.error`) }}</p>
                </div>
            </div>

            <List class="list" :items="streams" @click="createRoom($event)" v-show="streams.length">
                <template #left="{ item }">
                    <div class="icon">
                        <img v-bind:src="item.icon" alt="">
                        <ion-icon class="outline" name="play-outline"></ion-icon>
                        <ion-icon class="filled" name="play"></ion-icon>
                    </div>
                </template>
                <template #right="{ item }">
                    <div class="info">
                        <div class="name" v-if="item.name">{{ item.name }}</div>
                        <div class="title" :class="{ 'extend': !item.name }">{{ item.title }}</div>
                        <div class="type" v-if="item.type">{{ item.type }}</div>
                    </div>
                </template>
            </List>
        </div>

        <Button large class="addons-button" icon="cube-outline" @click="isAddonsMenuOpen = true">
            {{ $t('views.stream.streams.button') }}
        </Button>
	</div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import store from '@/store';
import router from '@/router';

import StremioService from "@/services/stremio.service";
import AddonService from "@/services/addon.service";
import ClientService from "@/services/client.service";

import AddonManager from '@/components/AddonManager.vue';
import Segments from '@/components/ui/Segments.vue';
import List from '@/components/ui/List.vue';
import Button from '@/components/ui/Button.vue';
import Title from '@/components/ui/Title.vue';

const meta = ref({});
const seasons = ref([]);
const selectedSeason = ref(1);
const selectedEpisode = ref(null);
const streams = ref([]);
const isAddonsMenuOpen = ref(false);

const clientRoomState = computed(() => store.state.client.room);
const collectionState = computed(() => store.state.addons.collection);
const installedAddonsState = computed(() => store.state.addons.installed);

const isSeries = computed(() => meta.value && meta.value.type === 'series');
const episodes = computed(() => meta.value && meta.value.videos && meta.value.videos.filter((video) => video.season === selectedSeason.value).sort((a, b) => a.episode - b.episode));

let loadStreamsDebouncer = null;
const loadStreams = () => {
    clearTimeout(loadStreamsDebouncer);
    loadStreamsDebouncer = setTimeout(async () => {
        const { id, type } = router.currentRoute.value.params;
        if (id && type) {
            const installedAddons = collectionState.value && collectionState.value.streams.filter(addon => installedAddonsState.value.includes(addon.manifest.id));
            if (installedAddons)
                streams.value = await AddonService.getStreams(installedAddons, type, id);
        }
    }, 250);
};

const createRoom = (stream) => {
    ClientService.send('room.new', { stream, meta: meta.value });
};

watch(installedAddonsState, () => loadStreams());
watch(selectedSeason, () => loadStreams());
watch(selectedEpisode, (value) => {
    router.replace({ path: value.id });
    loadStreams();
});
watch(clientRoomState, ({ id }) => {
    router.push({ name: 'room', params: { id } });
});

onMounted(async () => {
    const { type, id } = router.currentRoute.value.params;

    if (id && type) {
        const [metaId, seasonIndex] = id.split(':');
        meta.value = type === 'movie' ? await StremioService.getMetaMovie(metaId) : await StremioService.getMetaSeries(metaId);

        if (meta.value && meta.value.videos && meta.value.videos.length) {
            const episode = meta.value.videos.find(({ id: imdb_id }) => imdb_id === id) || meta.value.videos[0];
            selectedSeason.value = parseInt(seasonIndex) || 1;
            selectedEpisode.value = episode;

            seasons.value = [...new Set(meta.value.videos.map(({ season }) => season))].sort((a, b) => {
                if (a === 0) return 1;
                if (b === 0) return -1;
                else return a - b;
            })
        }

        loadStreams();
    }
});
</script>

<style lang="scss" scoped>
.stream {
    display: flex;
    flex-direction: column;
    gap: 30px;

    .background {
        z-index: -1;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        .blur, .image {
            position: absolute;
            height: 100%;
            width: 100%;
        }

        .blur {
            z-index: 1;
            backdrop-filter: blur(100px);
            background-color: rgba($primary-color, 0.5);
        }

        .image {
            background-size: cover;
        }
    }

    .meta {
        display: flex;
        flex-direction: column;
        gap: 10px;
        color: white;

        .logo {
            display: block;
            width: 250px;
            user-select: none;
        }

        .title {
            font-family: 'Montserrat-Bold';
            font-size: 45px;
        }

        .details {
            display: flex;
            gap: 10px;
            font-family: 'Montserrat-MediumItalic';
            font-size: 15px;
            opacity: 0.7;
        }

        .description {
            font-family: 'Montserrat-Regular';
            font-size: 18px;
        }

        .tags {
            display: flex;
            gap: 10px;

            .tag {
                height: 30px;
                line-height: 30px;
                background-color: rgba(white, 0.1);
                padding: 0 12px;
                border-radius: 30px;
                font-family: 'Montserrat-Medium';
                font-size: 15px;
                user-select: none;
            }
        }
    }

    .streams {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .no-streams {
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

        .list {
            .item {
                $stream-icon-size: 60px;

                .icon {
                    position: relative;
                    display: grid;
                    align-content: center;
                    height: $stream-icon-size;
                    width: $stream-icon-size;
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

                .info {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;

                    .name {
                        font-family: 'Montserrat-SemiBold';
                    }

                    .title {
                        font-size: 15px;
                        opacity: 0.8;
                    }

                    .type {
                        position: absolute;
                        right: 1em;
                        top: 1em;
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

    .addons-button {
        position: sticky;
        bottom: 15px;
    }
}

@supports not (backdrop-filter: none) {
  .stream {
    .background {
        .image {
            filter: blur(100px);
        }
    }
  }
}
</style>