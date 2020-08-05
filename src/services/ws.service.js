import { EventEmitter } from 'events';

const WebSocketService = {

    socket: null,
    heartbeat: null,
    events: new EventEmitter,

    init(socket, listener) {
        this.socket = socket;
        
        this.socket.onclose = () => this.events.emit('error', { type: 'server' });
        this.socket.onopen = () => this.heartbeat = setInterval(() => this.send('heartbeat', {}), 2000);

        listener.onmessage = msg => {
            const { type, payload } = this.parseEvents(msg);
            this.events.emit(type, payload);
        };
    },

    send(type, payload) {
        if (!this.socket) throw new Error('WebSocketService.init not called.');
        this.socket.sendObj({ type, payload });
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