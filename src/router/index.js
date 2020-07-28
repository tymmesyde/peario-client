import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// Hack for ignoring NavigationDuplicated errors on replace function
const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => {
        if (err.name !== 'NavigationDuplicated') throw err
    });
}

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