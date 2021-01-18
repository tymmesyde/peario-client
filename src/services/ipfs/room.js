import { EventEmitter } from 'events';
import all from 'it-all';
import PubSubRoom from 'ipfs-pubsub-room';

class Room extends EventEmitter {
    constructor(ipfs, id, identity) {
        super();

        this.ipfs = ipfs;
        this.ready = false;
        this.id = id;
        this.identity = identity;
        this.owner = null;
        this.meta = {};
        this.stream = {};
        this.peers = [identity.id];
        this.messages = [];
    }

    async init() {
        const { owner, meta, stream } = JSON.parse((await all(this.ipfs.cat(this.id))).toString());
        if (owner !== this.identity.id) this.ipfs.swarm.connect(`/p2p-circuit/ipfs/${owner}`);

        this.owner = owner;
        this.meta = meta;
        this.stream = stream;
        this.ready = (this.owner === this.identity.id);

        this.pubsub = new PubSubRoom(this.ipfs, this.id);
        this.pubsub.on('message', this._handleEvent.bind(this));
        this.pubsub.on('peer joined', this._handlePeerJoined.bind(this));
        this.pubsub.on('peer left', this._handlePeerLeft.bind(this));
    }

    sendEvent(type, payload) {
        return this.pubsub.broadcast(Buffer.from(JSON.stringify({
            type,
            payload
        })));
    }

    _handleEvent({ from, data }) {
        try {
            const { type, payload } = JSON.parse(data.toString());

            if (type === 'sync' && from !== this.owner) return;
            if (type === 'msg' && payload.length) this.messages.push({ peer: from, content: payload.length > 150 ? payload.slice(0, 150).concat('...') : payload });

            this.emit(type, payload);
        } catch(e) {
            console.log(e);
        }
    }

    _handlePeerJoined(id) {
        this.peers.push(id);
        this.peers = [...new Set(this.peers)];
        if (id === this.owner) this.ready = true;
    }

    _handlePeerLeft(id) {
        this.peers = this.peers.filter(p => p !== id);
    }
}

export default Room;