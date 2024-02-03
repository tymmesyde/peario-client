<template>
    <div id="subtitles-control">
        <ion-icon name="chatbox-ellipses-outline" v-show="!activePanel" @click="togglePanel"></ion-icon>
        <ion-icon name="chatbox-ellipses" v-show="activePanel" @click="togglePanel"></ion-icon>

        <transition name="fade">
            <div class="panel" v-if="activePanel">
                <div class="bar">
                    <div class="toggle" @click="subtitles.active = !subtitles.active">
                        <div v-show="subtitles.active" class="status">
                            <ion-icon name="toggle"></ion-icon> On
                        </div>
                        <div v-show="!subtitles.active" class="status">
                            <ion-icon name="toggle-outline" class="flip"></ion-icon> Off
                        </div>
                    </div>

                    <List class="sizes" small v-model="subtitles.size" :items="sizes">
                        <template #left>
                            <ion-icon name="text-outline"></ion-icon>
                        </template>
                    </List>
                </div>

                <div class="loading" v-if="!langs.length">
                    <ion-icon name="sync-outline" class="spin"></ion-icon>
                </div>
                
                <div class="lists">
                    <List class="langs" small v-model="panelLang" :items="langs" itemKey="iso">
                        <template #left="{ item }">
                            {{ item.local }}
                        </template>
                    </List>
                    <List class="subs" small v-model="subtitles.current" :items="filterSubs()" itemKey="id">
                        <template #left="{ index }">
                            {{ `${$t(`components.player.subtitle`)} ${ index + 1 }` }}
                        </template>
                    </List>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { where } from 'langs';
import { mapGetters } from 'vuex';
import List from '@/components/ui/List.vue';
import StremioService from '@/services/stremio.service';
import AddonService from '@/services/addon.service';

export default {
    name: 'SubtitlesControl',
    components: {
        List
    },
    props: {
        videoUrl: String,
        meta: Object,
        userSubtitle: File
    },
    computed: {
        sizes() {
            return [
                'small',
                'medium',
                'large'
            ];
        },
        ...mapGetters(['installedSubtitles', 'subtitles'])
    },
    data() {
        return {
            activePanel: false,
            panelLang: null,
            list: [],
            localeLang: (this.$i18n && this.$i18n.locale) || 'en',
            langs: []
        };
    },
    watch: {
        list() {
            this.langs = this.extractLangs(this.list);

            const isCurrentUser = this.panelLang && this.panelLang.iso === 'user';
            const current = this.list.find(s => isCurrentUser ? s.lang === 'user' : s.lang.startsWith(this.localeLang)) || this.list[0];

            this.panelLang = this.langs.find(({ iso }) => iso === current.lang);
            this.$store.dispatch('updateCurrent', current);
        },
        'subtitles.active'(state) {
            this.$store.dispatch('updateActive', state);
        },
        'subtitles.current'(state) {
            this.$store.dispatch('updateCurrent', state);
        },
        'subtitles.size'(state) {
            this.$store.dispatch('updateSize', state);
        },
        userSubtitle(file) {
            const reader = new FileReader();
            reader.readAsText(file, 'ASCII');
            reader.addEventListener('load', () => {
                const userIndex = this.list.filter(({ lang }) => lang === 'user').length;

                const subtitle = {
                    id: `user-${userIndex}`,
                    lang: 'user',
                    data: reader.result
                };

                this.list = [
                    subtitle,
                    ...this.list
                ];
            });
        },
        installedSubtitles() {
            this.fetchSubtitles();
        }
    },
    methods: {
        togglePanel() {
            this.activePanel = !this.activePanel;
        },
        fetchSubtitles() {
            const addToList = subtitles => {
                this.list.push(...subtitles);

                const urls = [...new Set(this.list.map(({ url }) => url))];
                this.list = urls.map(url => this.list.find(sub => sub.url === url));
            };

            StremioService.getSubtitles(this.videoUrl).then(stremioSubtitles => addToList(stremioSubtitles));
            this.installedSubtitles.map(addon => AddonService.getSubtitles([addon], this.meta.type, this.meta.id).then(addonsSubtitles => addToList(addonsSubtitles)));
        },
        filterSubs() {
            return this.panelLang ? this.list.filter(s => s.lang === this.panelLang.iso) : [];
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
                            local: lang === 'user' ? 'User' : (iso2 ? iso2.local : iso2B ? iso2B.local : lang)
                        }
                    })
                    .sort();
        }
    },
    mounted() {
        this.$store.dispatch('updateSize', this.sizes[1]);
        this.fetchSubtitles();
    }
}
</script>

<style lang="scss" scoped>
#subtitles-control {
    .panel {
        position: fixed;
        bottom: $player-controls-height;
        right: 0;
        height: 300px;
        width: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        font-size: 15px;
        overflow: hidden;
        background-color: rgba($primary-color, 0.8);
        backdrop-filter: blur(10px);
        cursor: default;

        .bar {
            flex: none;
            height:  65px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 10px;
            padding-right: 20px;
            font-size: 20px;

            .toggle {
                height: 100%;
                display: grid;
                align-items: center;
                padding: 0 10px;
                cursor: pointer;

                .status {
                    display: flex;
                    align-items: center;

                    ion-icon {
                        margin-right: 10px;
                    }
                }
            }
        }

        .loading {
            top: 0;
            position: absolute;
            height: 100%;
            width: 100%;
            display: grid;
            place-items: center;
            font-size: 30px;
        }

        .lists {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0 5px;
            overflow: hidden;

            .list {
                flex: 0 1 50%;
                height: 100%;
                padding: 0 10px;
                padding-bottom: 10px;

                :deep(.item) {
                    padding: 0.75em 1em;
                }

                &:first-child .item div:last-child {
                    font-family: 'Montserrat-SemiBold' !important;
                }
            }
        }
    }
}

@media only screen and (orientation: landscape) {
    .panel {
        height: 230px !important;
        width: 45% !important;
    }
}

@media only screen and (min-width: 768px) and (min-height: 768px) {
    .panel {
        position: absolute !important;
        height: 300px !important;
        width: 400px !important;
        bottom: calc(#{$player-controls-height} + 2em) !important;
    }
}
</style>

<style lang="scss">
.panel {
    .bar {
        .sizes {
            display: flex;
            flex-direction: row;

            .item {
                font-size: 20px;
                --ionicon-stroke-width: 40px;

                &:first-child {
                    font-size: 13px;
                    --ionicon-stroke-width: 30px;
                }

                &:last-child {
                    font-size: 25px;
                    --ionicon-stroke-width: 60px;
                }
            }
        }
    }
}
</style>