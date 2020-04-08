<template>
    <header>
      <router-link :to="{ name: '' }">
        <img alt="logo" src="../assets/img/logo.svg">
      </router-link>
    </header>
</template>

<script>
export default {
    name: 'Header'
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

header {
  z-index: 98;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $header-height;
  line-height: $header-height;
  padding: 0 2vh;

  img {
    width: 20vh;
    user-select: none;
    vertical-align: middle;
  }
}
</style>