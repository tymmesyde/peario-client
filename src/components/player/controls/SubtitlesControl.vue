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

                    <div class="sizes">
                        <div class="size" v-for="s in sizes" :key="s" :class="[{ 'active': s === size }, s]" @click="size = s">
                            <ion-icon name="text-outline"></ion-icon>
                        </div>
                    </div>
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
#subtitles-control {
    position: relative;
    justify-self: center;
    font-size: 2.25vh;
    line-height: 0;

    ion-icon {
        cursor: pointer;
    }

    .panel {
        position: absolute;
        height: 19vh;
        width: 22vh;
        right: -6vh;
        bottom: 5vh;
        border-radius: 1vh;
        background-color: rgba(white, 0.1);
        overflow: hidden;

        $bar-height: 4vh;

        .bar {
            height: $bar-height;
            display: grid;
            grid-template-columns: 30% 70%;
            align-items: center;
            padding-left: 1vh;

            .toggle {
                height: $bar-height;
                display: grid;
                align-items: center;
                font-size: 1.75vh;
                cursor: pointer;

                .status {
                    display: grid;
                    grid-template-columns: 2.75vh auto;
                    align-items: center;
                }
            }

            .sizes {
                text-align: right;

                .size {
                    height: $bar-height;
                    width: $bar-height;
                    line-height: $bar-height;
                    display: inline-block;
                    vertical-align: top;
                    text-align: center;
                    cursor: pointer;
                    
                    &.small {
                        font-size: 1.5vh;
                    }

                    &.medium {
                        font-size: 2vh;
                    }

                    &.large {
                        font-size: 2.6vh;
                    }

                    &.active {
                        background-color: rgba(white, 0.2);
                    }

                    &:not(.active):hover {
                        background-color: rgba(white, 0.1);
                    }
                }
            }
        }

        .list {
            display: inline-block;
            vertical-align: top;
            height: 15vh;
            width: 11vh;
            line-height: 100%;
            font-size: 1.5vh;
            overflow-y: auto;

            li {
                height: 3vh;
                line-height: 3vh;
                padding-left: 1.25vh;
                cursor: pointer;
                overflow: hidden;
                white-space: pre;
                text-overflow: ellipsis;

                &.active {
                    background-color: rgba(white, 0.2);
                }

                &:not(.active):hover {
                    background-color: rgba(white, 0.1);
                }
            }
        }
    }
}
</style>