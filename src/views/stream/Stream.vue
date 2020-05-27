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
        <ul class="segments">
          <li v-for="season in seasons" :key="season" :class="{ 'active': selected.season === season }" @click="selected.season = season">
            <span v-if="season > 0">{{ $t(`views.stream.season`) }} {{ season }}</span>
            <span v-else>Miscellaneous</span>
          </li>
        </ul>
        <ul class="list episodes">
          <li v-for="video in filterVideos()" :key="video.id" :class="{ 'active': selected.episode === video.episode }" @click="selected.episode = video.episode">
            <div class="number">{{ video.episode }}</div>
            <div class="name">{{ video.name }}</div>
          </li>
        </ul>
      </div>

      <div class="streams col-3">
        <h2>
          <ion-icon name="play-outline"></ion-icon> {{ $t(`views.stream.streams.title`) }}
        </h2>

        <ul class="list">
          <transition name="fade">
            <li class="no-streams" v-if="!streams.length">
              <div>
                <ion-icon name="sad"></ion-icon>
                <p>{{ $t(`views.stream.streams.error`) }}</p>
              </div>
            </li>
          </transition>

          <transition-group name="fade">
            <li class="stream" v-for="(stream, i) in streams" :key="`${i}-${stream.infoHash}`" @click="createRoom(stream.infoHash)">
              <div class="icon">
                <img v-bind:src="stream.icon" alt="">
                <ion-icon class="outline" name="play-outline"></ion-icon>
                <ion-icon class="filled" name="play"></ion-icon>
              </div>
              <div class="name" v-if="stream.name">{{ stream.name }}</div>
              <div class="title" :class="{ 'extend': !stream.name }">{{ stream.title }}</div>
            </li>
          </transition-group>
        </ul>

        <button @click="openAddons = true">
          <ion-icon name="cube-outline"></ion-icon> {{ $t(`views.stream.streams.button`) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script src="./stream.js"></script>
<style src="./stream.scss" lang="scss" scoped></style>