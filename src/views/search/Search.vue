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

            <input type="text" v-model="search" placeholder="Parasite, Fight Club, ...">
            <ul class="list">
                <li v-for="result in results" :key="result.imdb_id" @click="$router.push({ name: 'stream', params: { type: 'movie', id: result.imdb_id } })">
                    <div class="poster">
                        <ion-icon name="image-outline" v-if="!result.poster"></ion-icon>
                        <img :src="result.poster" alt="poster" v-if="result.poster">
                    </div>
                    <div class="info">
                        <p class="name">{{ result.name }}</p>
                        <p class="year">{{ result.releaseInfo }}</p>
                    </div>
                </li>
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
            results: [],
            debouncer: null
        }
    },
    watch: {
        search(value) {
            clearTimeout(this.debouncer);
            this.debouncer = setTimeout(async () => {
                if (value.length) this.results = await StremioService.searchMovies(value);
                else this.results = [];
            }, 500);
        }
    }
}
</script>

<style lang="scss" scoped>
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
        margin-top: 2vh;
        border-radius: 2vh;
        background-color: rgba(0, 0, 0, 0.2);
        box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.1);

        li {
            display: grid;
            grid-template-columns: 9vh auto;
            grid-column-gap: 1.5vh;
            padding: 2vh;
            cursor: pointer;
            transition: all 0.1s ease-in-out;
            transition-delay: 0.05s;

            .poster {
                display: grid;
                align-content: center;
                height: 13vh;
                overflow: hidden;
                background-color: rgba(255, 255, 255, 0.1);
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
                background-color: rgba(0, 0, 0, 0.2);
            }
        }
    }
}
</style>