<template>
    <div class="search">
        <div class="header">
            <div class="title">
                <Title translate="views.search.title"/>
                <Title type="tertiary" translate="views.search.sub"/>
            </div>

            <TextInput large v-model="search" placeholder="Parasite, Fight Club, ..."/>
            <Segments :segments="types" v-model="type" v-show="!loading && search">
                <template #segment="{ segment }">
                    {{ $t(`views.search.segments.${segment}`) }}
                </template>
            </Segments>
        </div>

        <Loading class="loading" v-show="loading" />

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

<script setup>
import { ref, watch } from 'vue';
import router from '@/router';
import StremioService from '@/services/stremio.service';

import Title from '@/components/ui/Title.vue';
import TextInput from '@/components/ui/TextInput.vue';
import Segments from '@/components/ui/Segments.vue';
import List from '@/components/ui/List.vue';
import Loading from '@/components/ui/Loading.vue';

const loading = ref(false);
const search = ref('');
const type = ref('movies');
const types = ['movies', 'series'];
const results = ref({
    movies: [],
    series: []
});

let debouncer = null;
watch(search, (value) => {
    loading.value = true;
    clearTimeout(debouncer);
    debouncer = setTimeout(async () => {
        if (value.length) {
            results.value.movies = await StremioService.searchMovies(value);
            results.value.series = await StremioService.searchSeries(value);
        } else results.value = {
            movies: [],
            series: []
        };
        loading.value = false;
    }, 250);
});

const goToStream = ({ type, imdb_id }) => {
    router.push({ name: 'stream', params: { type, id: imdb_id } });
};
</script>

<style lang="scss" scoped>
.search {
    position: relative;

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
            align-items: flex-start;
            gap: 15px;
        }
    }

    .loading {
        z-index: 0;
        position: absolute;
        height: 12rem;
    }

    .list {
        position: relative;
        z-index: 0;

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