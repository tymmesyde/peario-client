<template>
    <Modal icon="settings">
        <template #title>
            Settings
        </template>
        <template #default>

        </template>
    </Modal>
</template>

<script>
import Modal from '../Modal';

export default {
    name: 'AddonsModal',
    components: {
        Modal
    }
}
</script>

<style lang="scss" scoped>
@import '../../variables.scss';

</style>