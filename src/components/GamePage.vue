<template>
  <div class="container">
    <div class="menu">
      <button
        @click="onButtonNewGameClick"
        class="button"
        data-tid="Menu-newGame"
      >Начать заново
      </button>
      <div class="scores">
        <span class="scores-title">Очки:</span>
        <span class="scores-value" data-tid="Menu-scores">{{score}}</span>
      </div>
    </div>
    <div class="cards" v-if="cards">
      <div class="card cards__card" v-for="card of cards">
        <div class="card__inner">
          <img class="card__frontside"
               :src="`/static/cards/${card}.png`"
               alt=""
          >
          <img class="card__backside"
               :src="`/static/backside.png`"
               alt=""
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .cards {
    width: 55vw;
    height: 76vh;
    margin-top: 2vh;

    display: grid;
    grid-template: repeat(3, 1fr) / repeat(6, 1fr);
    grid-gap: 3vmin;
    align-items: center;
    justify-items: center;
  }

  .cards__card {
    min-width: 0;
    min-height: 0;
    width: 100%;
    height: 100%;
  }

  .card {
    perspective: 1000px;
  }

  .card:hover .card__inner {
    transform: rotateY(180deg);
  }

  .card__inner {
    position: relative;
    transition: 0.6s;
    transform-style: preserve-3d;
    width: 100%;
    height: 100%;
  }

  .card__frontside, .card__backside {
    min-width: 0;
    min-height: 0;
    width: 100%;
    height: 100%;

    object-fit: contain;
    position: absolute;
    left: 0;
    top: 0;

    /* иначе <img> является строчым элементом, с vertical-align: baseline по умолчанию (https://stackoverflow.com/a/34952703/5812238) */
    display: block;
  }

  .card__frontside {
    z-index: 1;
  }

  .card__backside {
    transform: rotateY(180deg);
  }

  /* увеличение нажимаемой области кнопки (для удобства) */
  /* https://stackoverflow.com/questions/19246893/increasing-clickable-area-of-a-button */
  .button:before {
    position: absolute;
    content: '';
    top: -1vh;
    right: -1vw;
    left: -1vw;
    bottom: -1vh;
  }

  .button {
    /* чтобы у .button:before работал position: absolute; */
    position: relative;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;

    opacity: 0.8;
    /* semi-bold */
    font-weight: 600;
    font-size: 14px;
    color: white;
    letter-spacing: -0.25px;
  }

  .scores {
    float: right;
    opacity: 0.8;
    font-size: 14px;
    color: white;
    letter-spacing: 0;
    /* чтобы не было пробела между <span> title и value элементами (https://css-tricks.com/fighting-the-space-between-inline-block-elements/) */
    display: flex;
  }

  .scores-title {
    font-weight: bold;
  }

  .scores-value {
    margin-left: 0.4vw;
    font-family: Krungthep, monospace;
  }
</style>

<script>
  import range from 'lodash.range';
  import shuffle from 'lodash.shuffle';

  function getAllCards(suits, ranks) {
    let cards = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        cards.push(rank + suit);
      }
    }
    return cards;
  }

  export default {
    name: 'game',
    data() {
      return {
        fieldHeight: 3,
        fieldWidth: 6,
        cards: null,
        score: 0

      };
    },
    mounted() {
      console.clear();
      this.startNewGame();
    },
    // beforeDestroy(){
    //
    // },
    methods: {
      onButtonNewGameClick(event) {
        event.target.blur();
        this.startNewGame();
      },
      startNewGame() {
        const suits = ['C', 'D', 'H', 'S'];
        const lettersFromTwoToNine = range(2, 10).map(x => x.toString());
        const ranks = ['0', ...lettersFromTwoToNine, 'A', 'J', 'K', 'Q'];
        const cardsAll = getAllCards(suits, ranks);

        let cardsCurrentUnique = [];
        while (cardsCurrentUnique.length < 9) {
          let randomIndex = Math.floor(Math.random() * cardsAll.length);
          let randomCard = cardsAll[randomIndex];
          if (cardsCurrentUnique.indexOf(randomCard) === -1) {
            cardsCurrentUnique.push(randomCard);
          }
        }
        this.cards = shuffle([...cardsCurrentUnique, ...cardsCurrentUnique]);
      }
    }
  };
</script>
