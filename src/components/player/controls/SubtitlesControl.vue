<template>
    <div id="subtitles-control">
        <span @click="activePanel = !activePanel">
            <ion-icon name="chatbox-ellipses-outline" v-show="!activePanel"></ion-icon>
            <ion-icon name="chatbox-ellipses" v-show="activePanel"></ion-icon>
        </span>

        <transition name="fade">
            <div class="panel" v-if="activePanel">
                <div class="bar">
                    <div class="toggle" @click="active = !active">
                        <div v-show="active" class="status">
                            <ion-icon name="toggle"></ion-icon> On
                        </div>
                        <div v-show="!active" class="status">
                            <ion-icon name="toggle-outline" class="flip"></ion-icon> Off
                        </div>
                    </div>

                    <ul class="sizes list">
                        <li class="size" v-for="s in sizes" :key="s" :class="[{ 'active': s === size }, s]" @click="size = s">
                            <ion-icon name="text-outline"></ion-icon>
                        </li>
                    </ul>
                </div>
                
                <div class="lists">
                    <ul class="list langs">
                        <li v-for="lang in langs" :key="lang.iso" :class="{ 'active': lang.iso === panelLang }" @click="panelLang = lang.iso">
                            {{ lang.local }}
                        </li>
                    </ul>
                    <ul class="list subs">
                        <li v-for="(sub, i) in filterSubs()" :key="sub.id" :class="{ 'active': sub === current }" @click="current = sub">
                            {{ $t(`components.player.subtitle`) }} {{ i+1 }}
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { where } from 'langs';
import StremioService from '@/services/stremio.service';

export default {
    name: 'SubtitlesControl',
    props: {
        videoUrl: String,
        userSubtitle: File
    },
    computed: {
        sizes() {
            return [
                'small',
                'medium',
                'large'
            ];
        }
    },
    data() {
        return this.$store.getters.subtitles;
    },
    watch: {
        active(state) {
            this.$store.dispatch('updateActive', state);
        },
        current(state) {
            this.$store.dispatch('updateCurrent', state);
        },
        size(state) {
            this.$store.dispatch('updateSize', state);
        },
        userSubtitle(file) {
            const reader = new FileReader();
            reader.readAsText(file, 'ASCII');
            reader.addEventListener('load', () => {
                const userLang = { iso: 'user', local: 'User' };
                this.langs.unshift(userLang);
                this.panelLang = userLang.iso;
                this.current = {
                    lang: userLang.iso,
                    data: reader.result
                };
                this.list.unshift(this.current);
            });
        }
    },
    methods: {
        filterSubs() {
            return this.list.filter(s => s.lang === this.panelLang);
        },
        extractLangs(list) {
            return list
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
        }
    },
    created() {
        this.active = true;
        this.activePanel = false;
        this.size = this.sizes[1];
    },
    async mounted() {
        this.list = await StremioService.getSubtitles(this.videoUrl);
        this.langs = this.extractLangs(this.list);

        this.$store.dispatch('updateList', this.list);
        this.$store.dispatch('updateLangs', this.langs);

        const lang = this.$i18n.locale;
        this.current = this.list.find(s => s.lang.includes(lang)) || this.list[0];
        this.panelLang = this.current.lang;
    }
}
</script>

<style lang="scss" scoped>
@import '../../../variables.scss';

#subtitles-control {
    .panel {
        $panel-height: 250px;
        $panel-width: 300px;

        position: absolute;
        height: $panel-height;
        width: $panel-width;
        top: calc(-#{$panel-height} - 15px);
        right: -2.5vw;
        border-radius: 10px;
        background-color: $background-color;
        overflow: hidden;

        $bar-height: 45px;

        .bar {
            height: $bar-height;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 15px;
            font-size: 20px;

            .toggle {
                display: grid;
                align-items: center;
                cursor: pointer;

                .status {
                    display: flex;
                    align-items: center;

                    ion-icon {
                        margin-right: 10px;
                    }
                }
            }

            .sizes {
                display: flex;
                align-items: center;
                width: auto !important;

                .size {
                    width: $bar-height;
                    line-height: $bar-height;
                    text-align: center;
                    cursor: pointer;
                    
                    &.small {
                        font-size: 16px;
                    }

                    &.large {
                        font-size: 26px;
                    }
                }
            }
        }

        .lists {
            display: flex;
            align-items: center;
            height: calc(100% - #{$bar-height});

            .list {
                height: 100%;
                max-height: 100%;
                width: 50%;

                li {
                    font-size: 20px;
                    padding: 5px 10px;
                    cursor: pointer;
                    overflow: hidden;
                    white-space: pre;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
</style>