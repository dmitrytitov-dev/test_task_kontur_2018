exports.command = function (selector, callback) {
  this.clickRandomElementsUntilThereRemainCertainAmount(selector, 0);
  return this;
};
