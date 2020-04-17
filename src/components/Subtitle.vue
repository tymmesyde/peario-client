<template>
    <div id="subtitle">
        {{ text }}
    </div>
</template>

<script>
import SubtitleService from '@/services/subtitle.service';

export default {
    name: 'Subtitle',
    props: {
        subtitles: Array,
        timecode: Number,
        current: Object,
    },
    data() {
        return {
            text: null,
        }
    },
    watch: {
        timecode(value) {
            this.text = SubtitleService.getCurrent(value);
        },
        current(subtitle) {
            SubtitleService.set(subtitle);
        }
    },
    mounted() {
        SubtitleService.list = this.subtitles;
        SubtitleService.set(this.current);
    }
}
</script>

<style lang="scss" scoped>
    #subtitle {
        position: absolute;
        width: 100%;
        bottom: 8vh;
        display: flex;
        justify-content: center;
        color: white;
        font-size: 2vh;
        text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    }
</style>