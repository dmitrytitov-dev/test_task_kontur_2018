<template>
  <div class="intro-page">
    <img
      class="intro-page__image responsive-image"
      srcset="/static/images/StartGame.png 501w,
              /static/images/StartGame@2x.png 1002w"
      sizes="40vw"
      src="/static/images/StartGame.png"
      alt="картинка из четырёх карт, три из которых показаны рубашкой"
    >
    <h1 class="intro-page__header header">Memory game</h1>
    <button
      class="intro-page__button-new-game button"
      @click="onButtonNewGameClick"
      data-tid="NewGame-startGame"
    >
      Начать игру
    </button>
  </div>
</template>

<style scoped>
  .intro-page {
    text-align: center;
  }

  .intro-page__header {
    margin-top: 3.3vh;
    margin-bottom: 5.7vh;
    font-size: 5.3vmin;
    letter-spacing: 0.2px;
    text-transform: uppercase;
  }
</style>

<script>
  export default {
    name: 'intro-page',
    props: ['moveToGamePage'],
    methods: {
      onButtonNewGameClick(event) {
        event.target.blur();
        this.moveToGamePage();
      }
    }
  };
</script>
