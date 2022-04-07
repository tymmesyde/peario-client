<template>
    <div class="error-wrapper">
        <div class="error">
            <div class="title">
                {{ $t(`errors.${type}.title`) }}
            </div>
            <div class="message">
                {{ $t(`errors.${type}.message`) }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error',
    props: {
        type: String
    }
}
</script>

<style lang="scss" scoped>
.error-wrapper {
    z-index: 99;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 100vw;
    height: 100vh;
}

.error {
    padding: 10px;
    width: 90vw;
    max-width: 550px;
    border-radius: 15px 15px 0 0;
    text-align: center;
    color: $text-color;
    background-color: $danger-color;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    animation: slide-up 0.1s ease-in-out;

    .title {
        text-transform: uppercase;
        font-family: 'Montserrat-Bold';
    }

    .message {
        font-family: 'Montserrat-Medium';
        opacity: 0.7;
    }
}

@media only screen and (min-width: 768px) {
    .error-wrapper {
        align-items: flex-start;
    }
    .error {
        max-width: 400px;
        border-radius: 0 0 15px 15px;
        animation: slide-down 0.1s ease-in-out;
    }
}
</style>