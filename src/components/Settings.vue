<template>
    <div class="modal" v-if="show">
        <div class="backdrop" @click="close()"></div>

        <div class="inner">
            <Title icon="settings" type="secondary" translate="components.settings.title"></Title>

            <div class="settings">
                <div class="setting">
                    <div class="label">
                        <ion-icon name="language"></ion-icon>
                        {{ $t('components.settings.lang') }}
                    </div>
                    <Select v-model="settings.locale" :options="localesOptions"></Select>
                </div>
            </div>

            <Button clear large translate="components.settings.button" @click="close()"></Button>
        </div>
    </div>
</template>

<script>
import { where } from 'langs';
import Title from './ui/Title.vue';
import Button from './ui/Button.vue';
import Select from './ui/Select.vue';

import store from '../store';

export default {
    components: {
        Title,
        Button,
        Select
    },
    props: {
        show: Boolean
    },
    computed: {
        settings: () => store.state.settings,
        localesOptions() {
            return this.settings.locales.map(locale => ({
                name: this.getLocaleName(locale),
                value: locale
            }));
        }
    },
    watch: {
        'settings.locale'(value) {
            store.dispatch('settings/updateLocale', value);
            this.$i18n.locale = value;
        }
    },
    methods: {
        getLocaleName(locale) {
            return where('1', locale).local;
        },
        close() {
            this.$emit('update:show', !this.show);
        }
    }
}
</script>

<style lang="scss" scoped>
.modal {
    z-index: 97;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .backdrop {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        backdrop-filter: blur(5px);
        background-color: rgba(0, 0, 0, 0.8);
        cursor: pointer;
    }

    .inner {
        z-index: 98;
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 350px;
        padding: 25px;
        border-radius: 15px;
        background-color: $primary-color;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }
}

.settings {
    margin-bottom: 15px;

    .setting {
        .label {
            display: flex;
            align-items: center;
            gap: 5px;
            height: 40px;
            font-family: 'Montserrat-SemiBold';
            color: $text-color;
        }
    }
}
</style>