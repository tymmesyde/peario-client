<template>
	<div id="stream" class="container">
		<AddonManager :open="openAddons" v-on:closed="openAddons = false"></AddonManager>

		<div class="inner center col-10">
			<div class="meta col-6">
				<div class="poster col-5">
					<img v-bind:src="meta.poster" alt="">
				</div>
				<div class="info col-7">
					<div class="title">{{ meta.name }}</div>
					<div class="year">{{ meta.year }}</div>
					<div class="runtime">{{ meta.runtime }}</div>
					<div class="description">{{ meta.description }}</div>
					<div class="genres">
						<div class="genre" v-for="genre of meta.genre" v-bind:key="genre">
							{{ genre }}
						</div>
					</div>
				</div>
			</div>

			<div class="series col-3" v-if="isSeries">
				<Segments :segments="seasons" v-model="selected.season">
					<template #segment="{ segment }">
						<span v-if="segment > 0">{{ $t(`views.stream.season`) }} {{ segment }}</span>
						<span v-else>{{ $t(`views.stream.misc`) }}</span>
					</template>
				</Segments>

				<List class="episodes" v-model="selected.episode" itemClass="episode" :items="filterVideos" itemKey="id" #default="{ item }">
					<div class="number">{{ item.episode }}</div>
					<div class="name">{{ item.name }}</div>
				</List>
			</div>

			<div class="streams col-3">
				<Title icon="play-outline" type="secondary" translate="views.stream.streams.title"/>

				<div class="no-streams" v-if="!streams.length">
					<div>
						<ion-icon name="sad"></ion-icon>
						<p>{{ $t(`views.stream.streams.error`) }}</p>
					</div>
				</div>

				<List class="episodes" itemClass="stream" :items="streams" itemKey="infoHash" #default="{ item }" @click="createRoom($event.infoHash)">
					<div class="icon">
						<img v-bind:src="item.icon" alt="">
						<ion-icon class="outline" name="play-outline"></ion-icon>
						<ion-icon class="filled" name="play"></ion-icon>
					</div>
					<div class="name" v-if="item.name">{{ item.name }}</div>
					<div class="title" :class="{ 'extend': !item.name }">{{ item.title }}</div>
				</List>

				<Button icon="cube-outline" translate="views.stream.streams.button" @click="openAddons = true"/>
			</div>
		</div>
	</div>
</template>

<script src="./stream.js"></script>
<style src="./stream.scss" lang="scss"></style>