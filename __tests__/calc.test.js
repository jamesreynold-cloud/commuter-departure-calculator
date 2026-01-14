const { calculateDeparture } = require('../lib/calc');

test('calculates departure before midnight', () => {
  expect(calculateDeparture('00:30', 20, 15)).toBe('23:55');
});

test('simple example', () => {
  expect(calculateDeparture('09:00', 40, 10)).toBe('08:10');
});

test('invalid time throws', () => {
  expect(() => calculateDeparture('bad-time', 20, 5)).toThrow();
});