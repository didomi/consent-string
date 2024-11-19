import { Status } from './ids-statuses';
import { FibonacciNumber } from './fibonacci-number';
import { FibonacciNumberIdsRange } from './fibonacci-number-ids-range';
import { FibonacciNumberIdsRanges } from './fibonacci-number-ids-ranges';

describe('FibonacciNumberIdsRanges', () => {
  describe('constructor', () => {
    it('creates an object', () => {
      const ranges = new FibonacciNumberIdsRanges(Status.Enabled);
      expect(ranges).toBeDefined();
      expect(ranges.numberOfRanges).toEqual(0);
    });
  });
  describe('add', () => {
    it('adding range', () => {
      const ranges = new FibonacciNumberIdsRanges(Status.Enabled);
      expect(ranges).toBeDefined();
      expect(ranges.numberOfRanges).toEqual(0);
      ranges.add(new FibonacciNumberIdsRange(new FibonacciNumber(1), new FibonacciNumber(3)));
      expect(ranges.numberOfRanges).toEqual(1);
    });
  });
  describe('get', () => {
    it('returns range', () => {
      const ranges = new FibonacciNumberIdsRanges(Status.Enabled);
      expect(ranges).toBeDefined();
      expect(ranges.numberOfRanges).toEqual(0);
      ranges.add(new FibonacciNumberIdsRange(new FibonacciNumber(1), new FibonacciNumber(3)));
      expect(ranges.numberOfRanges).toEqual(1);
      ranges.add(new FibonacciNumberIdsRange(new FibonacciNumber(4), new FibonacciNumber(10)));
      expect(ranges.numberOfRanges).toEqual(2);
      let range = ranges.get(5);
      expect(range).toBeUndefined;
      range = ranges.get(0);
      expect(range.startId.number).toEqual(1);
      expect(range.numberOfIds.number).toEqual(3);
      expect(range.endId.number).toEqual(3);
      range = ranges.get(1);
      expect(range.startId.number).toEqual(4);
      expect(range.numberOfIds.number).toEqual(10);
      expect(range.endId.number).toEqual(13);
    });
  });
  describe('createRange', () => {
    it('creates a range', () => {
      const ranges = new FibonacciNumberIdsRanges(Status.Enabled);
      const range = ranges.createRange(1, 10);
      expect(range.endId.number).toEqual(10);
      expect(range.startId.number).toEqual(1);
      expect(range.numberOfIds.number).toEqual(10);
    });
  });
  describe('fromIds', () => {
    it('creates empty ranges from empty id array', () => {
      const ranges = new FibonacciNumberIdsRanges(Status.Enabled);
      ranges.fromIds([]);
      expect(ranges.numberOfRanges).toEqual(0);
    });
    it('creates ranges for one range', () => {
      const ranges = new FibonacciNumberIdsRanges(Status.Enabled);
      ranges.fromIds([1, 2, 3, 4, 5]);
      expect(ranges.numberOfRanges).toEqual(1);
      const range = ranges.get(0);
      expect(range.startId.number).toEqual(1);
      expect(range.endId.number).toEqual(5);
      expect(range.numberOfIds.number).toEqual(5);
    });
    it('creates ranges for single id range', () => {
      const ranges = new FibonacciNumberIdsRanges(Status.Enabled);
      ranges.fromIds([1]);
      expect(ranges.numberOfRanges).toEqual(1);
      const range = ranges.get(0);
      expect(range.startId.number).toEqual(1);
      expect(range.endId.number).toEqual(1);
      expect(range.numberOfIds.number).toEqual(1);
    });
    it('creates ranges', () => {
      const ranges = new FibonacciNumberIdsRanges(Status.Enabled);
      ranges.fromIds([10, 20, 21, 23, 30, 31]);
      expect(ranges.numberOfRanges).toEqual(4);
      let range = ranges.get(0);
      expect(range.startId.number).toEqual(10);
      expect(range.endId.number).toEqual(10);
      expect(range.numberOfIds.number).toEqual(1);
      range = ranges.get(1);
      expect(range.startId.number).toEqual(20);
      expect(range.endId.number).toEqual(21);
      expect(range.numberOfIds.number).toEqual(2);
      range = ranges.get(2);
      expect(range.startId.number).toEqual(23);
      expect(range.endId.number).toEqual(23);
      expect(range.numberOfIds.number).toEqual(1);
      range = ranges.get(3);
      expect(range.startId.number).toEqual(30);
      expect(range.endId.number).toEqual(31);
      expect(range.numberOfIds.number).toEqual(2);
    });
  });
});
