import Vue from 'vue';
import VueRx from 'vue-rx';
import VueNativeSock from 'vue-native-websocket';
import VueMeta from 'vue-meta'
import VueI18n from 'vue-i18n';
import VueClipboard from 'vue-clipboard2';
import Toasted from 'vue-toasted';
import App from './App.vue';
import router from './router';
import store from './store';
import { WS_SERVER } from './common/config';
import locales from './assets/locales.json';

Vue.use(VueRx);
Vue.use(VueNativeSock, WS_SERVER, {
  format: 'json',
  reconnection: true
});
Vue.use(VueI18n);
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
});
Vue.use(VueClipboard);
Vue.use(Toasted);

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/^ion-/];

const i18n = new VueI18n({
  locale: navigator.language.substr(0, 2) || 'en',
  messages: locales,
});

const { toasts } = i18n.messages[i18n.locale];

Vue.toasted.register('clipboard', toasts.clipboard, {
  type: 'success',
  position: 'bottom-center',
  duration: 3000,
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
