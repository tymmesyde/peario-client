<template>
    <div id="search" class="container">
        <div class="inner">
            <div class="headline">
                <Title icon="search" translate="views.search.title"/>
                <Title type="tertiary" translate="views.search.sub"/>
            </div>

            <div class="search">
                <TextInput type="large" v-model="search" placeholder="Parasite, Fight Club, ..."/>
                <Segments :segments="types" v-model="type" v-show="search">
                    <template #segment="{ segment }">
                        {{ $t(`views.search.segments.${segment}`) }}
                    </template>
                </Segments>

                <List :items="results[type]" itemClass="item" itemKey="id" @click="goToStream($event)" #default="{ item }">
                    <div class="poster">
                        <ion-icon name="image-outline" v-if="!item.poster"></ion-icon>
                        <img :src="item.poster" alt="poster" v-if="item.poster">
                    </div>
                    <div class="info">
                        <p class="name">{{ item.name }}</p>
                        <p class="year">{{ item.releaseInfo }}</p>
                    </div>
                </List>
            </div>
        </div>
    </div>
</template>

<script>
import router from '../router';

import StremioService from '@/services/stremio.service';
import Title from '@/components/ui/Title.vue';
import TextInput from '@/components/ui/TextInput.vue';
import Segments from '@/components/ui/Segments.vue';
import List from '@/components/ui/List.vue';

export default {
    name: 'Search',
    components: {
        Title,
        TextInput,
        Segments,
        List
    },
    data() {
        return {
            search: '',
            type: 'movies',
            types: ['movies', 'series'],
            results: {
                movies: [],
                series: []
            },
            debouncer: null
        }
    },
    watch: {
        search(value) {
            clearTimeout(this.debouncer);
            this.debouncer = setTimeout(async () => {
                if (value.length) {
                    this.results.movies = await StremioService.searchMovies(value);
                    this.results.series = await StremioService.searchSeries(value);
                }
                else this.results = [];
            }, 250);
        }
    },
    methods: {
        goToStream({ type, imdb_id }) {
            router.push({ name: 'stream', params: { type, id: imdb_id } });
        }
    }
}
</script>

<style lang="scss">
@import '../variables.scss';

#search {
    .headline {
        text-align: center;
        margin-bottom: 4.5vh;
    }

    .segments {
        margin-top: 2vh;
    }

    .list {
        max-height: 35vh;

        .item {
            display: grid;
            grid-template-columns: 9vh auto;
            grid-column-gap: 1.5vh;
            padding: 1.5vh;
            margin-bottom: 0.5vh;
            transition-delay: 0.05s;

            .poster {
                display: grid;
                align-content: center;
                height: 13vh;
                overflow: hidden;
                background-color: rgba(white, 0.1);
                border-radius: 0.5vh;

                ion-icon {
                    font-size: 5vh;
                    opacity: 0.8;
                    margin: auto;
                }

                img {
                    width: 100%;
                }
            }
            
            .info {
                margin-top: 1vh;

                .name {
                    font-size: 2.2vh;
                    margin-bottom: 0.5vh;
                }

                .year {
                    font-size: 1.75vh;
                    font-style: italic;
                }
            }
        }
    }
}
</style>