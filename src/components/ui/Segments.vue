<template>
    <div class="segments">
        <div :class="['segment', { 'active': segment === modelValue }]" v-for="segment in segments" :key="segment" @click="$emit('update:modelValue', segment)">
            <slot name="segment" :segment="segment"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Segments',
    props: {
        modelValue: [String, Number],
        segments: Array
    },
    emits: ['update:modelValue']
}
</script>

<style lang="scss" scoped>
.segments {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    user-select: none;
    overflow-x: auto;

    .segment {
        flex-shrink: 0;
        height: 40px;
        max-width: 140px;
        line-height: 40px;
        padding: 0 10px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: white;
        opacity: 0.6;
        cursor: pointer;
        transition: all 0.1s ease-in-out;

        &:hover {
            opacity: 0.8;
        }

        &.active {
            border-bottom: 3px solid $accent-color;
            opacity: 1;
        }
    }
}
</style>
