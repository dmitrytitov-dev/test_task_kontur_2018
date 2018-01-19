<template>
  <div id="app" data-tid="App">
    <intro-page v-if="state === State.INTRO"
               :moveToGamePage="moveToGamePage"
    ></intro-page>
    <game-page v-if="state === State.GAME"
               :moveToResultPage="moveToResultPage"
    ></game-page>
    <result-page v-if="state === State.RESULT"
                 :score="score"
                 :moveToGamePage="moveToGamePage"
    ></result-page>
  </div>
</template>

<script>
  import IntroPage from '@/components/IntroPage';
  import GamePage from '@/components/GamePage/GamePage';
  import ResultPage from '@/components/ResultPage';

  // enum с элементами, соответствующими экранам
  const State = Object.freeze({
    INTRO: 0,
    GAME: 1,
    RESULT: 2
  });

  export default {
    name: 'App',
    components: {ResultPage, GamePage, IntroPage},
    data() {
      return {
        // state: State.INTRO,
        state: State.GAME,
        score: null,
        State
      };
    },
    methods: {
      moveToGamePage() {
        this.state = State.GAME;
      },
      moveToResultPage(score) {
        this.score = score;
        this.state = State.RESULT;
      }
    }
  };
</script>

<style>
  html, body, #app {
    height: 100%;
  }

  #app {
    font-family: 'Open Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #1C7430;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @font-face {
    font-family: Krungthep;
    src: url("/static/fonts/Krungthep1.ttf");
  }

  button:active:focus {
    outline: none;
  }

  /* ======= адаптивное изображение на страницах начала и конца игры ======= */

  .responsive-image {
    width: 40vw;
  }

  @media all and (orientation: portrait) {
    .responsive-image {
      width: 80vw;
    }
  }

  /* ======= заголовок ======= */

  .header {
    opacity: 0.85;
    font-weight: bold;
    color: white;
  }

  /* ======= белая кнопка с зелёным текстом на зелёном фоне  */

  .button {
    padding: 10px 20px;
    /* не используется opacity, так как тогда текст тоже будет прозрачным */
    /* хотя на него это бы не повлияло бы, так как его цвет совпадает с цветом фона */
    background: rgba(255, 255, 255, 0.85);
    border-radius: 4px;
    border: none;

    font-weight: bold;
    font-size: 3vmin;
    color: #1C7430;
    letter-spacing: 0;
    transition: transform .1s;
  }

  .button:hover {
    cursor: pointer;
    transform: scale(1.2);
  }

  .button:active {
    color: #2196f3;
  }

  .button:focus {
    /* я не придумал как переопределить outline, поэтому оставил стандартную рамку */
    /* outline: none; */
  }
</style>
