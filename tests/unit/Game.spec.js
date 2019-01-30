import Game from '@/components/GamePage/Game';
import shuffle from 'lodash.shuffle';
import range from 'lodash.range';

describe('Game.js', () => {
  describe('should have correct initial state', () => {
    const game = new Game();
    describe('should have correct cards array', () => {
      const cards = game.cards;
      it('should be 18-length array of two-length strings', function () {
        expect(cards).toBeTruthy();
        expect(Array.isArray(game.cards)).toBe(true);
        expect(cards.length).toBe(18);
        for (let card of cards) {
          expect(typeof card).toBe('string');
          expect(card.length).toBe(2);
          expect(card).toMatch(/[0123456789AJKQ][CDHS]/);
        }
      });

      it('each card should have exactly one pair', () => {
        let counts = {};
        for (let card of cards) {
          counts[card] = (card in counts ? counts[card] : 0) + 1;
        }
        for (let count of Object.values(counts)) {
          expect(count).toBe(2);
        }
      });
    });

    it('should have height and width fields', () => {
      expect(game.height).toBe(3);
      expect(game.width).toBe(6);
    });

    it('should have score fields', () => {
      expect(game.score).toBe(0);
    });

    it('should have `flipPair` and `isGameEnd` methods', () => {
      expect(typeof game.flipPair).toBe('function');
      expect(typeof game.isGameEnd).toBe('function');
      expect(game.isGameEnd()).toBe(false);
    });
  });

  it('should correctly handle flipping non-paired cards', () => {
    const game = new Game();
    let cardIndex1 = 0;
    let cardIndex2 = game.cards[0] !== game.cards[1] ? 1 : 2;
    game.flipPair(cardIndex1, cardIndex2);
    expect(game.score).toBe(0);
  });

  it('should correctly handle flipping paired cards', () => {
    const game = new Game();
    let cardIndex1 = 0;
    let cardIndex2 = game.cards.findIndex(card => card === game.cards[cardIndex1]);
    game.flipPair(cardIndex1, cardIndex2);
    expect(game.score).toBe(42 * (18 / 2 - 1));
  });

  it('should correctly handle score and game end in random game', () => {
    function getTwoRandomElementsFromArray(array) {
      let [element1, element2, ...rest] = shuffle(array);
      return [element1, element2];
    }

    const game = new Game();
    let cards = range(18);
    for (let i = 0; i < 18 / 2; ++i) {
      let associated;
      do {
        expect(game.isGameEnd()).toBe(false);
        let [cardIndex1, cardIndex2] = getTwoRandomElementsFromArray(cards);
        let score = game.score;
        associated = game.flipPair(cardIndex1, cardIndex2);
        expect(associated).toBe(game.cards[cardIndex1] === game.cards[cardIndex2]);

        let scoreDelta = game.score - score;
        let numberPairsAssociated = i;
        let numberPairsUnassociated = 9 - numberPairsAssociated - 1;
        let expectedScoreDelta = 42 * (associated ? +numberPairsUnassociated : -numberPairsAssociated);
        expect(scoreDelta === expectedScoreDelta).toBe(true);

        if (associated) {
          cards = cards.filter(card => card !== cardIndex1 && card !== cardIndex2);
        }
      }
      while (!associated);
    }
    expect(game.isGameEnd()).toBe(true);
  });
});
