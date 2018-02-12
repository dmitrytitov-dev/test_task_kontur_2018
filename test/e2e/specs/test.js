function assertIntroPageIsOpen(client) {
  client
    .assert.elementCount('img', 1)
  // заголовок
    .assert.elementCount('h1', 1)
    .assert.containsText('h1', 'MEMORY GAME')
  // кнопка начала игры
    .assert.elementCount('button', 1)
    .assert.containsText('button', 'Начать игру')
    .assert.attributeEquals('button', 'data-tid', 'NewGame-startGame');
}

function assertGamePageIsOpen(client) {
  client
    .assert.elementCount('img', 18 * 2 /* лицевая сторона + рубашка */)
    .assert.elementCount('[data-tid="Card-flipped"]', 18 /* изначально все карты перевёрнуты */)
  // кнопка перезапуска игры
    .assert.elementCount('button', 1)
    .assert.containsText('button', 'Начать заново')
    .assert.attributeEquals('button', 'data-tid', 'Menu-newGame')
  // очки
    .assert.elementCount('span', 2)
    .assert.containsText('span:nth-of-type(1)', 'Очки:')
    .assert.containsText('span:nth-of-type(2)', '0')
    .assert.attributeEquals('span:nth-of-type(2)', 'data-tid', 'Menu-scores');
}

function assertResultPageIsOpen(client) {
  client.assert.elementCount('img', 1);
  // заголовок
  client.assert.elementCount('h1', 1);
  client.expect.element('h1').text.to.match(/Поздравляем!\nВаш итоговый счёт: -?\d+/);
  // кнопка начала новой игры
  client.assert.elementCount('button', 1);
  client.assert.containsText('button', 'Ещё раз');
  client.assert.attributeEquals('button', 'data-tid', 'EndGame-retryGame');
}

module.exports = {
  'intro page test': client => {
    client.url(client.globals.devServerURL);
    client.waitForElementVisible('#app', 5000);
    client.assert.attributeEquals('#app', 'data-tid', 'App');
    assertIntroPageIsOpen(client);
  },

  'game page test': client => {
    client.click('button');
    client.waitForElementVisible('[data-tid="Deck"]', 1000);
    assertGamePageIsOpen(client);
    // карты должны перевернуться через 5 секунд
    client.pause(5000);
    client.assert.elementCount('[data-tid="Card"]', 18); // уже перевернулись
    // клик по любой карте должен её перевернуть
    client.clickRandomElement('[data-tid="Card"]');
    client.assert.elementCount('[data-tid="Card-flipped"]', 1);
    client.assert.elementCount('[data-tid="Card"]', 17);

    // клик по открытой карте не должен менять что-нибудь
    client.click('[data-tid="Card-flipped"]');
    client.assert.elementCount('[data-tid="Card-flipped"]', 1);
    client.assert.elementCount('[data-tid="Card"]', 17);

    // далее будем кликать на случайные карты, пока имеются карты
    // это сделано в целях упрощения кода тестов
    client.clickRandomElementsWhileExists('[data-tid="Card"]');
  },

  'result page test': client => {
    client.waitForElementVisible('[data-tid="EndGame-retryGame"]', 20000);
    assertResultPageIsOpen(client);
    // новая игра
    client.click('[data-tid="EndGame-retryGame"]');
  },

  'game page after first game test': client => {
    assertGamePageIsOpen(client);
    client.pause(6000);

    // аналогично перевернём одну карту
    client.clickRandomElement('[data-tid="Card"]');
    client.assert.elementCount('[data-tid="Card-flipped"]', 1);
    client.assert.elementCount('[data-tid="Card"]', 17);

    // перевернём несколько карт, чтобы счёт изменился
    client.clickRandomElementsUntilThereRemainCertainAmount('[data-tid="Card"]', 12);
  },

  'game page, restart game test': client => {
    // начнём новую игру
    client.click('[data-tid="Menu-newGame"]');
    assertGamePageIsOpen(client);
  },

  'refresh page test': client => {
    // при перезагрузки страницы должен показываться стартовый экран
    client.refresh();
    assertIntroPageIsOpen(client);

    client.end();
  }
};
