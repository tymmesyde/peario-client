<template>
    <div class="error">
        <div>
            <ion-icon name="close-circle-outline" class="danger"></ion-icon>
            <Title type="secondary" :translate="`errors.${type}.title`" uppercase/>
            <p>{{ $t(`errors.${type}.message`) }}</p>
        </div>
    </div>
</template>

<script>
import Title from '@/components/ui/Title.vue';

export default {
    name: 'Error',
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

    .error {
        z-index: 99;
        position: absolute;
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;
        line-height: 3.5vh;
        background: $background-gradient;

        ion-icon {
            font-size: 15vh;
        }
    }
</style>