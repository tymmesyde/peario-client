<template>
  <div id="home" class="container">
    <Header></Header>

    <div class="inner">
      <div class="title">
        <h1>{{ $t(`views.home.title`) }}</h1>
        <h3>{{ $t(`views.home.sub`) }}</h3>
      </div>

      <div class="player" @click="goToSearch()">
        <div class="overlay"></div>
        <div class="viewers-count">
          <ion-icon name="eye-outline"></ion-icon>
          3
        </div>

        <div class="play-button">
          <ion-icon name="play-outline"></ion-icon>
        </div>
      </div>

      <button class="big" @click="goToSearch()">
        <ion-icon name="play"></ion-icon>
        {{ $t(`views.home.button`) }}
      </button>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  name: 'Home',
  components: {
    Header
  },
  methods: {
    goToSearch() {
      this.$router.push({ name: 'search' });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

#home {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: url('../assets/img/dunes.svg'), url('../assets/img/stars.svg'), linear-gradient(180deg, $background-color 0%, #292544 100%);
  background-repeat: no-repeat;
  background-position: center bottom, center 10%, center;
  padding-bottom: $header-height;

  .title {
    margin-bottom: 6vh;

    h1 {
      font-family: 'Montserrat-SemiBold';
      font-size: 8vh;
      font-weight: normal;
      letter-spacing: -0.15rem;
      margin: 1vh;
    }

    h3 {
      font-family: 'Montserrat-MediumItalic';
      font-size: 2.75vh;
      font-weight: normal;
      margin: 0;
      opacity: 0.75;
    }
  }

  .player {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30vh;
    width: 55vh;
    border: 0.3vh solid $text-color;
    border-radius: 1vh;
    margin: auto;
    margin-bottom: 5vh;
    box-shadow: 0 1vh 1.5vh rgba(0, 0, 0, 0.1);
    background-image: url('../assets/img/player_background.png');
    background-size: cover;
    transition: all 0.1s ease-in-out;
    transition-delay: 0.1s;
    cursor: pointer;

    .overlay {
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.1);
    }

    .viewers-count {
      position: absolute;
      top: 1.5vh;
      left: 2vh;
      font-family: 'Montserrat-SemiBold';
      font-size: 2.5vh;
      color: $accent-color;
      user-select: none;

      ion-icon {
        font-size: 2.75vh !important;
      }
    }

    .play-button {
      font-size: 7.5vh;
    }

    &:hover {
      transform: scale(1.02);
    }
  }
  
}
</style>