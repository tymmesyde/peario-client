<template>
    <div class="error">
        <div class="title">
            {{ $t(`errors.${type}.title`) }}
        </div>
        <div class="message">
            {{ $t(`errors.${type}.message`) }}
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
.error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 50%;
    height: 70px;
    width: 90vw;
    margin-left: -45vw;
    border-radius: 15px 15px 0 0;
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
    .error {
        top: 0;
        height: 65px;
        width: 50vh;
        margin-left: -25vh;
        border-radius: 0 0 15px 15px;
        animation: slide-down 0.1s ease-in-out;
    }
}
</style>