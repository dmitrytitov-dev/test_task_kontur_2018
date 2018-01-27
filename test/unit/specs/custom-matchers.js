function trimAndCollapseSpaces(text) {
  return text.replace('\n', ' ').replace(/\s+/g, ' ').trim();
}

expect.extend({
  toEqualIgnoreSpaceCollapsing(received, argument) {
    const pass = trimAndCollapseSpaces(received) === argument;
    if (pass) {
      return {
        message: () => `expected ${received} not to equal ${argument}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be equal ${argument}`,
        pass: false
      };
    }
  }
});
