import { EventEmitter } from 'events';

const WebSocketService = {

    socket: null,
    events: new EventEmitter,

    init(socket, listener) {
        this.socket = socket;
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
    }

};

export default WebSocketService;