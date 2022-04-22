<template>
  <footer>
    <iframe
        src="https://viewm.moonicorn.network/#%7B%22options%22%3A%7B%22publisherAddr%22%3A%220x7bf26452A91857Fb1334414D8F0Ea1F900Cf44dd%22%2C%22whitelistedTokens%22%3A%5B%220x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359%22%2C%220x6B175474E89094C44Da98b954EedeAC495271d0F%22%5D%2C%22whitelistedType%22%3A%22legacy_728x90%22%2C%22randomize%22%3Atrue%2C%22targeting%22%3A%5B%7B%22tag%22%3A%22music%20streams%20%26%20downloads%22%2C%22score%22%3A100%7D%2C%7B%22tag%22%3A%22web%20apps%20%26%20online%20tools%22%2C%22score%22%3A100%7D%2C%7B%22tag%22%3A%22music%20%26%20audio%22%2C%22score%22%3A100%7D%2C%7B%22tag%22%3A%22movies%22%2C%22score%22%3A100%7D%2C%7B%22tag%22%3A%22computer%20%26%20video%20games%22%2C%22score%22%3A50%7D%2C%7B%22tag%22%3A%22france%22%2C%22score%22%3A50%7D%2C%7B%22tag%22%3A%22visual%20art%20%26%20design%22%2C%22score%22%3A75%7D%2C%7B%22tag%22%3A%22photographic%20%26%20digital%20arts%22%2C%22score%22%3A50%7D%2C%7B%22tag%22%3A%22web%20services%22%2C%22score%22%3A100%7D%2C%7B%22tag%22%3A%22photo%20%26%20video%20services%22%2C%22score%22%3A75%7D%2C%7B%22tag%22%3A%22photo%20%26%20video%20sharing%22%2C%22score%22%3A100%7D%2C%7B%22tag%22%3A%22video%20game%20development%22%2C%22score%22%3A75%7D%2C%7B%22tag%22%3A%22online%20games%22%2C%22score%22%3A50%7D%2C%7B%22tag%22%3A%22games%22%2C%22score%22%3A50%7D%2C%7B%22tag%22%3A%22usa%22%2C%22score%22%3A50%7D%5D%2C%22width%22%3A%22728%22%2C%22height%22%3A%2290%22%2C%22minPerImpression%22%3A%220%22%2C%22minTargetingScore%22%3A%220%22%2C%22fallbackUnit%22%3Anull%2C%22marketSlot%22%3A%22QmaDwmA43qzZYBfBEJEDk4TenJ1MUeXqS3UYkVncQMLNo7%22%7D%7D"
        width="728"
        height="90"
        scrolling="no"
        frameborder="0"
        style="border: 0"
        onload="window.addEventListener('message', function(ev) {
          if (ev.data.hasOwnProperty('adexHeight') && ('https://viewm.moonicorn.network' === ev.origin)) {
            for (let f of document.getElementsByTagName('iframe')) {
              if (f.contentWindow === ev.source) {
                f.height = ev.data.adexHeight;
              }
            }
          }
        }, false)"
    ></iframe>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/main";

footer {
  display: none;
  z-index: 96;
  position: fixed;
  bottom: 0;
  height: $footer-height;
  width: 100%;
  text-align: center;
}

@media only screen and (min-width: 768px) and (min-height: 768px) {
  footer {
    display: inherit;
  }
}
</style>
