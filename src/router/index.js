import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/stream/:type/:imdb_id',
        name: 'stream',
        component: () => import('../views/Stream.vue')
    },
    {
        path: '/room/:id',
        name: 'room',
        component: () => import('../views/Room.vue')
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;