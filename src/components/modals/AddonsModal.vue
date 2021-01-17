<template>
    <Modal icon="extension-puzzle">
        <template #title>
            Addons
        </template>
        <template #default>
            <List :items="sharedState.addons" spaced @itemclick="toggleAddon($event)">
                <template #left="{ item }">
                    <div class="logo">
                        <img :src="item.manifest.logo" alt="" v-if="item.manifest.logo">
                        <ion-icon name="cube" v-else></ion-icon>
                    </div>
                    {{ item.manifest.name }}
                </template>
                <template #right="{ item }">
                    <ion-icon name="toggle" v-if="sharedState.localAddons.includes(item)"></ion-icon>
                    <ion-icon name="toggle-outline" class="mirrored" v-else></ion-icon>
                </template>
            </List>
        </template>
    </Modal>
</template>

<script>
import Modal from '../Modal';
import List from '../List';
import AddonsService from '../../services/addons';

export default {
    name: 'AddonsModal',
    components: {
        Modal,
        List
    },
    data() {
        return {
            sharedState: AddonsService.state
        }
    },
    methods: {
        toggleAddon(addon) {
            AddonsService.toggleInstall(addon);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../variables.scss';

.list {
    .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        width: 30px;
        background-color: rgba(white, 0.1);
        border-radius: 5px;
        overflow: hidden;

        ion-icon {
            font-size: 20px;
            color: rgba(white, 0.2) !important;
        }

        img {
            width: 30px;
        }
    }

    ion-icon {
        font-size: 25px;

        &:not(.mirrored) {
            color: $accent-color;
        }
    }
}
</style>