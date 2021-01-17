<template>
    <div class="segments">
        <div :class="['segment', { 'active': isActive(segment) }]" v-for="segment in segments" :key="segment" @click="selectSegment($event, segment)">
            <slot :item="segment"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Segments',
    props: {
        modelValue: [Object, String, Number],
        segments: Array
    },
    methods: {
        isActive(segment) {
            return JSON.stringify(segment) === JSON.stringify(this.modelValue);
        },
        selectSegment(event, segment) {
            const { target } = event;
            target.parentElement.scrollTo({
                left: target.offsetLeft,
                behavior: 'smooth'
            });
            this.$emit('update:modelValue', segment);
        }
    },
    mounted() {
        if (!this.modelValue) this.$emit('update:modelValue', this.segments[0])
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.segments {
    position: relative;
    margin-bottom: 15px;
    white-space: pre;
    user-select: none;
    overflow-x: auto;

    .segment {
        display: inline-block;
        vertical-align: middle;
        height: 40px;
        max-width: 140px;
        line-height: 40px;
        padding: 0 10px;
        font-family: 'Montserrat-Bold';
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