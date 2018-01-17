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
    <div class="cards" ref="cards">
      <div class="card cards__card" v-if="cards" v-for="card of cards">
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
    /* в макете расстояние между картами равно 3% от высоты экрана */
    /* поэтому у меня расстояние между картами будет равно 3vmin */
    --grid-gap: 3vmin;

    /* в макете поле с картами занимает 55% высоты и 76% ширины экрана */
    /* если зафиксировать расстояние между картами, то сделать размер поля точно как в макете не получится */
    /* поэтому у меня поле будет занимать не более 60% высоты и не более 80% ширины (одна из границ точная) */
    --grid-max-width: 60vw;
    --grid-max-height: 80vh;

    /* выберем высоту и ширину карты */
    /* хотим чтобы из следующих неравенств выполнялось хотя бы одно */
    /* ширина_карты * 6 + grid-gap * 5 <= grid-max-width  */
    /* высота_карты * 3 + grid-gap * 2 <= grid-max-height */
    /* и ещё чтобы карта сохраняла пропорции (карты имеют размер 226px на 314px): */
    /* ширина_карты = 226 * card-scale */
    /* высота_карты = 314 * card-scale */
    /* таким образом, можем найти значение card-scale: */
    /* card-scale <= (grid-max-width  - grid-gap * 5) / 6 / 226 */
    /* card-scale <= (grid-max-height - grid-gap * 2) / 3 / 314 */
    /* к сожалению, функция calc не поддерживает взятие минимума, поэтому эту переменную придётся считать в javascript */
    /* --card-scale: <javascript> */

    /* карты имеют размер 226px на 314px */
    --card-width: calc(226px * var(--card-scale));
    --card-height: calc(314px * var(--card-scale));

    width: calc(var(--card-width) * 6 + var(--grid-gap) * 5);
    height: calc(var(--card-height) * 3 + var(--grid-gap) * 2);
    margin-top: 4vh;

    display: grid;
    grid-template: repeat(3, 1fr) / repeat(6, 1fr);
    grid-gap: var(--grid-gap);
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
  /*.card .card__inner {*/
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
        score: 0,
        console,
        getComputedStyle
      };
    },
    mounted() {
      console.clear();
      this.startNewGame();
      window.addEventListener('resize', this.onResize);
      this.onResize();
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.onResize);
    },
    methods: {
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
          this.$refs.cards.style.setProperty('--card-scale', cardScale);
        }
      },
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
