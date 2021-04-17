import { mapGetters } from 'vuex';
import Title from '@/components/ui/Title.vue';
import TextInput from '@/components/ui/TextInput.vue';

export default {
    name: 'AddonManager',
    components: {
        Title,
        TextInput
    },
    props: {
        open: Boolean
    },
    data() {
        return {
            isOpen: false,
            manifestUrl: ''
        }
    },
    computed: mapGetters(['collection', 'installed']),
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
            return this.installed.includes(addon.manifest.id);
        },
        toggleAddon(addon) {
            if (this.isInstalled(addon)) this.$store.dispatch('uninstallAddon', addon);
            else this.$store.dispatch('installAddon', addon);
        },
        async addFromURL() {
            this.$store.dispatch('addUserAddon', this.manifestUrl);
            this.$store.dispatch('loadAddons', this.manifestUrl);
            this.manifestUrl = '';
        }
    }
};