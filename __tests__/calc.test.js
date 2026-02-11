const { calculateDeparture, computeLeaveBy } = require('../lib/calc');

test('calculates departure before midnight', () => {
  expect(calculateDeparture('00:30', 20, 15)).toBe('23:55');
});

test('simple example', () => {
  expect(calculateDeparture('09:00', 40, 10)).toBe('08:10');
});

test('invalid time throws', () => {
  expect(() => calculateDeparture('bad-time', 20, 5)).toThrow();
});

test('leave-by warning when arrival is too soon', () => {
  const now = 1_000_000;
  const arrival = now + 60; // 1 min from now
  const result = computeLeaveBy(arrival, 7, 3, now);
  expect(result.isLate).toBe(true);
  expect(result.minutesUntilLeave).toBe(-9);
});

test('leave-by normal case returns correct time delta', () => {
  const now = 1_000_000;
  const arrival = now + 20 * 60; // 20 min from now
  const result = computeLeaveBy(arrival, 7, 3, now);
  expect(result.isLate).toBe(false);
  expect(result.minutesUntilLeave).toBe(10);
});