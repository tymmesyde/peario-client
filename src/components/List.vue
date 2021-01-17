<template>
    <ul :class="['list', { 'fixed': fixed, 'spaced': spaced }]">
        <transition name="fade">
            <Loading v-show="!items.length"></Loading>
        </transition>
        <transition-group name="fade">
            <li :class="{ 'active': item === modelValue }" v-for="item in items" :key="item" @click="selectItem($event, item)">
                <div>
                    <slot name="left" :item="item"></slot>
                </div>
                <div>
                    <slot name="right" :item="item"></slot>
                </div>
            </li>
        </transition-group>
    </ul>
</template>

<script>
import Loading from '../components/Loading';

export default {
    name: 'List',
    components: {
        Loading
    },
    props: {
        modelValue: Object,
        items: Array,
        fixed: Boolean,
        spaced: Boolean
    },
    methods: {
        selectItem(event, item) {
            const { target } = event;
            target.parentElement.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
            this.$emit('update:modelValue', item);
            this.$emit('itemclick', item);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

ul {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 250px;
    overflow-x: hidden;
    overflow-y: auto;

    &.fixed {
        max-height: 250px;
    }

    &.spaced {
        li {
            justify-content: space-between;
        }
    }

    li {
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

        div:first-child {
            word-break: normal;
            font-family: 'Montserrat-SemiBold';
        }

        div:last-child {
            word-break: break-word;
            font-family: 'Montserrat-Regular';
            opacity: 0.75;
        }
    }
}
</style>