import { EventEmitter } from 'events';

const ClientService = {

    socket: null,
    heartbeat: null,
    events: new EventEmitter,

    connect(url) {
        this.socket = new WebSocket(url);
        this.socket.onopen = this._handleOpen.bind(this);
        this.socket.onclose = this.events.emit('closed');
        this.socket.onmessage = this._handleMessage.bind(this);
    },

    _handleOpen() {
        this.events.emit('opened');
        this.heartbeat = setInterval(() => this.send('heartbeat', {}), 2000);
    },

    _handleMessage(msg) {
        const { type, payload } = this.parseEvents(msg);
        this.events.emit(type, payload);
    },

    send(type, payload) {
        this.socket.send(JSON.stringify({ type, payload }));
    },

    parseEvents(msg) {
        const { data } = msg;
        const { type, payload } = JSON.parse(data);
        return { type, payload };
    }

};

export default ClientService;