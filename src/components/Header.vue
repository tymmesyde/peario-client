<template>
    <header :class="{ 'home': isHome }">
		<div class="history-back" @click="$router.go(-1)" v-show="!isHome">
			<ion-icon name="arrow-back-sharp"></ion-icon>
		</div>

		<router-link class="logo" to="/">
			<img src="../assets/img/logo.svg">
		</router-link>

		<div class="version">
			{{ $store.getters.appVersion }}
		</div>

		<Locales></Locales>
    </header>
</template>

<script>
import Locales from './Locales';

export default {
	name: 'Header',
	components: {
		Locales
	},
	watch: {
		$route(to) {
			this.isHome = to.name === 'home';
		}
	},
	data() {
		return {
			isHome: true
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

header {
	z-index: 99;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: $header-height;
	line-height: $header-height;
	padding: 0 1vh;
	display: flex;
	align-items: center;
	transition: padding 0.1s ease-in-out;
	user-select: none;

	&.home {
		padding: 0 2.5vh;
	}

	.history-back {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 5.5vh;
		width: 5.5vh;
		border-radius: 100%;
		margin-right: 1.5vh;
		font-size: 3vh;
		cursor: pointer;
		transition: background-color 0.1s ease-in-out;

		&:hover {
			background-color: rgba(white, 0.1);
		}
	}

	.logo {
		width: 18vh;
		user-select: none;
		vertical-align: middle;
		display: flex;
		align-items: center;

		img {
			width: 100%;
		}
	}

	.version {
		margin-left: 2vh;
		opacity: 0.3;
	}
}
</style>