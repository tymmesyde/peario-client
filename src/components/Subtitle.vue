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
        options: {
            subtitles: [],
            defaultLang: String,
        },
        timecode: Number,
    },
    data() {
        return {
            text: null,
        }
    },
    watch: {
        timecode(value) {
            this.text = SubtitleService.getCurrent(value);
        }
    },
    mounted() {
        SubtitleService.init(this.options);
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