import Vue from 'vue';
import VueRx from 'vue-rx';
import VueMeta from 'vue-meta'
import VueI18n from 'vue-i18n';
import VueClipboard from 'vue-clipboard2';
import Toasted from 'vue-toasted';
import App from './App.vue';
import router from './router';
import store from './store';
import locales from './common/locales';

Vue.use(VueRx);
Vue.use(VueI18n);
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
});
Vue.use(VueClipboard);
Vue.use(Toasted);

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/^ion-/];

const i18n = new VueI18n({
  locale: 'en',
  messages: locales,
});

// Register toasts from locale
const { toasts } = i18n.messages[i18n.locale];
Object.entries(toasts).map(([key, value]) => {
  Vue.toasted.register(key, value, {
    position: 'bottom-center',
    duration: 3000
  });
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
