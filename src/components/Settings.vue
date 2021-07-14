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
                <div class="setting">
                    <div class="label">
                        <ion-icon name="heart"></ion-icon>
                        {{ $t('components.settings.support') }}
                    </div>
                    <div class="support" ref="support"></div>
                </div>
            </div>

            <Button clear large translate="components.settings.button" @click="close()"></Button>
        </div>
    </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import postscribe from 'postscribe';

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
    },
    setup() {
        const support = ref(null);

        const buymeacoffee = document.createElement('script');
        buymeacoffee.setAttribute('src', 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js');
        buymeacoffee.setAttribute('data-name', 'bmc-button');
        buymeacoffee.setAttribute('data-slug', 'tymmesyde');
        buymeacoffee.setAttribute('data-color', '#FFDD00');
        buymeacoffee.setAttribute('data-emoji', '');
        buymeacoffee.setAttribute('data-font', 'Cookie');
        buymeacoffee.setAttribute('data-text', 'Buy me a coffee');
        buymeacoffee.setAttribute('data-outline-color', '#000000');
        buymeacoffee.setAttribute('data-font-color', '#000000');
        buymeacoffee.setAttribute('data-coffee-color', '#ffffff');
        buymeacoffee.setAttribute('async', true);

        const kofiscript = document.createElement('script');
        kofiscript.setAttribute('src', 'https://storage.ko-fi.com/cdn/widget/Widget_2.js');

        const kofibuton = document.createElement('script');
        kofibuton.text = 'kofiwidget2.init(\'Support Me on Ko-fi\', \'#29abe0\', \'G2G85BB77\');kofiwidget2.draw();';

        watchEffect(() => {
            if (support.value) {
                postscribe(support.value, buymeacoffee.outerHTML);
                postscribe(support.value, kofiscript.outerHTML);
                postscribe(support.value, kofibuton.outerHTML);
            }
        });

        return {
            support
        };
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
        gap: 20px;
        min-width: 350px;
        padding: 25px;
        border-radius: 15px;
        background-color: $primary-color;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }
}

.settings {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;

    .setting {
        .label {
            display: flex;
            align-items: center;
            gap: 10px;
            height: 40px;
            font-family: 'Montserrat-SemiBold';
            color: $text-color;
        }
    }

    .support {
        display: flex;
        gap: 10px;
    }
}
</style>