<template>
    <input type="text" spellcheck="false" :class="type" :value="value" :placeholder="placeholder" @click="$emit('click')" @input="$emit('input', $event.target.value)">
</template>

<script>
export default {
    name: 'TextInput',
    props: {
        type: String,
        placeholder: String,
        value: String
    }
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

input {
  height: 5vh;
  background-color: transparent;
  border: 0.3vh solid $accent-color;
  border-radius: 7vh;
  padding: 0 2.5vh;
  font-family: 'Montserrat-SemiBold';
  font-size: 2vh;
  color: white;
  text-transform: none;
  box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.1);
  transition: all 0.1s ease-in-out;
  outline: none;
  text-overflow: ellipsis;

  &.large {
    height: 7vh;
    width: 100%;
    padding: 0 3.5vh;
    font-size: 2.75vh;
  }

  &::placeholder {
    color: $text-color;
    opacity: 0.5;
  }

  &:hover, &:focus {
    opacity: 1;
  }
}
</style>