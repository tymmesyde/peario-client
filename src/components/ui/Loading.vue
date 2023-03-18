<template>
    <div class="loading">
        <ion-icon name="sync-outline" class="icon spin"></ion-icon>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.loading {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    .icon {
        font-size: 4rem;
        color: $text-color;
        --ionicon-stroke-width: 20px;
    }
}
</style>