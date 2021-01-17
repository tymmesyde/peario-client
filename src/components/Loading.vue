<template>
    <div class="loading">
        <ion-icon class="loading" name="sync"></ion-icon>
        <div class="text">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loading'
}
</script>

<style lang="scss" scoped>
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: white;
    
    ion-icon {
        font-size: 35px;
        transform-origin: center;
        animation: spin 1.5s infinite linear;
    }

    .text {
        font-family: 'Montserrat-SemiBold';
        font-size: 15px;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>