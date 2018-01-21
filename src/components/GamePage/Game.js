import range from 'lodash.range';
import shuffle from 'lodash.shuffle';
import {GAME_SCORE_FACTOR} from '@/components/constants';

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

function generateRandomCombination(set, combinationSize) {
  // создаём копию, так как будем изменять множество элементов
  let array = [...set];

  let combination = [];
  while (combination.length < combinationSize) {
    // выбираем случайный элемент массива и добавляем его к сочетанию
    let randomIndex = Math.floor(Math.random() * array.length);
    let randomElement = array[randomIndex];
    combination.push(randomElement);

    // удаляем выбранный элемент из массива
    array[randomIndex] = array[array.length - 1];
    array.pop();
  }
  return combination;
}

export default class Game {
  constructor(height = 3, width = 6) {
    if (height * width % 2 !== 0) {
      throw new Error('Число карт на поле должно быть чётно');
    }

    let numberUniqueCards = height * width / 2;
    if (numberUniqueCards > allCards.length) {
      throw new Error('Размер поля слишком большой. Не получится сделать так, чтобы у каждой карты была ровно одна пара');
    }

    let gameCardsUnique = generateRandomCombination(allCards, numberUniqueCards);
    this.cards = shuffle([...gameCardsUnique, ...gameCardsUnique]);
    // this.cards = [allCards[0], ...new Array(gameCardsNames.length - 1).fill(allCards[1])];
    this.height = height;
    this.width = width;
    this.numberPairsAssociated = 0;
    this.score = 0;
  }

  flipPair(card1, card2) {
    if (this.cards[card1] === this.cards[card2]) {
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
