<template>
    <div class="loading">
        <div>
            <ion-icon name="sync-outline" class="spin"></ion-icon>
            <Title type="secondary" :translate="`loading.${type}.title`" uppercase/>
            <p>{{ $t(`loading.${type}.message`) }}</p>
        </div>
    </div>
</template>

<script>
import Title from '@/components/ui/Title.vue';

export default {
    name: 'Loading',
    components: {
        Title
    },
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