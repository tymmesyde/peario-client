<template>
    <div class="time-bar">
        <RangeInput v-model="range" max="10000" step="1" :disabled="(autoSync && !isOwner) || !videoElement.duration" @change="onRangeChange"></RangeInput>
    </div>
</template>

<script setup>
import { computed, defineProps, onMounted, onUnmounted, ref } from 'vue';
import store from '@/store';
import RangeInput from "@/components/ui/RangeInput.vue";

const props = defineProps({
    options: {
        isOwner: Boolean
    }
});

const range = ref(0);

const isOwner = computed(() => props.options.isOwner);
const videoElement = computed(() => store.state.player.video);
const autoSync = computed(() => store.state.player.autoSync);

const currentTimeToRange = () => {
    const { currentTime, duration } = videoElement.value;
    range.value = Number(((currentTime * 10000 / duration) || 0).toFixed());
};

const onRangeChange = (value) => {
    if ((!isOwner.value && !autoSync.value) || isOwner.value) {
        const currentTime = value * videoElement.value.duration / 10000;
        store.dispatch('player/setCurrentTime', currentTime);
    }
};

onMounted(() => {
    videoElement.value.addEventListener('timeupdate', currentTimeToRange);
});

onUnmounted(() => {
    videoElement.value.removeEventListener('timeupdate', currentTimeToRange)
});
</script>

<style lang="scss" scoped>
.time-bar {
    input {
        width: 100%;
    }
}
</style>