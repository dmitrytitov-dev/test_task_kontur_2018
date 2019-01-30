function trimAndCollapseSpaces(text) {
  return text.replace('\n', ' ').replace(/\s+/g, ' ').trim();
}

function toEqualIgnoreSpaceCollapsing(received, argument) {
  const pass = trimAndCollapseSpaces(received) === argument;
  const message = pass
    ? () => `expected ${received} not to equal ${argument}`
    : () => `expected ${received} to be equal ${argument}`;
  return {message, pass};
}

expect.extend({
  toEqualIgnoreSpaceCollapsing
});
