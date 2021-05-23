<template>
    <input type="text" spellcheck="false" :class="[{ 'large': large }]" :value="modelValue" :placeholder="placeholder" @input="$emit('update:modelValue', $event.target.value)">
</template>

<script>
export default {
    name: 'TextInput',
    props: {
        modelValue: String,
        large: Boolean,
        placeholder: String
    },
    emits: ['update:modelValue']
}
</script>

<style lang="scss" scoped>
input {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    border: 2px solid $accent-color;
    border-radius: 5px;
    padding: 0 15px;
    font-family: 'Montserrat-Bold';
    font-size: 15px;
    color: $primary-color;
    background-color: $accent-color;
    text-transform: none;
    outline: none;
    text-overflow: ellipsis;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.1s ease-in-out;

    &.large {
        height: 65px;
        width: 100%;
        font-size: 24px;
        padding: 0 25px;

        ion-icon {
            font-size: 30px;
        }
    }

    &::placeholder {
        color: $primary-color;
        opacity: 0.5;
    }
}
</style>