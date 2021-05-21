<template>
    <div class="error">
        <div class="close" @click="$emit('input', null)">
			<ion-icon name="close-sharp"></ion-icon>
		</div>
        <div>
            <ion-icon name="close-circle-outline" class="icon danger"></ion-icon>
            <Title type="secondary" :translate="`errors.${value.type}.title`"/>
            <p>{{ $t(`errors.${modelValue.type}.message`) }}</p>
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
        modelValue: Object
    }
}
</script>

<style lang="scss" scoped>
    @import '@/variables.scss';

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
		cursor: pointer;
		transition: background-color 0.1s ease-in-out;

		&:hover {
			background-color: rgba(white, 0.1);
		}
	}

    .error {
        z-index: 99;
        position: absolute;
        display: grid;
        place-items: center;
        height: 100%;
        width: 100%;
        text-align: center;
        line-height: 3.5vh;
        background: $background-gradient;

        .icon {
            font-size: 15vh;
        }
    }
</style>