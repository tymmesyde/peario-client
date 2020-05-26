<template>
    <div id="search" class="container">
        <Header></Header>

        <div class="inner">
            <div class="title">
                <h1>
                    <ion-icon name="search"></ion-icon>
                    {{ $t(`views.search.title`) }}
                </h1>
                <h3>{{ $t(`views.search.sub`) }}</h3>
            </div>

            <input type="text" class="large" v-model="search" placeholder="Parasite, Fight Club, ...">
            <ul class="segments" v-show="search">
                <li v-for="segment in segments" :key="segment" :class="{ 'active': selectedType === segment }" @click="selectedType = segment">{{ $t(`views.search.segments.${segment}`) }}</li>
            </ul>
            <ul class="list">
                <transition-group name="fade">
                    <li v-for="result in results[selectedType]" :key="result.imdb_id" @click="goToStream(result)">
                        <div class="poster">
                            <ion-icon name="image-outline" v-if="!result.poster"></ion-icon>
                            <img :src="result.poster" alt="poster" v-if="result.poster">
                        </div>
                        <div class="info">
                            <p class="name">{{ result.name }}</p>
                            <p class="year">{{ result.releaseInfo }}</p>
                        </div>
                    </li>
                </transition-group>
            </ul>
        </div>

        <Footer></Footer>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import StremioService from '@/services/stremio.service';

export default {
    name: 'Search',
    components: {
        Header,
        Footer
    },
    data() {
        return {
            search: '',
            segments: ['movies', 'series'],
            selectedType: 'movies',
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
            this.$router.push({ name: 'stream', params: { type, id: imdb_id } });
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../variables.scss';

#search {
    .title {
        text-align: center;
        margin-bottom: 4.5vh;

        h1 {
            margin-bottom: 0.5vh;
            margin-left: -4vh;

            ion-icon {
                font-size: 7vh;
                vertical-align: -0.75vh;
            }
        }
    }

    .list {
        max-height: 35vh;
        width: 55vh;
        overflow: hidden;
        overflow-y: auto;
        margin: auto;
        margin-top: 1.5vh;

        li {
            display: grid;
            grid-template-columns: 9vh auto;
            grid-column-gap: 1.5vh;
            padding: 1.5vh;
            margin-bottom: 0.5vh;
            border-radius: 1vh;
            cursor: pointer;
            transition: all 0.1s ease-in-out;
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

            &:hover {
                background-color: rgba(white, 0.05);
            }
        }
    }
}
</style>