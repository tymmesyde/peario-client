<template>
    <ul class="list">
        <transition-group name="fade">
            <li v-for="(item, i) in items" :key="itemKey ? item[itemKey] + i : item" :class="[{ 'active': item === value }, itemClass ]" @click="$emit('input', item), $emit('click', item)">
                <slot :item="item" :index="i"></slot>
            </li>
        </transition-group>
    </ul>
</template>

<script>
export default {
    name: 'List',
    props: {
        value: [Object, String, Number],
        items: Array,
        itemClass: String,
        itemKey: String
    }
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

ul {
    width: 100%;
    max-height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;
    user-select: none;

    li {
        border-radius: 0.5vh;
        transition: all 0.1s ease-in-out;
        cursor: default;

        &.active {
            background-color: rgba($text-color, 0.1);
        }

        &:not(.active):hover {
            background-color: rgba($text-color, 0.05);
            cursor: pointer;

            &:active {
                background-color: rgba($text-color, 0.15);
            }
        }
    }
}
</style>