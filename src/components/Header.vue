<template>
    <header>
        <div class="title">
            <Button class="back-button" icon="arrow-back-sharp" clear @click="goBack()"></Button>
            <img src="../assets/logo.png" alt="">
        </div>

        <Button icon="settings-outline" clear @click="settings = true"></Button>
    </header>

    <SettingsModal v-model="settings"></SettingsModal>
</template>

<script>
import IpfsService from '../services/ipfs';
import Button from './Button';
import SettingsModal from './modals/SettingsModal';

export default {
    name: 'Header',
    components: {
        Button,
        SettingsModal
    },
    data() {
        return {
            sharedState: IpfsService.state,
            settings: false
        }
    },
    methods: {
        goBack() {
            window.history.back();
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

header {
    z-index: 99;
    position: sticky;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $header-height;
    padding: 0 25px;

    .title {
        display: flex;
        align-items: center;
        gap: 30px;

        img {
            width: 16vh;
        }
    } 
}

@media only screen and (min-width: 768px) {
    .back-button {
        // display: none;
    }
}
</style>