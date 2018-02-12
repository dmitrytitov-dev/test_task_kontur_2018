<template>
  <div
    class="cards"
    ref="cards"
    data-tid="Deck"
  >
    <div
      v-for="card of cards"
      :key="card.index"
      :class="['cards__card card', {'card_flipped': card.flipped, 'card_associated': card.associated}]"
      @click="onCardClick(card)"
      @keydown.enter="onCardClick(card)"
      @keydown.esc="blurActiveCard"
      @keydown.up="moveCardFocus(card, -1, 0)"
      @keydown.down="moveCardFocus(card, +1, 0)"
      @keydown.left="moveCardFocus(card, 0, -1)"
      @keydown.right="moveCardFocus(card, 0, +1)"
      :data-tid="card.flipped ? 'Card-flipped' : (card.associated ? null : 'Card')"
    >
      <div class="card__inner" tabindex="0">
        <img
          class="card__frontside"
          :src="`/static/cards/${card.name}.png`"
          :alt="card.flipped ? `карта ${card.name}, лицевая сторона` : ''"
        >
        <img
          class="card__backside"
          :src="`/static/backside.png`"
          :alt="card.flipped ? '' : 'рубашка карты'"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
  .cards {
    /* создадим css-переменные для числа строк и столбцов поля */
    /* если мы захотим поле другого размера, то достаточно будет изменить их в JavaScript */
    --number-rows: 3;
    --number-columns: 6;

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
    grid-template-rows: repeat(var(--number-rows), var(--card-height));
    grid-template-columns: repeat(var(--number-columns), var(--card-width));
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

  .card.card_flipped, .card.card_associated {
    cursor: default;
  }

  .card.card_associated > .card__inner {
    display: none;
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

    /* иначе <img> является строчным элементом, с vertical-align: baseline по умолчанию (https://stackoverflow.com/a/34952703/5812238) */
    display: block;
  }

  .card__frontside {
    transform: rotateY(180deg);
  }

  /* индикация выбранной карты для управления с клавиатуры (tab + стрелки + enter) */
  .card__inner:focus {
    outline: solid 2px deepskyblue;
  }
</style>

<script>
  import {GAME_HEIGHT, GAME_WIDTH} from '@/components/constants';

  export default {
    name: 'game-page-cards',
    props: ['cards', 'onCardClick'],
    mounted() {
      document.addEventListener('keydown', this.onKeydown);
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.onKeydown);
    },
    methods: {
      onKeydown(event) {
        let activeElementExists = document.activeElement && document.activeElement !== document.body;
        if (!activeElementExists && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.code)) {
          this.focusCard(0);
        }
      },
      moveCardFocus(card, deltaI, deltaJ) {
        let i = Math.floor(card.index / GAME_WIDTH);
        let j = card.index % GAME_WIDTH;
        let newI = i + deltaI;
        let newJ = j + deltaJ;
        if (0 <= newI && newI < GAME_HEIGHT && 0 <= newJ && newJ < GAME_WIDTH) {
          let newCardIndex = newI * GAME_WIDTH + newJ;
          this.focusCard(newCardIndex);
        }
      },
      focusCard(index) {
        this.$refs.cards.children[index].firstElementChild.focus();
      },
      blurActiveCard() {
        document.activeElement.blur();
      }
    }
  };
</script>
