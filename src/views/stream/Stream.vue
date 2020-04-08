<template>
  <div id="stream" class="container">
    <Header></Header>
    <AddonManager></AddonManager>

    <div class="inner">
      <div class="meta">
        <div class="poster">
          <img v-bind:src="meta.poster" alt="">
        </div>
        <div class="title">{{ meta.name }}</div>
        <div class="year">{{ meta.year }}</div>
        <div class="description">{{ meta.description }}</div>
      </div>

      <div class="streams">
        <h2>
          <ion-icon name="play-outline"></ion-icon> Streams
        </h2>

        <ul>
          <li class="no-streams" v-if="!streams.length">
            <p>No streams available</p>
            <button class="open"><ion-icon name="cube-outline"></ion-icon> Addons</button>
          </li>

          <li class="stream" v-for="stream in streams" v-bind:key="stream.infoHash" @click="createRoom(stream.infoHash)">
            <div class="icon">
              <img v-bind:src="stream.icon" alt="">
            </div>
            <div class="name">{{ stream.name }}</div>
            <div class="title">{{ stream.title }}</div>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
</template>

<script src="./stream.js"></script>
<style src="./stream.scss" lang="scss" scoped></style>