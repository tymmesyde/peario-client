<template>
    <footer></footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

footer {
  z-index: 99;
  position: fixed;
  bottom: 0;
  height: $footer-height;
  width: 100%;
  text-align: center;
}
</style>