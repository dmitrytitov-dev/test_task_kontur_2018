import range from 'lodash.range';
import shuffle from 'lodash.shuffle';
import {GAME_HEIGHT, GAME_SCORE_FACTOR, GAME_WIDTH} from '@/components/constants';

function getAllCards() {
  let suits = ['C', 'D', 'H', 'S'];
  let lettersFromTwoToNine = range(2, 10).map(x => x.toString());
  let ranks = ['0', ...lettersFromTwoToNine, 'A', 'J', 'K', 'Q'];

  let cards = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      cards.push(rank + suit);
    }
  }
  return cards;
}

const allCards = getAllCards();

export default class Game {
  constructor(height = GAME_HEIGHT, width = GAME_WIDTH) {
    if (height * width % 2 !== 0) {
      throw new Error('Число карт на поле должно быть чётно');
    }

    let numberUniqueCards = height * width / 2;
    if (numberUniqueCards > allCards.length) {
      throw new Error('Размер поля слишком большой. Не получится сделать так, чтобы у каждой карты была ровно одна пара');
    }

    // случайное сочетания множества allCards размера numberUniqueCards
      let gameCardsUnique = shuffle(allCards).slice(0, numberUniqueCards);
    this.cards = shuffle([...gameCardsUnique, ...gameCardsUnique]);
    this.height = height;
    this.width = width;
    this.numberPairsAssociated = 0;
    this.score = 0;
  }

  flipPair(cardIndex1, cardIndex2) {
    if (this.cards[cardIndex1] === this.cards[cardIndex2]) {
      ++this.numberPairsAssociated;
      let numberPairsUnassociated = this.cards.length / 2 - this.numberPairsAssociated;
      this.score += GAME_SCORE_FACTOR * numberPairsUnassociated;
      return true;
    } else {
      this.score -= GAME_SCORE_FACTOR * this.numberPairsAssociated;
      return false;
    }
  }

  isGameEnd() {
    return this.numberPairsAssociated === this.cards.length / 2;
  }
}
