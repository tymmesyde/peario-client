import ClientService from '@/services/client.service';
import { WS_SERVER } from '@/common/config';

export default {
    namespaced: true,
    state: {
        connected: false,
        ready: false,
        error: null,
        user: null,
        room: null,
        messages: []
    },
    mutations: {
        updateStatus(state, value) {
            state.connected = value;
        },
        updateReady(state, value) {
            state.ready = value;
        },
        updateError(state, value) {
            state.error = value;
        },
        updateUser(state, value) {
            state.user = value;
        },
        updateRoom(state, value) {
            state.room = value;
        },
        updateMessages(state, value) {
            state.messages = [
                ...state.messages,
                value
            ];
        },
        clearMessages(state) {
            state.messages = [];
        }
    },
    actions: {
        start({ commit }) {
            ClientService.connect(WS_SERVER);
            ClientService.events.on('opened', () => commit('updateStatus', true));
            ClientService.events.on('closed', () => commit('updateStatus', false));
            ClientService.events.on('ready', ({ user }) => {
                commit('updateReady', true);
                commit('updateUser', user);
            });
            ClientService.events.on('user', ({ user }) => commit('updateUser', user));
            ClientService.events.on('error', error => commit('updateError', error));
            ClientService.events.on('room', room => {
                commit('updateRoom', room);
                commit('clearMessages');
            });
            ClientService.events.on('sync', room => commit('updateRoom', room));
            ClientService.events.on('message', message => commit('updateMessages', message));
        }
    }
};