import { createApp } from 'vue';
import Toaster from "@meforma/vue-toaster";
import router from './router';
import Ionicons from './plugins/ionicons';
import App from './App.vue';

createApp(App)
    .use(router)
    .use(Ionicons)
    .use(Toaster, {
        position: 'bottom',
        duration: 3000
    })
    .mount('#app');
