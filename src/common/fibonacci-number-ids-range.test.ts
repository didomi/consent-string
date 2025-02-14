import { FibonacciNumber } from './fibonacci-number';
import { FibonacciNumberIdsRange } from './fibonacci-number-ids-range';
import { RangeConverters } from './range-converters';

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
  describe('conversion to IdsRange', () => {
    it('converts to IdsRange correctly', () => {
      const fibonacciRange = new FibonacciNumberIdsRange(
        new FibonacciNumber(10),
        new FibonacciNumber(14),
      );
      const range = RangeConverters.toIdsRange(fibonacciRange);
      expect(range.startId).toEqual(10);
      expect(range.endId).toEqual(23);
      expect(range.numberOfIds).toEqual(14);
    });
  });
});
