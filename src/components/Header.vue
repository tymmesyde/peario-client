<template>
    <header>
      <div class="logo">
        <img src="../assets/img/logo.svg">
      </div>

      <Locales></Locales>
    </header>
</template>

<script>
import Locales from './Locales';

export default {
  name: 'Header',
  components: {
    Locales
  }
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
    width: 18vh;
    user-select: none;
    vertical-align: middle;
    display: flex;
    align-items: center;

    img {
      width: 100%;
    }
  }
}
</style>