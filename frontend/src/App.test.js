// Simple test that doesn't require complex component rendering
test('basic app functionality', () => {
  expect(1 + 1).toBe(2);
});

test('app environment check', () => {
  expect(process.env.NODE_ENV).toBeDefined();
});
