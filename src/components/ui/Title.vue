<template>
  <div :class="['title', type]">
    <ion-icon :name="icon" v-if="icon"></ion-icon>
    {{ translate ? $t(translate) : "" }}
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Title",
  props: {
    type: {
      type: String,
      default: "primary",
    },
    icon: String,
    translate: String,
  },
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: $text-color;

  &.primary {
    font-family: "Montserrat", serif;
    font-weight: 700;
    font-size: 8vh;
    letter-spacing: -0.15rem;
    line-height: 100%;

    ion-icon {
      font-size: 7vh;
      vertical-align: -0.75vh;
    }
  }

  &.secondary {
    font-family: "Montserrat", serif;
    font-weight: 400;
    font-size: 28px;
    user-select: none;
    text-transform: uppercase;
  }

  &.tertiary {
    font-family: "Montserrat", serif;
    font-weight: 500;
    font-size: 2.75vh;
    opacity: 0.75;
  }
}
</style>
