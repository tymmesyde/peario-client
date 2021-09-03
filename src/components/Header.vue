<template>
    <header :class="{ 'home': isHome }">
		<div class="container">
			<div class="history-back" @click="$router.go(-1)" v-show="!isHome">
				<ion-icon name="arrow-back-sharp"></ion-icon>
			</div>

			<router-link class="logo" to="/">
				<img src="../assets/img/logo.svg">
			</router-link>

			<div class="version">
				{{ appVersion }}
			</div>
		</div>

		<div class="container">
			<Button clear icon="cube-outline" v-model="showAddons"></Button>
			<Button clear icon="settings-outline" v-model="showSettings"></Button>
		</div>
    </header>

	<transition name="fade">
		<AddonManager v-model="showAddons" v-if="showAddons"></AddonManager>
	</transition>

	<transition name="fade">
		<Settings v-model:show="showSettings"></Settings>
	</transition>
</template>

<script>
import store from '../store';
import Button from './ui/Button.vue';
import Settings from './Settings';
import AddonManager from '@/components/AddonManager.vue';

export default {
	name: 'Header',
	components: {
		Button,
		Settings,
		AddonManager
	},
	computed: {
		appVersion() {
			return store.state.info.appVersion;
		}
	},
	watch: {
		$route(to) {
			this.isHome = to.name === 'home';
		}
	},
	data() {
		return {
			isHome: true,
			showAddons: false,
			showSettings: false
		}
	}
}
</script>

<style lang="scss" scoped>
header {
	z-index: 99;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: $header-height-mobile;
	line-height: $header-height-mobile;
	padding: 0 5px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	transition: padding 0.1s ease-in-out;
	user-select: none;

	&.home {
		padding: 0 20px;
	}

	.container {
		display: flex;
		align-items: center;
		gap: 10px;

		.history-back {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 45px;
			width: 45px;
			border-radius: 100%;
			font-size: 25px;
			color: $text-color;
			cursor: pointer;
			transition: background-color 0.1s ease-in-out;

			&:hover {
				background-color: rgba(white, 0.1);
			}
		}

		.logo {
			width: 100px;
			user-select: none;
			vertical-align: middle;
			display: flex;
			align-items: center;

			img {
				width: 100%;
			}
		}

		.version {
			font-family: 'Montserrat-SemiBold';
			font-size: 15px;
			color: $text-color;
			opacity: 0.3;
		}
	}
}

@media only screen and (min-width: 768px) and (min-height: 768px) {
    header {
		height: $header-height;
		line-height: $header-height;
		padding-left: 5px;
		padding-right: 20px;

		.container {
			gap: 15px;

			.logo {
				width: 150px;
			}
		}
    }
}
</style>