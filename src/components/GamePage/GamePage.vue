<template>
  <div class="game-page">
    <game-page-menu class="game-page__menu"
                    :score="score"
                    :onButtonNewGameClick="onButtonNewGameClick"
                    ref="menu"
    ></game-page-menu>
    <div class="game-page__cards cards"
         data-tid="Deck"
         ref="cards"
    >
      <template v-if="cards" v-for="card of cards">
        <div :class="['cards__card card', {'card_flipped': card.flipped, 'card_visible': card.visible}]"
             @click="onCardClick(card)"
             :data-tid="card.flipped ? 'Card-flipped' : (card.visible ? 'Card' : null)"
        >
          <div class="card__inner">
            <img class="card__frontside"
                 :src="`/static/cards/${card.name}.png`"
                 alt=""
            >
            <img class="card__backside"
                 :src="`/static/backside.png`"
                 alt=""
            >
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
  .game-page__cards {
    margin-top: 4vh;
  }

  /* =========== стили карт =========== */

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

    /* зная значение --card-scale можем рассчитать размер карты */
    --card-width: calc(226px * var(--card-scale));
    --card-height: calc(314px * var(--card-scale));

    /* поле это сетка, с расстояними между картами равным --grid-gap и известной шириной/высотой (одинаковой) каждого элемента */
    display: grid;
    grid-template: repeat(3, var(--card-height)) / repeat(6, var(--card-width));
    grid-gap: var(--grid-gap);
  }

  .cards__card {
    width: 100%;
    height: 100%;
  }

  .card {
    perspective: 1000px;
    cursor: pointer;
  }

  .card:not(.card_visible) {
    visibility: hidden;
  }

  /* https://davidwalsh.name/css-flip */
  .card.card_flipped .card__inner {
    transform: rotateY(180deg);
  }

  .card__inner {
    width: 100%;
    height: 100%;
    position: relative;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .card__frontside, .card__backside {
    width: 100%;
    height: 100%;
    backface-visibility: hidden;

    object-fit: contain;
    position: absolute;
    left: 0;
    top: 0;

    /* иначе <img> является строчым элементом, с vertical-align: baseline по умолчанию (https://stackoverflow.com/a/34952703/5812238) */
    display: block;
  }

  .card__frontside {
    transform: rotateY(180deg);
  }
</style>

<script>
  import range from 'lodash.range';
  import shuffle from 'lodash.shuffle';
  import GamePageMenu from '@/components/GamePage/GamePageMenu';

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
    components: {GamePageMenu},
    name: 'game-page',
    props: ['moveToResultPage'],
    data() {
      return {
        deskHeight: 3,
        deskWidth: 6,
        cards: null,
        firstFlippedCard: null,
        score: 0,
        removeCardsFlipTimeoutId: null
      };
    },
    mounted() {
      console.clear();
      this.startNewGame();
      this.onResize();
      window.addEventListener('resize', this.onResize);
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.onResize);
    },
    methods: {
      onButtonNewGameClick(event) {
        event.target.blur();
        this.startNewGame();
      },
      flipAllCards() {
        if (this.removeCardsFlipTimeoutId) {
          clearTimeout(this.removeCardsFlipTimeoutId);
        }
        const removeCardsFlip = () => {
          for (let card of this.cards) {
            card.flipped = false;
          }
          this.removeCardsFlipTimeoutId = null;
        };
        const removeCardsFlipDelay = 5000;
        // const removeCardsFlipDelay = 700;
        // const removeCardsFlipDelay = 2000;
        this.removeCardsFlipTimeoutId = setTimeout(removeCardsFlip, removeCardsFlipDelay);
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
        let cardsNames = shuffle([...cardsCurrentUnique, ...cardsCurrentUnique]);
        this.cards = cardsNames.map((name, index) => ({name, index, flipped: true, visible: true}));
        this.score = 0;

        this.flipAllCards();
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
          this.$refs.cards.style.setProperty('--card-scale', cardScale);
        }
      },
      onCardClick(card) {
        if (card.flipped || !card.visible) {
          // клик по уже открытой карте или клик по уже убраной карте
          return;
        }
        card.flipped = true;

        if (this.firstFlippedCard === null) {
          // кроме текущей карты нет открытых карт
          this.firstFlippedCard = card;
          return;
        }

        let firstFlippedCard = this.firstFlippedCard;
        let numberPairsOpened = this.cards.filter(card => !card.visible).length / 2;
        let numberPairsUnopened = this.cards.length / 2 - numberPairsOpened;
        let areCardsEqual = card.name === firstFlippedCard.name;
        let scoreDelta = 42 * (areCardsEqual ? numberPairsUnopened : -numberPairsOpened);
        this.firstFlippedCard = null;

        const disappearCardPair = () => {
          const animationDuration = 1000;
          let animateCard = (card) => {
            let cardElement = this.$refs.cards.children[card.index];
            let cardBoundingRect = cardElement.getBoundingClientRect();
            let scoresBoundingRect = this.$refs.menu.$el.getBoundingClientRect();

            let moveKeyframes = [
              {
                left: cardBoundingRect.left + 'px',
                top: cardBoundingRect.top + 'px',
                opacity: 1
              },
              {
                left: (scoresBoundingRect.right - cardBoundingRect.width) + 'px',
                top: scoresBoundingRect.top + 'px',
                opacity: 0
              }
            ];
            let animatedElement = document.createElement('img');
            document.body.appendChild(animatedElement);
            animatedElement.src = cardElement.getElementsByClassName('card__frontside')[0].src;
            animatedElement.style.position = 'absolute';
            animatedElement.style.left = cardBoundingRect.right + 'px';
            animatedElement.style.top = cardBoundingRect.top + 'px';
            animatedElement.style.width = cardBoundingRect.width + 'px';
            animatedElement.style.height = cardBoundingRect.height + 'px';
            let animation = animatedElement.animate(moveKeyframes, {
              duration: animationDuration,
              easing: 'ease-out',
              fill: 'forwards'
            });
            animation.addEventListener('finish', () => animatedElement.remove());
          };

          animateCard(card);
          animateCard(firstFlippedCard);
          setTimeout(() => {
            this.score += scoreDelta;
            if (this.cards.every(card => !card.visible)) {
              this.moveToResultPage(this.score);
            }
          }, animationDuration);
          card.visible = firstFlippedCard.visible = false;
        };

        if (areCardsEqual) {
          const disappearCardPairDelay = 700;
          setTimeout(disappearCardPair, disappearCardPairDelay);
        } else {
          const flipCardPairDelay = 1500;
          const flipCardPair = () => {
            card.flipped = firstFlippedCard.flipped = false;
            this.score += scoreDelta;
          };
          setTimeout(flipCardPair, flipCardPairDelay);
        }
      }
    }
  };
</script>
