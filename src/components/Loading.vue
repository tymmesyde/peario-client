<template>
    <div class="loading">
        <div class="content">
            <ion-icon name="sync-outline" class="icon spin"></ion-icon>
            <ATitle type="secondary" :translate="`loading.${type}.title`"/>
            <div class="message">
                {{ $t(`loading.${type}.message`) }}
            </div>
        </div>
    </div>
</template>

<script>
import ATitle from '@/components/ui/Title.vue';

export default {
    name: 'Loading',
    components: {
        ATitle
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
            font-size: 5rem;
            --ionicon-stroke-width: 20px;
        }

        .message {
            font-family: 'Montserrat-Medium';
            font-size: 20px;
            color: $text-color;
            opacity: 0.5;
        }
    }
}
</style>