<template>
  <div class="main-page">
    <img class="main-page__image responsive-image"
         srcset="/static/images/StartGame.png 501w,
                 /static/images/StartGame@2x.png 1002w"
         sizes="40vw"
         src="/static/images/StartGame.png"
         alt="картинка из четырёх карт, три из которых показаны рубашкой">
    <h1 class="main-page__header header">Memory game</h1>
    <router-link
      tag="button"
      to="/game"
      @click.native="$event.target.blur()"
      class="main-page__button-new-game button"
      data-tid="NewGame-startGame"
    >Начать игру
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'main-page'
  };
</script>

<style scoped>
  .main-page {
    text-align: center;
  }

  .main-page__header {
    margin-top: 3.3vh;
    margin-bottom: 5.7vh;
    font-size: 5.3vmin;
    letter-spacing: 0.2px;
    text-transform: uppercase;
  }
</style>
