exports.command = function (selector, callback) {
  this.perform(
    (client, done) => {
      client.elements('css selector', selector, function (result) {
        let elements = result.value;
        let randomIndex = Math.floor(Math.random() * elements.length);
        let randomElement = elements[randomIndex].ELEMENT;
        client.elementIdClick(randomElement);

        if (typeof callback === 'function') {
          callback.call(self, result);
        }
        done();
      });
    }
  );
  return this;
};
