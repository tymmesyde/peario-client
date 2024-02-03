<template>
    <div :class="['title', props.type]">
        <ion-icon :name="props.icon" v-if="props.icon"></ion-icon>
        {{ translate ? $t(translate) : '' }}
        <slot></slot>
    </div>
</template>

<script setup>
const props = defineProps({
    type: {
        type: String,
        default: 'primary',
    },
    icon: String,
    translate: String,
});
</script>

<style lang="scss" scoped>
.title {
    display: flex;
    align-items: center;
    gap: 10px;   
    margin: 0;
    color: $text-color;

    &.primary {
        font-family: 'Montserrat-Bold';
        font-size: 8vh;
        font-weight: normal;
        letter-spacing: -0.15rem;
        line-height: 100%;

        ion-icon {
            font-size: 7vh;
            vertical-align: -0.75vh;
        }
    }

    &.secondary {
        font-family: 'Montserrat-Regular';
        font-size: 28px;
        font-weight: 700;
        user-select: none;
        text-transform: uppercase;
    }

    &.tertiary {
        font-family: 'Montserrat-Medium';
        font-size: 2.75vh;
        font-weight: normal;
        opacity: 0.75;
    }
}
</style>