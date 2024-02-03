<template>
    <div class="segments">
        <div
            :class="['segment', { 'active': (haveIds ? segment.id : segment) === props.modelValue }]"
            v-for="segment in props.segments" :key="haveIds ? segment.id : segment"
            @click="onClick(segment)"
        >
            <slot name="segment" :segment="segment"></slot>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: [String, Number],
    segments: Array
});

const emit = defineEmits(['update:modelValue']);
const haveIds = computed(() => Array.isArray(props.segments) && typeof props.segments[0] === 'object');

const onClick = (segment) => {
    emit('update:modelValue', haveIds.value ? segment.id : segment);
};
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
        font-family: 'Montserrat-Bold';
        font-size: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: white;
        opacity: 0.6;
        cursor: pointer;
        overflow: hidden;
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