<template>
  <div class="mainpage">
    <img src="/static/images/StartGame.png" alt="картинка из четырёх карт, три из которых показаны рубашкой">
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
    name: 'MainPage',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      };
    }
  };
</script>

<style scoped>
  .mainpage {
    /*height: 100%;*/
    /*display: flex;*/
    /*flex-direction: column;*/
    /*align-items: center;*/
    /*justify-content: center;*/
    text-align: center;
  }

  .mainpage__header {
    margin-top: 3.3vh;
    opacity: 0.85;
    font-weight: bold;
    font-size: 28px;
    color: white;
    letter-spacing: 0.2px;
    text-transform: uppercase;
  }

  .mainpage__button-new-game {
    margin-top: 5.7vh;
    width: 144px;
    height: 42px;
    /* не используется opacity, так как тогда текст тоже будет прозрачным */
    /* хотя на него это бы не повлияло бы, так как его цвет совпадает с цветом фона */
    background: rgba(255, 255, 255, 0.85);
    border-radius: 4px;
    border: none;

    font-weight: bold;
    font-size: 16px;
    color: #1C7430;
    letter-spacing: 0;
    transition: transform .1s;
  }

  .mainpage__button-new-game:hover {
    cursor: pointer;
    transform: scale(1.2);
  }

  .mainpage__button-new-game:focus {
    /* я не придумал как переопределить outline, поэтому оставил стандартную рамку */
    /* outline: none; */
  }
</style>
