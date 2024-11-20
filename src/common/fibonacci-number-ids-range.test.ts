import { FibonacciNumber } from './fibonacci-number';
import { FibonacciNumberIdsRange } from './fibonacci-number-ids-range';

describe('FibonacciNumberIdsRange', () => {
  describe('constructor', () => {
    it('creates an object', () => {
      const fibonacciRange = new FibonacciNumberIdsRange(
        new FibonacciNumber(1),
        new FibonacciNumber(100),
      );
      expect(fibonacciRange.startId.number).toEqual(1);
      expect(fibonacciRange.numberOfIds.number).toEqual(100);
      expect(fibonacciRange.endId.number).toEqual(100);
    });
  });
  describe('endId', () => {
    it('returns right value for numberOfIds equal to 1', () => {
      const fibonacciRange = new FibonacciNumberIdsRange(
        new FibonacciNumber(1),
        new FibonacciNumber(1),
      );
      expect(fibonacciRange.startId.number).toEqual(1);
      expect(fibonacciRange.numberOfIds.number).toEqual(1);
      expect(fibonacciRange.endId.number).toEqual(1);
    });
  });
});
