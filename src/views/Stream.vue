<template>
	<div class="stream">
        <transition name="fade">
            <AddonManager v-model="openAddons" v-if="openAddons"></AddonManager>
        </transition>

        <div class="background">
            <div class="blur"></div>
            <div class="image" :style="`background-image: url(${meta.background})`"></div>
        </div>

        <div class="meta">
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
            <Segments :segments="seasons" v-model="selected.season">
                <template #segment="{ segment }">
                    <span v-if="segment > 0">{{ $t(`views.stream.season`) }} {{ segment }}</span>
                    <span v-else>{{ $t(`views.stream.misc`) }}</span>
                </template>
            </Segments>

            <List fixed class="list" v-model="selected.episode" :items="filterVideos" itemKey="id">
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

            <List class="list" :items="streams" itemKey="infoHash" @click="createRoom($event)" v-show="streams.length">
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
                    </div>
                </template>
            </List>
        </div>

        <Button large class="addons-button" icon="cube-outline" @click="openAddons = true">
            {{ $t('views.stream.streams.button') }}
        </Button>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

import router from '../router';

import StremioService from "@/services/stremio.service";
import AddonService from "@/services/addon.service";
import WebSocketService from "@/services/ws.service";

import AddonManager from '@/components/AddonManager.vue';
import Segments from '@/components/ui/Segments.vue';
import List from '@/components/ui/List.vue';
import Button from '@/components/ui/Button.vue';
import Title from '@/components/ui/Title.vue';

export default {
    name: 'Stream',
    components: {
        AddonManager,
        Segments,
        List,
        Button,
        Title
    },
    computed: {
        season() {
            return this.selected.season;
        },
        episode() {
            return this.selected.episode;
        },
        isSeries() {
            return this.meta.type === 'series';
        },
        filterVideos() {
            return this.meta.videos.filter(({ season }) => season === this.selected.season).sort((a, b) => a.episode - b.episode);
        },
        ...mapGetters(['collection', 'installed'])
    },
    data: () => {
        return {
            meta: {},
            seasons: [],
            selected: {
                season: 1,
                episode: null
            },
            streams: [],
            openAddons: false,
        }
    },
    watch: {
        season() {
            this.loadStreams();
        },
        episode() {
            router.replace({ path: this.selected.episode.id });
            this.loadStreams();
        },
        installed() {
            this.loadStreams();
        }
    },
    methods: {
        async loadStreams() {
            const { id, type } = this.$route.params;

            const installedAddons = this.collection.filter(addon => this.installed.includes(addon.manifest.id));
            this.streams = await AddonService.getStreams(installedAddons, type, id);
        },
        createRoom(stream) {
            WebSocketService.send('room.new', { stream, meta: this.meta });
            WebSocketService.events.on('room', payload => {
                const { id } = payload;
                this.$router.push({ name: 'room', params: { id } })
            });
        },
        parseSeason() {
            this.seasons = Array.from(new Set(this.meta.videos.map(({ season }) => season).sort((a, b) => a - b)));
            if (this.seasons.includes(0)) {
                const misc = this.seasons.shift();
                this.seasons.push(misc);
            }
        }
    },
    async mounted() {
        const { type, id } = this.$route.params;

        const parsed = id.split(':');
        const metaId = parsed[0];
        const seasonId = parseInt(parsed[1]);

        this.meta = type === 'movie' ? await StremioService.getMetaMovie(metaId) : await StremioService.getMetaSeries(metaId);

        if (this.meta.videos && this.meta.videos.length) {
            const episode = this.meta.videos.find(({ id: imdb_id }) => imdb_id === id) || this.meta.videos[0];

            this.selected = {
                season: seasonId || 1,
                episode
            };

            this.parseSeason();
        }

        this.loadStreams();
    }
};
</script>

<style lang="scss">
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
</style>