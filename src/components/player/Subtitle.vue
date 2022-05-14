<template>
    <div id="subtitle" :class="[settings.size, { 'controls-shown': controlsShown }]" v-show="settings.active">
        <span v-html="html"></span>
    </div>
</template>

<script>
import SubtitleService from '@/services/subtitle.service';

export default {
    name: 'Subtitle',
    props: {
        controlsShown: Boolean,
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
    bottom: 2rem;
    display: flex;
    justify-content: center;
    font-family: 'Montserrat-Medium';
    color: white;
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    white-space: pre-line;
    text-align: center;
    transition: all 0.1s ease-in-out;

    &.controls-shown {
        bottom: calc(#{$player-controls-height} + 1rem);
    }

    &.small {
        font-size: 1.5rem;
    }

    &.medium {
        font-size: 2.1rem;
    }

    &.large {
        font-size: 2.8rem;
    }
}

@media only screen and (max-width: 768px) and (orientation: portrait) {
    #subtitle {
        &.controls-shown {
            bottom: calc(#{$player-controls-height} + 6rem) !important;
        }
    }
}
</style>