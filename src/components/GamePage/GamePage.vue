<template>
  <div class="game-page" v-if="game">
    <game-page-menu
      class="game-page__menu"
      ref="menu"
      v-bind="{score: scoreDelayed, onButtonNewGameClick}"
    ></game-page-menu>
    <game-page-cards
      class="game-page__cards"
      ref="cards"
      v-bind="{cards, onCardClick}"
    ></game-page-cards>
    <game-page-card-disappear-animation
      v-for="animation of cardDisappearAnimations"
      class="game-page__card-disappear-animation"
      :animation="animation"
    ></game-page-card-disappear-animation>
  </div>
</template>

<style scoped>
  .game-page {
    position: relative;
  }

  .game-page__cards {
    margin-top: 4vh;
  }

  .game-page__card-disappear-animation {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    pointer-events: none;
  }
</style>

<script>
  import GamePageMenu from '@/components/GamePage/GamePageMenu';
  import Game from './Game.js';
  import GamePageCards from '@/components/GamePage/GamePageCards';
  import GamePageCardDisappearAnimation from '@/components/GamePage/GamePageCardDisappearAnimation';
  import {GAME_CARDS_FLIP_ANIMATION_DURATION, GAME_DELAY_BETWEEN_CARD_OPEN_AND_DISAPPEAR_START, GAME_DELAY_BETWEEN_CARD_OPEN_AND_FLIP_START, GAME_DELAY_BETWEEN_GAME_START_AND_FLIP_ALL_CARDS} from '@/components/constants';

  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  export default {
    name: 'game-page',
    components: {
      GamePageMenu,
      GamePageCards,
      GamePageCardDisappearAnimation
    },
    props: ['moveToResultPage'],
    data() {
      return {
        gameId: 0,
        game: null,
        cards: null,
        scoreDelayed: null,
        firstFlippedCard: null,
        cardDisappearAnimations: []
      };
    },
    mounted() {
      console.clear();
      this.startNewGame();
      this.$nextTick(() => this.onResize());
      window.addEventListener('resize', this.onResize);
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.onResize);
    },
    methods: {
      async startNewGame() {
        let currentGameId = ++this.gameId;
        this.game = new Game();
        this.cards = this.game.cards.map((cardName, index) => ({index, name: cardName, flipped: true, associated: false}));
        this.scoreDelayed = 0;
        this.firstFlippedCard = null;
        this.cardDisappearAnimations = [];

        await sleep(GAME_DELAY_BETWEEN_GAME_START_AND_FLIP_ALL_CARDS);
        // проверка на случай, если в течении первых пяти секунд пользователь нажал кнопку начала новой игры
        if (currentGameId === this.gameId) {
          for (let card of this.cards) {
            card.flipped = false;
          }
        }
      },
      onResize() {
        let windowWidth = document.documentElement.clientWidth;
        let windowHeight = document.documentElement.clientHeight;
        let gridMaxWidth = 0.6 * windowWidth;
        let gridMaxHeight = 0.8 * windowHeight;
        let gridGap = 0.03 * Math.min(windowWidth, windowHeight);
        let cardScale = Math.min(
          (gridMaxWidth - gridGap * 5) / 6 / 226,
          (gridMaxHeight - gridGap * 2) / 3 / 314
        );
        if (this.$refs.cards) {
          this.$refs.cards.$el.style.setProperty('--card-scale', cardScale);
        }
      },
      async onCardClick(card) {
        if (card.flipped) {
          return;
        }
        card.flipped = true;

        if (this.firstFlippedCard === null) {
          this.firstFlippedCard = card;
          return;
        }

        let firstFlippedCard = this.firstFlippedCard;
        this.firstFlippedCard = null;

        await sleep(GAME_CARDS_FLIP_ANIMATION_DURATION);
        let score = this.game.score;
        let associated = this.game.flipPair(card.index, firstFlippedCard.index);
        let scoreDelta = this.game.score - score;
        if (associated) {
          await this.disappearCardPair(card, firstFlippedCard);
        } else {
          await this.flipCardPair(card, firstFlippedCard);
        }
        this.scoreDelayed += scoreDelta;
      },
      async flipCardPair(card1, card2) {
        await sleep(GAME_DELAY_BETWEEN_CARD_OPEN_AND_FLIP_START);
        card1.flipped = card2.flipped = false;
      },
      async disappearCardPair(card1, card2) {
        await sleep(GAME_DELAY_BETWEEN_CARD_OPEN_AND_DISAPPEAR_START);
        card1.associated = card2.associated = true;
        card1.flipped = card2.flipped = false;
        this.disappearCard(card1);
        this.disappearCard(card2);

        // столько длится анимация в компоненте GamePageCardDisappearAnimation,
        // можно было передавать это значение как параметр в тот компонент, но я не стал
        await sleep(800);
        if (this.game.isGameEnd()) {
          this.moveToResultPage(this.game.score);
        }
      },
      disappearCard(card) {
        let cardElement = this.$refs.cards.$el.children[card.index];
        let cardBoundingRect = cardElement.getBoundingClientRect();
        let componentElement = this.$el.getBoundingClientRect();
        let animation = {
          card,
          top: cardBoundingRect.top - componentElement.top,
          right: componentElement.right - cardBoundingRect.right,
          height: cardBoundingRect.height,
          width: cardBoundingRect.width
        };
        this.cardDisappearAnimations.push(animation);
      },
      onButtonNewGameClick(event) {
        event.target.blur();
        this.startNewGame();
      }
    }
  };
</script>
