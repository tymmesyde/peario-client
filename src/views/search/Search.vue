<template>
    <div id="search" class="container">
        <Header></Header>

        <div class="inner">
            <h1>
                <ion-icon name="search"></ion-icon>
                Search
            </h1>
            <h3>Find a movie to watch with your 🍐 !</h3>

            <input type="text" v-model="search">
            <ul class="list">
                <li v-for="result in results" :key="result.imdb_id" @click="$router.push({ name: 'stream', params: { type: 'movie', id: result.imdb_id } })">
                    <img :src="result.poster" alt="poster">
                    {{ result.name }}
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
            results: []
        }
    },
    watch: {
        async search(value) {
            if (value.length) this.results = await StremioService.searchMovies(value);
            else this.results = [];
        }
    }
}
</script>

<style lang="scss" scoped>
#search {
    .list {
        max-height: 20vh;
        overflow: hidden;
        overflow-y: auto;

        li {
            display: grid;
            grid-template-columns: 9vh auto;
            grid-column-gap: 1vh;
            cursor: pointer;

            img {
                width: 100%;
            }
        }
    }
}
</style>