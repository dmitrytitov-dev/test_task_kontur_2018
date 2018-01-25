<template>
  <div id="app" data-tid="App">
    <intro-page
      v-if="state === State.INTRO"
      :moveToGamePage="moveToGamePage"
    ></intro-page>
    <game-page
      v-if="state === State.GAME"
      :moveToResultPage="moveToResultPage"
    ></game-page>
    <result-page
      v-if="state === State.RESULT"
      :score="score"
      :moveToGamePage="moveToGamePage"
    ></result-page>
  </div>
</template>

<style>
  /* импорт стилей, общих для IntroPage и ResultPage */
  /* bмпортируется в главный компонент, в целях избежания дублирования кода в скомпилированном css */
  @import "styles/page-with-image-title-and-button.css";

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
</style>

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
        state: State.INTRO,
        // state: State.GAME,
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
