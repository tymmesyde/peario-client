<template>
    <div :class="[type, { 'uppercase': uppercase }]">
        <ion-icon :name="icon" v-if="icon"></ion-icon>
        {{ $t(translate) }}
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'Title',
    props: {
        type: {
            type: String,
            default: 'primary'
        },
        icon: String,
        translate: String,
        uppercase: Boolean
    }
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

.primary {
    margin: 0;
    font-family: 'Montserrat-SemiBold';
    font-size: 8vh;
    font-weight: normal;
    letter-spacing: -0.15rem;
    color: $text-color;

    ion-icon {
        font-size: 7vh;
        vertical-align: -0.75vh;
    }
}

.secondary {
    font-family: 'Montserrat';
    margin: 0;
    font-size: 3vh;
    font-weight: 700;
    user-select: none;
    color: $text-color;
}

.tertiary {
    font-family: 'Montserrat-MediumItalic';
    font-size: 2.75vh;
    font-weight: normal;
    margin: 0;
    opacity: 0.75;
    color: $text-color;
}

.uppercase {
    text-transform: uppercase;
}
</style>