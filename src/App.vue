<template>
    <Header></Header>

    <div class="view-container">
        <div class="inner">
            <Loading v-if="loading">
                Loading ...
            </Loading>
            <router-view v-else></router-view>
        </div>
    </div>
</template>

<script>
import Header from './components/Header';
import Loading from './components/Loading';
import AddonsService from './services/addons';
import IpfsService from './services/ipfs';

export default {
    name: 'App',
    components: {
        Header,
        Loading
    },
    data() {
        return {
            loading: true
        }
    },
    methods: {
        async loadServices() {
            await Promise.all([
                IpfsService.init(),
                AddonsService.init()
            ]);
            this.loading = false;
        }
    },
    mounted() {
        this.loadServices();
    }
}
</script>

<style lang="scss">
@import './main.scss';

#app {
    min-height: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.view-container {
    height: calc(100vh - #{$header-height});
    width: 100%;
    overflow-y: auto;

    .inner {
        display: flex;
        flex-direction: column;
        gap: 30px;
        margin: auto;
        padding: 15px 30px;
    }
}

@media only screen and (min-width: 768px) {
    .view-container {
        .inner {
            width: $inner-width;
            padding: 0;
        }
    }
}
</style>
