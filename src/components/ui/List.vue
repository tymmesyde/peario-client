<template>
    <ul :class="['list', { 'fixed': fixed, 'small': small }]">
        <transition-group name="fade">
            <li :class="['item', { 'active': item === modelValue }]" v-for="(item, index) in items" :key="itemKey ? item[itemKey] : item" @click="selectItem($event, item)">
                <div class="left-content">
                    <slot name="left" :index="index" :item="item"></slot>
                </div>
                <div class="right-content" v-if="$slots.right">
                    <slot name="right" :index="index" :item="item"></slot>
                </div>
            </li>
        </transition-group>
    </ul>
</template>

<script>
export default {
    name: 'List',
    props: {
        modelValue: [Object, String, Number],
        items: Array,
        itemKey: String,
        fixed: Boolean,
        small: Boolean
    },
    emits: ['update:modelValue', 'click'],
    methods: {
        selectItem(event, item) {
            const { target } = event;
            const itemElement = target.closest('.item');

            itemElement.parentElement.scrollTo({
                top: itemElement.offsetTop,
                behavior: 'smooth'
            });

            this.$emit('update:modelValue', item);
            this.$emit('click', item);
        }
    }
}
</script>

<style lang="scss" scoped>
.list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-x: hidden;
    overflow-y: auto;

    &.fixed {
        max-height: 300px;
    }

    .item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 15px;
        border: 3px solid transparent;
        border-radius: 10px;
        color: white;
        background-color: rgba(white, 0.05);
        cursor: pointer;
        user-select: none;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        transition: all 0.1s ease-in-out;

        &.active {
            border-color: $accent-color;
        }

        &:hover {
            background-color: rgba(white, 0.1);
        }

        &:active {
            border-color: $accent-color;
        }

        div {
            display: flex;
            gap: 15px;
            align-items: center;
        }

        .left-content {
            word-break: normal;
            font-family: 'Montserrat-SemiBold';
        }

        .right-content {
            word-break: break-word;
            font-family: 'Montserrat-Regular';
            opacity: 0.75;
        }
    }

    &.small {
        .item {
            padding: 5px 10px;
            border-width: 2px;
        }
    }
}
</style>