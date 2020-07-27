<template>
    <button :class="type" @click="$emit('click')">
        <ion-icon :name="icon"></ion-icon>
        {{ $t(translate) }}
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        type: String,
        icon: String,
        translate: String
    }
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

button {
	height: 5vh;
	background-color: $accent-color;
	border: 0.3vh solid $accent-color;
	border-radius: 7vh;
	padding: 0 2.5vh;
	font-family: 'Montserrat-SemiBold';
	font-size: 2vh;
	color: white;
	text-transform: none;
	box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.1);
	cursor: pointer;
	outline: none;
	transition: all 0.1s ease-in-out;

	&.big {
		height: 7vh;
		padding: 0 4vh;
		font-size: 2.75vh;
	}

	&:hover {
		background: transparent;
	}

	&:active {
		border-width: 0;
		box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.1) inset;
		background-color: $accent-color;
	}
}
</style>