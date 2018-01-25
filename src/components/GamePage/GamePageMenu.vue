<template>
  <div class="menu">
    <button
      class="menu__button-new-game"
      data-tid="Menu-newGame"
      @click="onButtonNewGameClick"
    >
      Начать заново
    </button>
    <span class="menu__scores-title">Очки:</span>
    <span class="menu__scores-value" data-tid="Menu-scores">{{score}}</span>
  </div>
</template>

<style scoped>
  .menu {
    display: flex;
  }

  .menu__button-new-game, .menu__scores-title, .menu__scores-value {
    opacity: 0.8;
    font-size: 2vmin;
    color: white;
  }

  /* увеличение нажимаемой области кнопки (для удобства) */
  /* https://stackoverflow.com/questions/19246893/increasing-clickable-area-of-a-button */
  .menu__button-new-game:before {
    position: absolute;
    content: '';
    top: -1vh;
    right: -1vw;
    left: -1vw;
    bottom: -1vh;
  }

  .menu__button-new-game {
    position: relative; /* чтобы у .button:before работал position: absolute; */
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;

    font-weight: 600; /* semi-bold */
    letter-spacing: -0.25px;
  }

  .menu__button-new-game:active {
    color: #00e676;
  }

  .menu__scores-title {
    margin-left: auto;
    font-weight: bold;
    letter-spacing: 0;
  }

  .menu__scores-value {
    margin-left: 0.4vw;
    font-family: Krungthep, monospace;
    letter-spacing: 0;
  }
</style>

<script>
  export default {
    name: 'game-page-menu',
    props: ['score', 'onButtonNewGameClick']
  };
</script>
