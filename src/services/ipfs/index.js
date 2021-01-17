import { reactive } from 'vue';
import { create } from 'ipfs';
import Room from './room';

export default {

    ipfs: null,
    pubsub: null,
    state: reactive({
        identity: {},
        room: {
            meta: {},
            stream: {},
            peers: [],
            messages: []
        }
    }),

    async init() {
        this.ipfs = await create({
            preload: false,
            libp2p: {
                config: {
                    dht: {
                        enabled: true
                    }
                }
            },
            config: {
                Addresses: {
                    Swarm: [
                        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                        '/dns4/akasha.cloud/tcp/443/wss/p2p-webrtc-star/'
                    ]
                }
            }
        });

        this.state.identity = await this.ipfs.id();
    },

    async createRoom(meta, stream) {
        const { name, logo, background, year, runtime, description, genres } = meta;

        const room = {
            owner: this.state.identity.id,
            meta: {
                name,
                logo,
                background,
                year,
                runtime,
                description,
                genres
            },
            stream
        };

        const { cid } = await this.ipfs.add(Buffer.from(JSON.stringify(room)));
        return cid.toString();
    },

    async joinRoom(id) {
        try {
            this.state.room = new Room(this.ipfs, id, this.state.identity);
            await this.state.room.init();
            return this.state.room;
        } catch(e) {
            console.log(e);
            console.log('Unable to load the room');
        }
    },

    syncRoom(payload) {
        const { room, identity } = this.state;
        if (room.owner === identity.id) this.state.room.sendEvent('sync', payload);
    },

    sendMessage(content) {
        this.state.room.sendEvent('msg', content);
    }

}