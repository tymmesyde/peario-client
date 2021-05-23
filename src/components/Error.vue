<template>
    <div class="error">
        <div class="close" @click="$emit('close')">
			<ion-icon name="close-sharp"></ion-icon>
		</div>
        <div class="content">
            <ion-icon name="close-circle-outline" class="icon danger"></ion-icon>
            <Title type="secondary" :translate="`errors.${type}.title`"/>
            <div class="message">
                {{ $t(`errors.${type}.message`) }}
            </div>
        </div>
    </div>
</template>

<script>
import Title from '@/components/ui/Title.vue';

export default {
    name: 'Error',
    components: {
        Title
    },
    props: {
        type: String
    },
    emits: ['close']
}
</script>

<style lang="scss" scoped>
.close {
    position: absolute;
    top: 2.5vh;
    right: 2.5vh;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 5.5vh;
    width: 5.5vh;
    border-radius: 100%;
    font-size: 3vh;
    color: $text-color;
    cursor: pointer;
    transition: background-color 0.1s ease-in-out;

    &:hover {
        background-color: rgba(white, 0.1);
    }
}

.error {
    z-index: 99;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    text-align: center;
    background-color: $primary-color;

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        .icon {
            font-size: 15vh;
            --ionicon-stroke-width: 30px;
        }

        .message {
            font-family: 'Montserrat-Medium';
            font-size: 20px;
            color: $text-color;
            opacity: 0.5;
        }
    }
}
</style>