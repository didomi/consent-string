import { IdsRange } from './ids-range';
import { RangeConverters } from './range-converters';

describe('IdsRange', () => {
  describe('constructor', () => {
    it('creates an object', () => {
      const range = new IdsRange(1, 100);
      expect(range.startId).toEqual(1);
      expect(range.endId).toEqual(100);
      expect(range.numberOfIds).toEqual(100);
      expect(range.isSingleIdRange).toBeFalsy();
    });
  });
  describe('numberOfIds', () => {
    it('return 1 for one when startId is equal to endId', () => {
      const range = new IdsRange(1, 1);
      expect(range.startId).toEqual(1);
      expect(range.endId).toEqual(1);
      expect(range.numberOfIds).toEqual(1);
      expect(range.isSingleIdRange).toBeTruthy();
    });
  });
  describe('conversion to FibonacciNumberIdsRange', () => {
    it('creates Fibonacci number range for single element range', () => {
      const range = new IdsRange(1, 1);
      const fibonacciRange = RangeConverters.toFibonacciNumberIdsRange(range);
      expect(fibonacciRange.startId.number).toEqual(1);
      expect(fibonacciRange.numberOfIds.number).toEqual(1);
      expect(fibonacciRange.endId.number).toEqual(1);
    });
    it('creates Fibonacci number range for a range', () => {
      const range = new IdsRange(10, 23);
      const fibonacciRange = RangeConverters.toFibonacciNumberIdsRange(range);
      expect(fibonacciRange.startId.number).toEqual(10);
      expect(fibonacciRange.numberOfIds.number).toEqual(14);
      expect(fibonacciRange.endId.number).toEqual(23);
    });
  });
});
