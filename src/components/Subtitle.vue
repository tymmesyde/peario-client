<template>
    <div id="subtitle">
        <span v-html="html"></span>
    </div>
</template>

<script>
import { where } from 'langs';
import SubtitleService from '@/services/subtitle.service';
import StremioService from '@/services/stremio.service';

export default {
    name: 'Subtitle',
    props: {
        videoUrl: String,
        timecode: Number,
        current: Object,
    },
    data() {
        return {
            html: null,
            subtitles: [],
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
    },
    async created() {
        this.subtitles = await StremioService.getSubtitles(this.videoUrl);
        SubtitleService.list = this.subtitles;

        const langs = this.subtitles
                            .map(({ lang }) => lang)
                            .filter((el, i, self) => i == self.indexOf(el))
                            .map(lang => {
                                const iso2 = where('2', lang);
                                const iso2B = where('2B', lang);
                                return {
                                    iso: lang,
                                    local: iso2 ? iso2.local : iso2B ? iso2B.local : lang
                                }
                            })
                            .sort();

        this.$emit('loaded', {
            list: this.subtitles,
            langs
        });
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