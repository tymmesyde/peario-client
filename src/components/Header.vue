<template>
    <header>
      <div class="logo">
        <img src="../assets/img/logo.svg">
      </div>
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
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $header-height;
  line-height: $header-height;
  padding: 0 2.5vh;
  display: flex;
  align-items: center;

  .logo {
    width: 20vh;
    user-select: none;
    vertical-align: middle;
    display: flex;
    align-items: center;
  }
}
</style>