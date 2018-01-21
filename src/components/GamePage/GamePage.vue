<template>
  <div class="game-page" v-if="game">
    <game-page-menu class="game-page__menu"
                    ref="menu"
                    v-bind="{score: scoreDelayed, onButtonNewGameClick}"
    ></game-page-menu>
    <game-page-cards class="game-page__cards"
                     ref="cards"
                     v-bind="{cards: game.cards, isCardFlipped, isCardAssociated, onCardClick}"
    ></game-page-cards>
    <game-page-card-disappear-animation v-for="animation of cardDisappearAnimations"
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
  import {GAME_DELAY_BETWEEN_CARD_OPEN_AND_DISAPPEAR_START, GAME_DELAY_BETWEEN_CARD_OPEN_AND_FLIP_START, GAME_DELAY_BETWEEN_GAME_START_AND_FLIP_ALL_CARDS} from '@/components/constants';

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
        game: null,
        keepFlipped: null,
        scoreDelayed: 0,
        flipAllCardsDelayedId: null,
        cardDisappearAnimations: [],
        keepNotAssociated: []
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
      isCardFlipped(card) {
        return card.flipped || this.keepFlipped[card.index];
      },
      isCardAssociated(card) {
        return card.associated && !this.keepNotAssociated[card.index];
      },
      flipAllCardsDelayed() {
        if (this.flipAllCardsDelayedId) {
          clearTimeout(this.flipAllCardsDelayedId);
        }
        const flipAllCardsDelayedHandler = () => {
          for (let card of this.game.cards) {
            card.flipped = false;
          }
          this.flipAllCardsDelayedId = null;
        };
        this.flipAllCardsDelayedId = setTimeout(flipAllCardsDelayedHandler, GAME_DELAY_BETWEEN_GAME_START_AND_FLIP_ALL_CARDS);
      },
      startNewGame() {
        this.game = new Game();
        this.keepFlipped = new Array(this.game.numberCards).fill(false);
        this.keepNotAssociated = new Array(this.game.numberCards).fill(false);
        this.scoreDelayed = 0;
        this.cardDisappearAnimations = [];
        this.flipAllCardsDelayed();
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
        if (this.isCardFlipped(card)) {
          return;
        }

        let score = this.game.score;
        let [associated, pairCard] = this.game.flip(card.index);
        let scoreDelta = this.game.score - score;
        if (!pairCard) {
          return;
        }

        if (associated) {
          await this.disappearCardPair(card, pairCard);
        } else {
          await this.flipCardPair(card.index, pairCard.index);
        }
        this.scoreDelayed += scoreDelta;
      },
      async flipCardPair(cardIndex1, cardIndex2) {
        this.$set(this.keepFlipped, cardIndex1, true);
        this.$set(this.keepFlipped, cardIndex2, true);
        await sleep(GAME_DELAY_BETWEEN_CARD_OPEN_AND_FLIP_START);
        this.$set(this.keepFlipped, cardIndex1, false);
        this.$set(this.keepFlipped, cardIndex2, false);
      },
      async disappearCardPair(card1, card2) {
        const setKeep = (value) => {
          for (let card of [card1, card2]) {
            for (let keepArray of [this.keepNotAssociated, this.keepFlipped]) {
              this.$set(keepArray, card.index, value);
            }
          }
        };

        setKeep(true);
        await sleep(GAME_DELAY_BETWEEN_CARD_OPEN_AND_DISAPPEAR_START);
        setKeep(false);
        this.disappearCard(card1);
        this.disappearCard(card2);
        // столько длится анимация в компоненте GamePageCardDisappearAnimation,
        // можно было передавать это значение как параметр в тот компонент, но я не стал
        await sleep(1100);
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
