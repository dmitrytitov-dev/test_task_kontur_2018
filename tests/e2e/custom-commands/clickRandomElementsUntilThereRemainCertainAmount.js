exports.command = function (selector, amount, callback) {
  function singleStepWithPause(client, done) {
    return singleStep(client, done, true);
  }

  function singleStepWithoutPause(client, done) {
    return singleStep(client, done, false);
  }

  function singleStep(client, done, performPauseBetweenFinish) {
    client.elements('css selector', selector, function (result) {
      let elements = result.value;
      if (elements.length > amount) {
        let randomIndex = Math.floor(Math.random() * elements.length);
        let randomElement = elements[randomIndex].ELEMENT;
        client.elementIdClick(randomElement);
        this.perform(singleStepWithPause);
      } else if (performPauseBetweenFinish) {
        this.pause(1000);
        this.perform(singleStepWithoutPause);
      } else {
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      }
      done();
    });
  }

  this.perform(singleStepWithPause);
  return this;
};
