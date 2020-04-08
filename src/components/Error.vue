<template>
    <div class="error">
        <div>
            <ion-icon name="close-circle-outline" class="danger"></ion-icon>
            <h2>{{ $t(`errors.${type}.title`) }}</h2>
            <p>{{ $t(`errors.${type}.message`) }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error',
    props: {
        type: String
    }
}
</script>

<style lang="scss" scoped>
    @import '@/variables.scss';

    .error {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;
        line-height: 3.5vh;

        ion-icon {
            font-size: 15vh;
        }
    }
</style>