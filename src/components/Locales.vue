<template>
    <div id="locales" v-if="current">
        <div @click="opened = !opened">
            <ion-icon name="chevron-down-outline" v-show="!opened"></ion-icon>
            <ion-icon name="chevron-up-outline" v-show="opened"></ion-icon>
            {{ getLocale(current) }} <ion-icon name="language"></ion-icon>
        </div>
        
        <transition name="fade">
            <ul class="menu" v-show="opened">
                <li v-for="locale in available" :key="locale" @click="setLocale(locale)">
                    {{ getLocale(locale) }}
                </li>
            </ul>
        </transition>
    </div>
</template>

<script>
import { where } from 'langs';
import Storage from '../services/storage.service';
import locales from '../common/locales';

export default {
    name: 'Locales',
    data() {
        return {
            opened: false,
            current: '',
            available: []
        };
    },
    methods: {
        getLocale(locale) {
            return where('1', locale).local;
        },
        setLocale(locale) {
            this.$i18n.locale = locale;
            this.current = locale;
            this.available = Object.keys(this.$i18n.messages).filter(k => k !== this.current).sort();
            Storage.set('locale', locale);
            this.opened = false;
        }
    },
    created() {
        const storedLocale = Storage.get('locale');
        const navigatorLocale = navigator.language.substr(0, 2);
        if (storedLocale) this.setLocale(storedLocale);
        else if (Object.keys(locales).includes(navigatorLocale)) this.setLocale(navigatorLocale);
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

#locales {
    position: absolute;
    right: 3vh;
    font-family: 'Montserrat';
    user-select: none;
    cursor: pointer;
    text-align: right;

    ul {
        position: absolute;
        top: 7vh;
        right: 0;
        padding: 1vh 1.5vh;
        border-radius: 1vh;
        background-color: $background-color;
        text-align: left;

        li {
            line-height: 2em;
            font-size: 1em;
            padding: 0 0.5em;
            transition: font-weight 0.1s ease-out;

            &:hover {
                font-weight: bold;
            }
        }
    }
}
</style>