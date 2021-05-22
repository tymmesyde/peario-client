<template>
	<div id="stream" class="container">
		<AddonManager v-model="openAddons" v-if="openAddons"></AddonManager>

		<div class="inner center col-10">
			<div class="meta col-6">
				<div class="poster col-5">
					<img :src="meta.poster" alt="">
				</div>
				<div class="info col-7">
					<div class="title">{{ meta.name }}</div>
					<div class="year">{{ meta.year }}</div>
					<div class="runtime">{{ meta.runtime }}</div>
					<div class="description">{{ meta.description }}</div>
					<div class="genres">
						<div class="genre" v-for="genre of meta.genre" :key="genre">
							{{ genre }}
						</div>
					</div>
				</div>
			</div>

			<div class="series col-3" v-if="isSeries">
				<Segments :segments="seasons" v-model="selected.season">
					<template #segment="{ segment }">
						<span v-if="segment > 0">{{ $t(`views.stream.season`) }} {{ segment }}</span>
						<span v-else>{{ $t(`views.stream.misc`) }}</span>
					</template>
				</Segments>

				<List class="episodes" v-model="selected.episode" itemClass="episode" :items="filterVideos" itemKey="id" #default="{ item }">
					<div class="number">{{ item.episode }}</div>
					<div class="name">{{ item.name }}</div>
				</List>
			</div>

			<div class="streams col-3">
				<Title class="streams-title" icon="play-outline" type="secondary" translate="views.stream.streams.title"/>

				<div class="no-streams" v-show="!streams.length">
					<div>
						<ion-icon name="sad"></ion-icon>
						<p>{{ $t(`views.stream.streams.error`) }}</p>
					</div>
				</div>

				<List class="episodes" itemClass="stream" :items="streams" itemKey="infoHash" #default="{ item }" @click="createRoom($event)" v-show="streams.length">
					<div class="icon">
						<img v-bind:src="item.icon" alt="">
						<ion-icon class="outline" name="play-outline"></ion-icon>
						<ion-icon class="filled" name="play"></ion-icon>
					</div>
					<div class="name" v-if="item.name">{{ item.name }}</div>
					<div class="title" :class="{ 'extend': !item.name }">{{ item.title }}</div>
				</List>

				<Button icon="cube-outline" translate="views.stream.streams.button" @click="openAddons = true"/>
			</div>
		</div>
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
$stream-icon-size: 7vh;

#stream {
    font-family: 'Montserrat';

    .meta {
        .poster {
            padding-left: 0;
            overflow: hidden;
            user-select: none;

            img {
                width: 100%;
                box-shadow: 0 0.5vh 1.5vh 0vh rgba(0, 0, 0, 0.5);
            }
        }

        .info {
            padding-right: 0;
            color: $text-color;

            .title {
                font-size: 6vh;
                font-weight: 600;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-left: -0.25vh;
                margin-bottom: 0.5vh;
            }

            .year, .runtime {
                display: inline-block;
            }

            .year {
                font-size: 2vh;
                margin-bottom: 1vh;
            }

            .runtime {
                margin-left: 2.5vh;
            }

            .description {
                opacity: 0.5;
            }

            .genres {
                margin-top: 2vh;
                user-select: none;

                .genre {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 1vh;
                    margin-bottom: 1vh;
                    padding: 0.5vh 1.5vh;
                    border-radius: 3vh;
                    background-color: rgba(white, 0.1);
                }
            }
        }
    }

    .series {
        .segments {
            margin-top: 0;
        }

        .episodes {
            overflow: auto;

            .episode {
                display: flex;
                align-items: center;
                height: 4vh;
                padding: 0 1.5vh;

                .number {
                    font-family: 'Montserrat-SemiBold';
                    font-size: 1.75vh;
                    margin-right: 1vh;
                }

                .name {
                    font-size: 1.5vh;
                    white-space: pre;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    opacity: 0.5;
                }

                & > * {
                    display: inline-block;
                    vertical-align: middle;
                }
            }
        }
    }

    .streams {
        .streams-title {
            margin-bottom: 1vh;
        }

        .no-streams {
            height: 50vh;
            display: grid;
            align-items: center;
            justify-content: center;
            text-align: center;

            ion-icon {
                font-size: 7vh;
                color: $text-color;
                margin-bottom: 1vh;
            }
        }

        ul {
            padding-right: 1vh;
            padding-bottom: 1vh;

            .stream {
                height: 10vh;
                display: grid;
                grid-template-columns: $stream-icon-size 9vh auto;
                column-gap: 1.5vh;
                padding: 1.5vh;
                border-radius: 1vh;
                overflow: hidden;
                user-select: none;

                .icon {
                    position: relative;
                    display: grid;
                    align-content: center;
                    height: $stream-icon-size;
                    width: $stream-icon-size;
                    border-radius: 2vh;
                    overflow: hidden;
                    background-color: rgba(white, 0.1);
                    
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
                        font-size: 4.5vh;
                        opacity: 0;
                    }
                }

                .name {
                    font-family: 'Montserrat-SemiBold';
                    font-size: 1.75vh;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    align-self: center;
                }

                .title {
                    white-space: pre;
                    overflow: hidden;
                    align-self: center;
                    font-size: 1.5vh;
                    text-overflow: ellipsis;
                    opacity: 0.5;

                    &.extend {
                        grid-column-start: 2;
                        grid-column-end: 4;
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

        button {
            width: 100%;
        }
    }
}
</style>