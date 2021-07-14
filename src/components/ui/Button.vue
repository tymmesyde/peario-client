<template>
    <button :class="[{ 'large': large, 'clear': clear }]" @click="$emit('update:modelValue', !modelValue)">
        <ion-icon :name="icon" v-if="icon"></ion-icon>
        <span v-if="translate">
            {{ $t(translate) }}
        </span>
        <slot v-else></slot>
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        modelValue: Boolean,
        icon: String,
        large: Boolean,
        clear: Boolean,
        translate: String
    }
}
</script>

<style lang="scss" scoped>
button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    border: 2px solid transparent;
    border-radius: 10px;
    padding: 0 15px;
    font-family: 'Montserrat-Bold';
    font-size: 15px;
    text-transform: uppercase;
    color: $primary-color;
    background-color: $accent-color;
    user-select: none;
    outline: none;
    cursor: pointer;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.1s ease-in-out;

    ion-icon {
        font-size: 20px;
    }

    &.large {
        height: 65px;
        width: 100%;
        font-size: 24px;

        ion-icon {
            font-size: 30px;
        }

        &:hover {
            border: 3px solid $accent-color;
        }
    }

    &.clear {
        color: white;
        background-color: rgba(white, 0.05);
    }

    &:hover, &.active {
        border-color: $accent-color;
        color: $accent-color;
        background-color: transparent;
        backdrop-filter: blur(10px);
    }

    &:active {
        border-color: transparent !important;
    }

    &.active {
        &:hover {
            color: $primary-color;
            background-color: $accent-color;
        }

        &:active {
            color: $accent-color;
            border-color: transparent;
            background-color: transparent;
        }
    }
}
</style>