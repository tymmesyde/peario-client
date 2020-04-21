<template>
    <div id="subtitle" :class="settings.size" v-show="settings.active">
        <span v-html="html"></span>
    </div>
</template>

<script>
import SubtitleService from '@/services/subtitle.service';

export default {
    name: 'Subtitle',
    props: {
        videoUrl: String,
        timecode: Number,
    },
    computed: {
        settings() {
            return this.$store.getters.subtitles;
        },
        current() {
            return this.$store.getters.subtitles.current;
        }
    },
    data() {
        return {
            html: null,
        }
    },
    watch: {
        timecode(value) {
            this.html = SubtitleService.getCurrent(value);
        },
        current(subtitle) {
            if (subtitle) {
                if (subtitle.url) SubtitleService.set(subtitle.url);
                else if (subtitle.data) SubtitleService.setCustom(subtitle.data);
            }
        }
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
        text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;

        &.small {
            font-size: 2vh;
        }

        &.medium {
            font-size: 3vh;
        }

        &.large {
            font-size: 4vh;
        }
    }
</style>