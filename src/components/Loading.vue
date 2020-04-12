<template>
    <div class="loading">
        <div>
            <ion-icon name="sync-outline" class="spin"></ion-icon>
            <h2>{{ $t(`loading.${type}.title`) }}</h2>
            <p>{{ $t(`loading.${type}.message`) }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        type: String
    }
}
</script>

<style lang="scss" scoped>
    @import '@/variables.scss';

    .loading {
        z-index: 98;
        position: absolute;
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;
        line-height: 3.5vh;
        background-color: black;

        ion-icon {
            font-size: 15vh;
        }
    }
</style>