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
  describe('toIdsRange', () => {
    it('returns an ids range', () => {
      const fibonacciRange = new FibonacciNumberIdsRange(
        new FibonacciNumber(1),
        new FibonacciNumber(10),
      );
      const range = fibonacciRange.toIdsRange();
      expect(range).toBeDefined();
      expect(range.startId).toEqual(1);
      expect(range.endId).toEqual(10);
      expect(range.numberOfIds).toEqual(10);
    });
  });
});
