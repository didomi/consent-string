import { Status } from './ids-statuses';
import { IdsRange } from './ids-range';
import { IdsRanges } from './ids-ranges';

describe('IdsRanges', () => {
  describe('constructor', () => {
    it('creates an object', () => {
      const ranges = new IdsRanges(Status.Enabled);
      expect(ranges).toBeDefined();
      expect(ranges.numberOfRanges).toEqual(0);
    });
  });
  describe('add', () => {
    it('adding range', () => {
      const ranges = new IdsRanges(Status.Enabled);
      expect(ranges).toBeDefined();
      expect(ranges.numberOfRanges).toEqual(0);
      ranges.add(new IdsRange(1, 3));
      expect(ranges.numberOfRanges).toEqual(1);
    });
  });
  describe('get', () => {
    it('returns range', () => {
      const ranges = new IdsRanges(Status.Enabled);
      expect(ranges).toBeDefined();
      expect(ranges.numberOfRanges).toEqual(0);
      ranges.add(new IdsRange(1, 3));
      expect(ranges.numberOfRanges).toEqual(1);
      ranges.add(new IdsRange(4, 10));
      expect(ranges.numberOfRanges).toEqual(2);
      let range = ranges.get(5);
      expect(range).toBeUndefined;
      range = ranges.get(0);
      expect(range.startId).toEqual(1);
      expect(range.endId).toEqual(3);
      expect(range.isSingleIdRange).toBeFalsy();
      range = ranges.get(1);
      expect(range.startId).toEqual(4);
      expect(range.endId).toEqual(10);
      expect(range.isSingleIdRange).toBeFalsy();
    });
  });
  describe('createRange', () => {
    it('creates a range', () => {
      const ranges = new IdsRanges(Status.Enabled);
      const range = ranges.createRange(10, 12);
      expect(range.endId).toEqual(12);
      expect(range.startId).toEqual(10);
      expect(range.numberOfIds).toEqual(3);
      expect(range.isSingleIdRange).toBeFalsy();
    });
  });
  describe('fromIds', () => {
    it('creates empty ranges from empty id array', () => {
      const ranges = new IdsRanges(Status.Enabled);
      ranges.fromIds([]);
      expect(ranges.numberOfRanges).toEqual(0);
    });
    it('creates ranges for one range', () => {
      const ranges = new IdsRanges(Status.Enabled);
      ranges.fromIds([1, 2, 3, 4, 5]);
      expect(ranges.numberOfRanges).toEqual(1);
      const range = ranges.get(0);
      expect(range.startId).toEqual(1);
      expect(range.endId).toEqual(5);
      expect(range.isSingleIdRange).toBeFalsy();
      expect(range.numberOfIds).toEqual(5);
    });
    it('creates ranges for single id range', () => {
      const ranges = new IdsRanges(Status.Enabled);
      ranges.fromIds([1]);
      expect(ranges.numberOfRanges).toEqual(1);
      const range = ranges.get(0);
      expect(range.startId).toEqual(1);
      expect(range.endId).toEqual(1);
      expect(range.isSingleIdRange).toBeTruthy();
      expect(range.numberOfIds).toEqual(1);
    });
    it('creates ranges', () => {
      const ranges = new IdsRanges(Status.Enabled);
      ranges.fromIds([10, 20, 21, 23, 30, 31]);
      expect(ranges.numberOfRanges).toEqual(4);
      let range = ranges.get(0);
      expect(range.startId).toEqual(10);
      expect(range.endId).toEqual(10);
      expect(range.isSingleIdRange).toBeTruthy();
      expect(range.numberOfIds).toEqual(1);
      range = ranges.get(1);
      expect(range.startId).toEqual(20);
      expect(range.endId).toEqual(21);
      expect(range.isSingleIdRange).toBeFalsy();
      expect(range.numberOfIds).toEqual(2);
      range = ranges.get(2);
      expect(range.startId).toEqual(23);
      expect(range.endId).toEqual(23);
      expect(range.isSingleIdRange).toBeTruthy();
      expect(range.numberOfIds).toEqual(1);
      range = ranges.get(3);
      expect(range.startId).toEqual(30);
      expect(range.endId).toEqual(31);
      expect(range.isSingleIdRange).toBeFalsy();
      expect(range.numberOfIds).toEqual(2);
    });
  });
});
