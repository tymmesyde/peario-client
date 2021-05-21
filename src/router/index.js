import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        name: 'home',
        path: '/',
        component: () => import("@/views/Home")
    },
    {
        name: "search",
        path: "/search",
        component: () => import("@/views/Search.vue")
    },
    {
        name: "stream",
        path: "/stream/:type/:id",
        component: () => import("@/views/Stream.vue")
    },
    {
        name: "room",
        path: "/room/:id",
        component: () => import("@/views/Room.vue")
    }
];

export default createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});