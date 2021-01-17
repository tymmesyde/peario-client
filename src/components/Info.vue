<template>
    <div class="info">
        <ion-icon :name="icon"></ion-icon>
        <div class="text">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        icon: String
    }
}
</script>

<style lang="scss" scoped>
.info {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px;
    color: white;
    opacity: 0.2;

    ion-icon {
        padding-bottom: 5px;
        font-size: 30px;
    }

    .text {
        font-family: 'Montserrat-SemiBold';
        font-size: 15px;
    }
}
</style>