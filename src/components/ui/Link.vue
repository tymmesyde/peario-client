<template>
    <a :href="href" target="_blank" class="link">
        <slot></slot>
    </a>
</template>

<script>
export default {
    props: {
        href: String
    }
}
</script>

<style lang="scss" scoped>
.link {
    font-family: 'Montserrat-Medium';
    color: $accent-color;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.1s ease-in-out;

    &:hover {
        box-shadow: 0 2px 0 0 $accent-color;
    }
}
</style>