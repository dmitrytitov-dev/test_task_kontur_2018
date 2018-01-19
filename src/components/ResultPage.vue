<template>
  <div class="result-page">
    <img class="result-page__image responsive-image"
         src="/static/images/EndGame.png"
         srcset="/static/images/EndGame.png 508w,
                 /static/images/EndGame@2x.png 1016w"
         sizes="40vw"
         alt="картинка из четырёх карт (лицевой стороной)">
    <h1 class="result-page__header header">
      Поздравляем!<br>
      Ваш итоговый счёт: {{score}}
    </h1>
    <button
      @click="onButtonRetryGameClick"
      class="result-page__button-new-game button"
      data-tid="EndGame-retryGame"
    >Ещё раз
    </button>
  </div>
</template>

<script>
  export default {
    name: 'result-page',
    props: ['score', 'moveToGamePage'],
    methods: {
      onButtonRetryGameClick(event) {
        event.target.blur();
        this.moveToGamePage();
      }
    }
  };
</script>

<style scoped>
  .result-page {
    text-align: center;
  }

  .result-page__header {
    margin-top: 1.5vh;
    margin-bottom: 6.7vh;
    font-size: 4.9vmin;
    line-height: 5.7vmin;
    letter-spacing: 0.15px;
  }
</style>
