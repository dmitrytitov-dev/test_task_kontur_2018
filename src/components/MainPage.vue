<template>
  <div class="mainpage">
    <img class="mainpage__image" src="/static/images/StartGame@2x.png" alt="картинка из четырёх карт, три из которых показаны рубашкой">
    <!--<img class="mainpage__image" src="/static/images/StartGame.png" alt="картинка из четырёх карт, три из которых показаны рубашкой">-->
    <div class="mainpage__header">Memory game</div>
    <router-link
      tag="button"
      to="/game"
      @click.native="$event.target.blur()"
      class="mainpage__button-new-game"
      data-tid="NewGame-startGame">Начать игру
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'MainPage'
  };
</script>

<style scoped>
  .mainpage {
    text-align: center;
  }

  .mainpage__image {
    width: 40vw;
  }

  @media all and (orientation: portrait) {
    .mainpage__image {
      width: 80vw;
    }
  }

  .mainpage__header {
    margin-top: 3.3vh;
    opacity: 0.85;
    font-weight: bold;
    /*font-size: 28px;*/
    font-size: 5.3vmin;
    color: white;
    letter-spacing: 0.2px;
    text-transform: uppercase;
  }

  .mainpage__button-new-game {
    margin-top: 5.7vh;
    /*width: 144px;*/
    /*height: 42px;*/
    /*width: 11vw;*/
    /*height: 7vh;*/
    padding: 10px 20px;
    /* не используется opacity, так как тогда текст тоже будет прозрачным */
    /* хотя на него это бы не повлияло бы, так как его цвет совпадает с цветом фона */
    background: rgba(255, 255, 255, 0.85);
    border-radius: 4px;
    border: none;

    font-weight: bold;
    /*font-size: 16px;*/
    font-size: 3vmin;
    color: #1C7430;
    letter-spacing: 0;
    transition: transform .1s;
  }

  .mainpage__button-new-game:hover {
    cursor: pointer;
    transform: scale(1.2);
  }

  .mainpage__button-new-game:active {
    color: #2196f3;
  }

  .mainpage__button-new-game:focus {
    /* я не придумал как переопределить outline, поэтому оставил стандартную рамку */
    /* outline: none; */
  }
</style>
