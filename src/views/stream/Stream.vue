<template>
  <div id="stream" class="container">
    <Header></Header>
    <AddonManager :open="openAddons" v-on:closed="openAddons = false"></AddonManager>

    <div class="inner">
      <div class="meta">
        <div class="poster">
          <img v-bind:src="meta.poster" alt="">
        </div>
        <div class="info">
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

      <div class="streams">
        <h2>
          <ion-icon name="play-outline"></ion-icon> Streams
        </h2>

        <ul>
          <transition-group name="fade">
            <li class="no-streams" v-if="!streams.length">
              <p>No streams available</p>
              <button class="open" @click="openAddons = true"><ion-icon name="cube-outline"></ion-icon> Addons</button>
            </li>

            <li class="stream" v-for="(stream, i) in streams" :key="`${i}-${stream.infoHash}`" @click="createRoom(stream.infoHash)">
              <div class="icon">
                <img v-bind:src="stream.icon" alt="">
              </div>
              <div class="name" v-if="stream.name">{{ stream.name }}</div>
              <div class="title" :class="{ 'extend': !stream.name }">{{ stream.title }}</div>
            </li>
          </transition-group>
        </ul>
      </div>
    </div>
    
    <Footer></Footer>
  </div>
</template>

<script src="./stream.js"></script>
<style src="./stream.scss" lang="scss" scoped></style>