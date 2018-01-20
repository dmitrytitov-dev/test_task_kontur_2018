import range from 'lodash.range';
import shuffle from 'lodash.shuffle';

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
    let gameCardsNames = shuffle([...gameCardsUnique, ...gameCardsUnique]);
    // gameCardsNames = new Array(gameCardsNames.length).fill(allCards[0]);
    this.cards = gameCardsNames.map((name, index) => ({name, index, flipped: true, associated: false}));
    this.height = height;
    this.width = width;
    this.score = 0;
    this.firstFlippedCard = null;
  }

  get numberCards() {
    return this.height * this.width;
  }

  flip(cardIndex) {
    let card = this.cards[cardIndex];
    if (card.flipped || card.associated) {
      // клик по уже открытой карте или клик по уже убранной карте
      return [false, null];
    }

    if (this.firstFlippedCard === null) {
      // кроме текущей карты нет открытых карт
      card.flipped = true;
      this.firstFlippedCard = card;
      return [false, null];
    }

    let firstFlippedCard = this.firstFlippedCard;
    firstFlippedCard.flipped = false;

    let numberPairsAssociated = this.cards.filter(card => card.associated).length / 2;
    let numberPairsUnassociated = this.cards.length / 2 - numberPairsAssociated;
    let associated = card.name === firstFlippedCard.name;
    if (associated) {
      this.score += 42 * numberPairsUnassociated;
      card.associated = firstFlippedCard.associated = true;
    } else {
      this.score -= 42 * numberPairsAssociated;
    }
    this.firstFlippedCard = null;
    return [associated, firstFlippedCard];
  }
}
