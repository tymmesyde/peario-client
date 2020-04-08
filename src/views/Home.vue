<template>
  <div id="home">
    <div class="inner">
      <img class="logo" src="../assets/logo.svg" alt="">

      <div class="searchbar">
        <ion-icon name="search-outline"></ion-icon>
        <input type="text" placeholder="Search"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="scss" scoped>
  #home {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    .logo {
      width: 45vh;
      margin-bottom: 3vh;
      user-select: none;
    }

    .searchbar {
      width: 60%;
      margin: auto;
      position: relative;

      ion-icon {
        position: absolute;
        top: 1.2vh;
        left: 1.5vh;
        font-size: 2.5vh;
      }
    }
  }
</style>