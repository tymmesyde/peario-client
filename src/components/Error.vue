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
        z-index: 99;
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