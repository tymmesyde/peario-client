<template>
    <div class="loading">
        <div class="content">
            <ion-icon name="sync-outline" class="icon spin"></ion-icon>
            <Title type="secondary" :translate="`loading.${type}.title`"/>
            <div class="message">
                {{ $t(`loading.${type}.message`) }}
            </div>
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
.loading {
    z-index: 98;
    position: absolute;
    top: 0;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: $text-color;
    background-color: black;

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        .icon {
            font-size: 15vh;
            --ionicon-stroke-width: 20px;
        }

        .message {
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
            font-size: 20px;
            color: $text-color;
            opacity: 0.5;
        }
    }
}
</style>
