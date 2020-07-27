import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            name: 'home',
            path: '/',
            component: () => import("@/views/Home")
        },
        {
            name: "search",
            path: "/search",
            component: () => import("@/views/search/Search.vue")
        },
        {
            name: "stream",
            path: "/stream/:type/:id",
            component: () => import("@/views/stream/Stream.vue")
        },
        {
            name: "room",
            path: "/room/:id",
            component: () => import("@/views/room/Room.vue")
        }
    ]
});