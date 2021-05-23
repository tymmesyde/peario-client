<template>
    <div class="search">
        <div class="header">
            <div class="title">
                <Title translate="views.search.title"/>
                <Title type="tertiary" translate="views.search.sub"/>
            </div>

            <TextInput large v-model="search" placeholder="Parasite, Fight Club, ..."/>
            <Segments :segments="types" v-model="type" v-show="search">
                <template #segment="{ segment }">
                    {{ $t(`views.search.segments.${segment}`) }}
                </template>
            </Segments>
        </div>
    
        <List class="list" :items="results[type]" itemKey="id" @click="goToStream($event)">
            <template #left="{ item }">
                <div class="poster" :style="`background-image: url(${item.poster})`">
                    <ion-icon name="image-outline" v-if="!item.poster"></ion-icon>
                </div>
            </template>
            <template #right="{ item }">
                <div class="info">
                    <span class="name">{{ item.name }}</span>
                    <span class="year">{{ item.releaseInfo }}</span>
                </div>
            </template>
        </List>
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

<style lang="scss" scoped>
.search {
    .header {
        z-index: 97;
        top: 0;
        position: sticky;
        display: flex;
        flex-direction: column;
        gap: 30px;
        background-color: $primary-color;

        .title {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
    }

    .list {
        .item {
            .poster {
                display: grid;
                align-content: center;
                height: 150px;
                width: 100px;
                overflow: hidden;
                background-color: rgba(white, 0.1);
                background-size: cover;
                border-radius: 5px;

                ion-icon {
                    font-size: 30px;
                    opacity: 0.8;
                    margin: auto;
                }
            }
            
            .info {
                display: flex;
                flex-direction: column;
                gap: 5px;

                .name {
                    font-family: 'Montserrat-Bold';
                    font-size: 20px;
                }

                .year {
                    font-family: 'Montserrat-Medium';
                    font-size: 15px;
                    font-style: italic;
                }
            }
        }
    }
}
</style>