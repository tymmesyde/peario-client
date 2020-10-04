import { EventEmitter } from 'events';

export const WebSocketService = {

    socket: null,
    heartbeat: null,
    events: new EventEmitter,

    connect(url) {
        return new Promise(resolve => {
            this.socket = new WebSocket(url);

            this.socket.onopen = () => {
                resolve();
                this.heartbeat = setInterval(() => this.send('heartbeat', {}), 2000);
            };

            this.socket.onclose = () => this.events.emit('error', { type: 'server' });

            this.socket.onmessage = msg => {
                const { type, payload } = this.parseEvents(msg);
                this.events.emit(type, payload);
            };
        });
    },

    send(type, payload) {
        if (!this.socket) throw new Error('WebSocketService.init not called.');
        this.socket.send(JSON.stringify({ type, payload }));
    },

    parseEvents(msg) {
        const { data } = msg;
        const { type, payload } = JSON.parse(data);
        return { type, payload };
    },

    clear() {
        clearInterval(this.heartbeat);
    }

};

export default WebSocketService;