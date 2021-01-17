<template>
    <Modal :disabled="loading || !room.ready">
        <template #default>
            <Meta :value="room.meta"/>
            <Loading v-if="loading || !room.ready">
                Loading the room ...
            </Loading>
        </template>
        <template #button>
            Ready !
        </template>
    </Modal>
</template>

<script>
import Modal from '../Modal';
import Meta from '../Meta.vue';
import Loading from '../Loading.vue';

export default {
    name: 'RoomModal',
    components: {
        Modal,
        Meta,
        Loading
    },
    props: {
        room: Object,
        loading: Boolean
    }
}
</script>

<style lang="scss" scoped>
@import '../../variables.scss';

.logo {
    display: block;
    width: 250px;
    user-select: none;
}

.title {
    font-family: 'Montserrat-Bold';
    font-size: 45px;
}
</style>