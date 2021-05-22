<template>
  <div id="home" class="container">
    <div class="inner">
      <div class="title">
        <Title translate="views.home.title"/>
        <Title type="tertiary" translate="views.home.sub"/>
      </div>

      <div class="player col-4 no-border" @click="goToSearch()">
        <div class="overlay"></div>
        <div class="viewers-count">
          <ion-icon name="eye-outline"></ion-icon>
          3
        </div>

        <div class="play-button">
          <ion-icon name="play-outline"></ion-icon>
        </div>
      </div>

      <Button type="big" icon="play" translate="views.home.button" @click="goToSearch()"/>
    </div>
  </div>
</template>

<script>
import Title from '@/components/ui/Title.vue';
import Button from '@/components/ui/Button.vue';

export default {
  name: 'Home',
  components: {
    Title,
    Button
  },
  methods: {
    goToSearch() {
      this.$router.push({ name: 'search' });
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  text-align: center;
  padding-bottom: $header-height / 2;

  .title {
    margin-bottom: 6vh;
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
      color: $text-color;
    }

    &:hover {
      transform: scale(1.02);
    }
  }
  
}
</style>