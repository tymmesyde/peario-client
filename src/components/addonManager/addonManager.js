import Title from '@/components/ui/Title.vue';

import StremioService from '@/services/stremio.service';
import StorageService from '@/services/storage.service';
import AddonService from '@/services/addon.service';

export default {
    name: 'AddonManager',
    components: {
        Title
    },
    props: {
        open: Boolean
    },
    data: () => {
        return {
            isOpen: false,
            addons: [],
            installed: []
        }
    },
    watch: {
        open(state) {
            this.isOpen = state;
        },
        isOpen() {
            if (!this.isOpen) this.$emit('closed');
        }
    },
    methods: {
        capitalize(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        isInstalled(addon) {
            return this.installed.find(i => i.transportUrl === addon.transportUrl) ? true : false;
        },
        toggleAddon(addon) {
            if (this.isInstalled(addon)) this.installed = this.installed.filter(({
                transportUrl
            }) => transportUrl !== addon.transportUrl);
            else this.installed.unshift(addon);

            StorageService.set('installed', this.installed);
        }
    },
    async mounted() {
        const addons = await StremioService.getAddons();
        const streamCol = AddonService.createStreamCollection(addons);
        this.addons = streamCol;
        this.installed = StorageService.get('installed') || [];
    }
};