<template>
  <!-- компонент для предзагрузки изображений и шрифтов, которые понадобятся в процессе игры -->
  <!-- в первую очередь нужен чтобы изображения карт начинали загружаться сразу, а не после нажатия на кнопку «Начать игру» -->

  <div class="placeholder">
    <!-- Шрифты Rrungthep и Open Sans в полужирном начертании используются на экране игры -->
    <div class="placeholder__krungthep-font">0123456789-</div>
    <div class="placeholder__open-sans-font-bold">Очки</div>

    <!-- картинки карт -->
    <img
      v-for="card of allCards"
      :src="`static/cards/${card}.png`"
      class="placeholder__image"
    >
    <img src="static/backside.png" class="placeholder__image">

    <!-- картинка для экрана с результатами -->
    <img
      src="static/images/EndGame.png"
      srcset="static/images/EndGame.png 508w,
              static/images/EndGame@2x.png 1016w"
      sizes="40vw"
      class="placeholder__image"
    >
  </div>
</template>

<style scoped>
  .placeholder {
    position: absolute;
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
  }

  .placeholder__krungthep-font {
    font-family: Krungthep, monospace;
  }

  .placeholder__open-sans-font-bold {
    font-family: 'Open Sans', sans-serif;
    font-weight: bold;
  }
</style>

<script>
  import {allCards} from '@/components/GamePage/Game';

  export default {
    name: 'placeholder-for-preloading-images-and-font',
    data() {
      return {
        allCards
      };
    }
  };
</script>
