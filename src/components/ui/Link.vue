<template>
    <span class="link" @click="open()">
        <slot></slot>
    </span>
</template>

<script>
export default {
    props: {
        href: String
    },
    methods: {
        open() {
            window.open(this.href);
        }
    }
}
</script>

<style lang="scss" scoped>
.link {
    color: $accent-color;
    cursor: pointer;
    transition: all 0.1s ease-in-out;

    &:hover {
        box-shadow: 0 2px 0 0 $accent-color;
    }
}
</style>