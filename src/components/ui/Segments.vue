<template>
    <ul class="segments">
        <li v-for="segment in segments" :key="segment" :class="{ 'active': value === segment }" @click="$emit('input', segment)">
            <slot name="segment" :segment="segment"></slot>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'Segments',
    props: {
        value: [String, Number],
        segments: Array
    }
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

$segment-height: 4vh;

ul {
  margin-bottom: 1.5vh;
  padding-bottom: 0.5vh;
  white-space: pre;
  overflow: hidden;
  overflow-x: auto;
  user-select: none;

  li {
    height: $segment-height;
    line-height: $segment-height;
    display: inline-block;
    vertical-align: middle;
    padding: 0 2vh;
    border-radius: 1vh;
    margin-right: 1vh;
    cursor: pointer;
    transition: all 0.1s ease-in-out;

    &.active {
      background-color: rgba(white, 0.1);
      font-weight: bold;
    }

    &:hover {
      background-color: rgba(white, 0.05);
    }
  }
}
</style>