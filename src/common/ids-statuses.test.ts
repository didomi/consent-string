import {
  IdsStatuses,
  Status,
  getStringCodeFromStatusArray,
  ENCODED_STATUSES_MAP,
  ENCODED_STATUSES_REVERSE_MAP,
} from './ids-statuses';

describe('IdsStatuses', () => {
  describe('constructor', () => {
    it('construct an object for empty enabled disabled', () => {
      const idsStatuses = new IdsStatuses([], []);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.maximumID).toEqual(0);
      expect(idsStatuses.minimumID).toEqual(0);
      expect(idsStatuses.numberOfDisabled).toEqual(0);
      expect(idsStatuses.numberOfEnabled).toEqual(0);
      expect(idsStatuses.numberOfUndefined).toEqual(0);
      expect(idsStatuses.isEmpty).toBeTruthy();
      expect(idsStatuses.maximumStatus).toBeUndefined;
      expect(idsStatuses.minimumStatus).toBeUndefined;
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();
    });
    it('construct an object when enabled is not empty and disabled is empty', () => {
      const idsStatuses = new IdsStatuses([1, 2, 3, 4], []);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.maximumID).toEqual(4);
      expect(idsStatuses.minimumID).toEqual(1);
      expect(idsStatuses.numberOfDisabled).toEqual(0);
      expect(idsStatuses.numberOfEnabled).toEqual(4);
      expect(idsStatuses.disabled).toEqual([]);
      expect(idsStatuses.enabled).toEqual([1, 2, 3, 4]);
      expect(idsStatuses.numberOfUndefined).toEqual(0);
      expect(idsStatuses.undefinedIds).toEqual([]);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();
      expect(idsStatuses.isEmpty).toBeFalsy();
    });
    it('construct an object when enabled is empty and disabled is not empty', () => {
      const idsStatuses = new IdsStatuses([], [1, 2, 3, 4]);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.maximumID).toEqual(4);
      expect(idsStatuses.minimumID).toEqual(1);
      expect(idsStatuses.numberOfDisabled).toEqual(4);
      expect(idsStatuses.numberOfEnabled).toEqual(0);
      expect(idsStatuses.disabled).toEqual([1, 2, 3, 4]);
      expect(idsStatuses.enabled).toEqual([]);
      expect(idsStatuses.numberOfUndefined).toEqual(0);
      expect(idsStatuses.undefinedIds).toEqual([]);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();
      expect(idsStatuses.isEmpty).toBeFalsy();
    });
    it('construct an object when enabled and disabled is not empty', () => {
      const idsStatuses = new IdsStatuses([1, 2, 3, 4], [5, 10]);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.maximumID).toEqual(10);
      expect(idsStatuses.minimumID).toEqual(1);
      expect(idsStatuses.numberOfDisabled).toEqual(2);
      expect(idsStatuses.numberOfEnabled).toEqual(4);
      expect(idsStatuses.disabled).toEqual([5, 10]);
      expect(idsStatuses.enabled).toEqual([1, 2, 3, 4]);
      expect(idsStatuses.numberOfUndefined).toEqual(4);
      expect(idsStatuses.undefinedIds).toEqual([6, 7, 8, 9]);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeFalsy();
      expect(idsStatuses.isEmpty).toBeFalsy();
    });
    it('construct an object when enabled is empty, disabled and undefined are not empty', () => {
      const idsStatuses = new IdsStatuses([], [5, 10]);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.maximumID).toEqual(10);
      expect(idsStatuses.minimumID).toEqual(5);
      expect(idsStatuses.numberOfDisabled).toEqual(2);
      expect(idsStatuses.numberOfEnabled).toEqual(0);
      expect(idsStatuses.disabled).toEqual([5, 10]);
      expect(idsStatuses.enabled).toEqual([]);
      expect(idsStatuses.numberOfUndefined).toEqual(4);
      expect(idsStatuses.undefinedIds).toEqual([6, 7, 8, 9]);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();
      expect(idsStatuses.isEmpty).toBeFalsy();
    });
    it('construct an object when enabled and undefined are not empty', () => {
      const idsStatuses = new IdsStatuses([5, 10], []);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.maximumID).toEqual(10);
      expect(idsStatuses.minimumID).toEqual(5);
      expect(idsStatuses.numberOfDisabled).toEqual(0);
      expect(idsStatuses.numberOfEnabled).toEqual(2);
      expect(idsStatuses.disabled).toEqual([]);
      expect(idsStatuses.enabled).toEqual([5, 10]);
      expect(idsStatuses.numberOfUndefined).toEqual(4);
      expect(idsStatuses.undefinedIds).toEqual([6, 7, 8, 9]);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();
      expect(idsStatuses.isEmpty).toBeFalsy();
    });
  });
  describe('isEmpty', () => {
    it('returns true for empty ids statuses', () => {
      const idsStatuses = new IdsStatuses([], []);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.isEmpty).toBeTruthy();
    });
    it('returns false for none empty ids statuses', () => {
      const idsStatuses = new IdsStatuses([1, 2], []);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.isEmpty).toBeFalsy();
    });
  });
  describe('getIdStatus', () => {
    it('returns right statuses for enabled, disabled and undefined', () => {
      const idsStatuses = new IdsStatuses([1, 2], [4, 5]);
      expect(idsStatuses.getIdStatus(0)).toEqual(Status.Undefined);
      expect(idsStatuses.getIdStatus(1)).toEqual(Status.Enabled);
      expect(idsStatuses.getIdStatus(2)).toEqual(Status.Enabled);
      expect(idsStatuses.getIdStatus(3)).toEqual(Status.Undefined);
      expect(idsStatuses.getIdStatus(4)).toEqual(Status.Disabled);
      expect(idsStatuses.getIdStatus(5)).toEqual(Status.Disabled);
      expect(idsStatuses.getIdStatus(6)).toEqual(Status.Undefined);
    });
  });
  describe('isStatusSameForMaxMinIds', () => {
    it('returns right value when minimum and maximum are enabled', () => {
      const idsStatuses = new IdsStatuses([20, 1], [4, 5]);
      expect(idsStatuses.maximumID).toEqual(20);
      expect(idsStatuses.minimumID).toEqual(1);
      expect(idsStatuses.minimumStatus).toEqual(Status.Enabled);
      expect(idsStatuses.maximumStatus).toEqual(Status.Enabled);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();
    });
    it('returns right value when minimum and maximum are disabled', () => {
      const idsStatuses = new IdsStatuses([10, 20], [50, 4]);
      expect(idsStatuses.maximumID).toEqual(50);
      expect(idsStatuses.minimumID).toEqual(4);
      expect(idsStatuses.minimumStatus).toEqual(Status.Disabled);
      expect(idsStatuses.maximumStatus).toEqual(Status.Disabled);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();
    });
    it('returns right value when minimum is enabled and maximum is disabled', () => {
      const idsStatuses = new IdsStatuses([10, 5], [50, 40]);
      expect(idsStatuses.maximumID).toEqual(50);
      expect(idsStatuses.minimumID).toEqual(5);
      expect(idsStatuses.minimumStatus).toEqual(Status.Enabled);
      expect(idsStatuses.maximumStatus).toEqual(Status.Disabled);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeFalsy();
    });
    it('returns right value when minimum is disabled and maximum is enabled', () => {
      const idsStatuses = new IdsStatuses([70, 100, 55, 6], [5, 45, 40]);
      expect(idsStatuses.maximumID).toEqual(100);
      expect(idsStatuses.minimumID).toEqual(5);
      expect(idsStatuses.minimumStatus).toEqual(Status.Disabled);
      expect(idsStatuses.maximumStatus).toEqual(Status.Enabled);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeFalsy();
    });
    it('returns right value for empty ids statuses', () => {
      const idsStatuses = new IdsStatuses([], []);
      expect(idsStatuses.maximumID).toEqual(0);
      expect(idsStatuses.minimumID).toEqual(0);
      expect(idsStatuses.minimumStatus).toBeUndefined;
      expect(idsStatuses.maximumStatus).toBeUndefined;
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();
    });
  });
  describe('numberOfEnabled', () => {
    it('returns right number of empty enabled', () => {
      const idsStatuses = new IdsStatuses([], []);
      expect(idsStatuses.numberOfEnabled).toEqual(0);
    });
    it('returns right number of enabled contains one element', () => {
      const idsStatuses = new IdsStatuses([1], []);
      expect(idsStatuses.numberOfEnabled).toEqual(1);
    });
    it('returns right number of enabled contains several element', () => {
      const idsStatuses = new IdsStatuses([1, 2, 3], []);
      expect(idsStatuses.numberOfEnabled).toEqual(3);
    });
  });
  describe('numberOfDisabled', () => {
    it('returns right number of empty disabled', () => {
      const idsStatuses = new IdsStatuses([], []);
      expect(idsStatuses.numberOfDisabled).toEqual(0);
    });
    it('returns right number of disabled contains one element', () => {
      const idsStatuses = new IdsStatuses([], [1]);
      expect(idsStatuses.numberOfDisabled).toEqual(1);
    });
    it('returns right number of enabled contains several element', () => {
      const idsStatuses = new IdsStatuses([1, 2, 3], [5, 6, 7, 8]);
      expect(idsStatuses.numberOfDisabled).toEqual(4);
    });
  });
  describe('numberOfUndefined', () => {
    it('returns right number of empty undefined', () => {
      const idsStatuses = new IdsStatuses([], []);
      expect(idsStatuses.numberOfUndefined).toEqual(0);
    });
    it('returns right number of undefined contains one element', () => {
      const idsStatuses = new IdsStatuses([1], [3]);
      expect(idsStatuses.numberOfUndefined).toEqual(1);
    });
    it('returns right number of undefined contains several element', () => {
      const idsStatuses = new IdsStatuses([1, 6], [3]);
      expect(idsStatuses.numberOfUndefined).toEqual(3);
    });
  });
  describe('applyShift', () => {
    it('should not apply shift when empty or shift is zero', () => {
      const idsStatuses1 = new IdsStatuses([], []);
      idsStatuses1.applyShift(3);
      expect(idsStatuses1.isEmpty).toBe(true);

      const idsStatuses2 = new IdsStatuses([2, 4], [1, 3]);
      idsStatuses2.applyShift(0);
      expect(idsStatuses2.enabled).toEqual([2, 4]);
      expect(idsStatuses2.disabled).toEqual([1, 3]);
    });
    it('should apply positive shift to enabled, disabled, and undefined IDs', () => {
      const idsStatuses = new IdsStatuses([3, 6], [2, 4]);
      idsStatuses.applyShift(3);

      expect(idsStatuses.enabled).toEqual([6, 9]);
      expect(idsStatuses.disabled).toEqual([5, 7]);
      expect(idsStatuses.undefinedIds).toEqual([8]);
    });
    it('should apply negative shift to enabled, disabled, and undefined IDs', () => {
      const idsStatuses = new IdsStatuses([3, 6], [2, 4]);
      idsStatuses.applyShift(-1);

      expect(idsStatuses.enabled).toEqual([2, 5]);
      expect(idsStatuses.disabled).toEqual([1, 3]);
      expect(idsStatuses.undefinedIds).toEqual([4]);
    });
  });
  describe('getStringCodeFromStatusArray', () => {
    let statuses: Array<Status>;
    let expected: string;
    let encoded: string;
    it('should return right values for different combination of statuses', () => {
      statuses = [];
      expected = '';
      expect(getStringCodeFromStatusArray(statuses)).toEqual(expected);

      statuses = [Status.Enabled];
      expected = '10';
      encoded = '0000';
      expect(getStringCodeFromStatusArray(statuses)).toEqual(expected);
      expect(ENCODED_STATUSES_REVERSE_MAP.get(expected)).toEqual(encoded);
      expect(ENCODED_STATUSES_MAP.get(encoded)).toEqual(statuses);

      statuses = [Status.Enabled, Status.Disabled];
      expected = '1001';
      encoded = '0001';
      expect(getStringCodeFromStatusArray(statuses)).toEqual(expected);
      expect(ENCODED_STATUSES_REVERSE_MAP.get(expected)).toEqual(encoded);
      expect(ENCODED_STATUSES_MAP.get(encoded)).toEqual(statuses);

      statuses = [Status.Enabled, Status.Undefined];
      expected = '1000';
      encoded = '0011';
      expect(getStringCodeFromStatusArray(statuses)).toEqual(expected);
      expect(ENCODED_STATUSES_REVERSE_MAP.get(expected)).toEqual(encoded);
      expect(ENCODED_STATUSES_MAP.get(encoded)).toEqual(statuses);

      statuses = [Status.Disabled];
      expected = '01';
      encoded = '0101';
      expect(getStringCodeFromStatusArray(statuses)).toEqual(expected);
      expect(ENCODED_STATUSES_REVERSE_MAP.get(expected)).toEqual(encoded);
      expect(ENCODED_STATUSES_MAP.get(encoded)).toEqual(statuses);

      statuses = [Status.Disabled, Status.Enabled];
      expected = '0110';
      encoded = '0100';
      expect(getStringCodeFromStatusArray(statuses)).toEqual(expected);
      expect(ENCODED_STATUSES_REVERSE_MAP.get(expected)).toEqual(encoded);
      expect(ENCODED_STATUSES_MAP.get(encoded)).toEqual(statuses);

      statuses = [Status.Disabled, Status.Undefined];
      expected = '0100';
      encoded = '0111';
      expect(getStringCodeFromStatusArray(statuses)).toEqual(expected);
      expect(ENCODED_STATUSES_REVERSE_MAP.get(expected)).toEqual(encoded);
      expect(ENCODED_STATUSES_MAP.get(encoded)).toEqual(statuses);

      statuses = [Status.Undefined];
      expected = '00';
      encoded = '1111';
      expect(getStringCodeFromStatusArray(statuses)).toEqual(expected);
      expect(ENCODED_STATUSES_REVERSE_MAP.get(expected)).toEqual(encoded);
      expect(ENCODED_STATUSES_MAP.get(encoded)).toEqual(statuses);

      statuses = [Status.Undefined, Status.Enabled];
      expected = '0010';
      encoded = '1100';
      expect(getStringCodeFromStatusArray(statuses)).toEqual(expected);
      expect(ENCODED_STATUSES_REVERSE_MAP.get(expected)).toEqual(encoded);
      expect(ENCODED_STATUSES_MAP.get(encoded)).toEqual(statuses);

      statuses = [Status.Undefined, Status.Disabled];
      expected = '0001';
      encoded = '1101';
      expect(getStringCodeFromStatusArray(statuses)).toEqual(expected);
      expect(ENCODED_STATUSES_REVERSE_MAP.get(expected)).toEqual(encoded);
      expect(ENCODED_STATUSES_MAP.get(encoded)).toEqual(statuses);
    });
  });
  describe('toRanges', () => {
    it('returns empty enabled ranges for empty ids statuses', () => {
      const idsStatuses = new IdsStatuses([], []);
      const rangesStatuses = idsStatuses.toRanges();
      expect(rangesStatuses.length).toEqual(1);
      const ranges = rangesStatuses[0];
      expect(ranges.numberOfRanges).toEqual(0);
      expect(ranges.status).toEqual(Status.Enabled);
    });
    it('returns enabled ranges if only enabled are present', () => {
      const idsStatuses = new IdsStatuses([1, 2, 10], []);
      const rangesStatuses = idsStatuses.toRanges();
      expect(rangesStatuses.length).toEqual(1);
      const ranges = rangesStatuses[0];
      expect(ranges.numberOfRanges).toEqual(2);
      expect(ranges.status).toEqual(Status.Enabled);
    });
    it('returns disabled ranges if only disabled are present', () => {
      const idsStatuses = new IdsStatuses([], [20, 21, 22]);
      const rangesStatuses = idsStatuses.toRanges();
      expect(rangesStatuses.length).toEqual(1);
      const ranges = rangesStatuses[0];
      expect(ranges.numberOfRanges).toEqual(1);
      expect(ranges.status).toEqual(Status.Disabled);
    });
    it('returns enabled and disabled if min and max have different statuses', () => {
      const idsStatuses = new IdsStatuses([1, 5, 6], [2, 21]);
      const rangesStatuses = idsStatuses.toRanges();
      expect(rangesStatuses.length).toEqual(2);
      let ranges = rangesStatuses[0];
      expect(ranges.numberOfRanges).toEqual(2);
      expect(ranges.status).toEqual(Status.Enabled);
      ranges = rangesStatuses[1];
      expect(ranges.numberOfRanges).toEqual(2);
      expect(ranges.status).toEqual(Status.Disabled);
    });
    it('returns enabled and undefined if min and max are enabled and undefined has less number of ranges', () => {
      const idsStatuses = new IdsStatuses([1, 5, 6, 8], [2, 3, 7]);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();

      const rangesStatuses = idsStatuses.toRanges();
      expect(rangesStatuses.length).toEqual(2);
      let ranges = rangesStatuses[0];
      expect(ranges.numberOfRanges).toEqual(3);
      expect(ranges.status).toEqual(Status.Enabled);
      ranges = rangesStatuses[1];
      expect(ranges.numberOfRanges).toEqual(1);
      expect(ranges.status).toEqual(Status.Undefined);
    });
    it('returns enabled and disabled if min and max are enabled and undefined has bigger number of ranges', () => {
      const idsStatuses = new IdsStatuses([1, 5, 6, 8], [2, 3]);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();

      const rangesStatuses = idsStatuses.toRanges();
      expect(rangesStatuses.length).toEqual(2);
      let ranges = rangesStatuses[0];
      expect(ranges.numberOfRanges).toEqual(3);
      expect(ranges.status).toEqual(Status.Enabled);
      ranges = rangesStatuses[1];
      expect(ranges.numberOfRanges).toEqual(1);
      expect(ranges.status).toEqual(Status.Disabled);
    });
    it('returns enabled and disabled if min and max are disabled and undefined has bigger number of ranges', () => {
      const idsStatuses = new IdsStatuses([2, 3], [1, 5, 6, 8]);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();

      const rangesStatuses = idsStatuses.toRanges();
      expect(rangesStatuses.length).toEqual(2);
      let ranges = rangesStatuses[0];
      expect(ranges.numberOfRanges).toEqual(1);
      expect(ranges.status).toEqual(Status.Enabled);
      ranges = rangesStatuses[1];
      expect(ranges.numberOfRanges).toEqual(3);
      expect(ranges.status).toEqual(Status.Disabled);
    });
    it('returns disabled and undefined if min and max are disabled and undefined has less number of ranges', () => {
      const idsStatuses = new IdsStatuses([2, 3, 7], [1, 5, 6, 8]);
      expect(idsStatuses.isStatusSameForMaxMinIds).toBeTruthy();

      const rangesStatuses = idsStatuses.toRanges();
      expect(rangesStatuses.length).toEqual(2);
      let ranges = rangesStatuses[0];
      expect(ranges.numberOfRanges).toEqual(3);
      expect(ranges.status).toEqual(Status.Disabled);
      ranges = rangesStatuses[1];
      expect(ranges.numberOfRanges).toEqual(1);
      expect(ranges.status).toEqual(Status.Undefined);
    });
  });
  describe('fromRanges', () => {
    it('creates ids statuses form empty statuses ranges', () => {
      const idsStatuses = IdsStatuses.fromRanges([]);
      expect(idsStatuses.isEmpty).toBeTruthy();
    });
    it('creates ids statuses if only enabled are present', () => {
      const rangesStatuses = new IdsStatuses([1, 2, 10], []).toRanges();
      const idsStatuses = IdsStatuses.fromRanges(rangesStatuses);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.isEmpty).toBeFalsy();
      expect(idsStatuses.enabled).toEqual([1, 2, 10]);
      expect(idsStatuses.disabled).toEqual([]);
    });
    it('creates ids statuses if only disabled are present', () => {
      const rangesStatuses = new IdsStatuses([], [1, 2, 10]).toRanges();
      const idsStatuses = IdsStatuses.fromRanges(rangesStatuses);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.isEmpty).toBeFalsy();
      expect(idsStatuses.enabled).toEqual([]);
      expect(idsStatuses.disabled).toEqual([1, 2, 10]);
    });
    it('creates ids statuses if enabled and disabled are present', () => {
      const rangesStatuses = new IdsStatuses([1, 5, 6, 8], [2, 3]).toRanges();
      const idsStatuses = IdsStatuses.fromRanges(rangesStatuses);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.isEmpty).toBeFalsy();
      expect(idsStatuses.enabled).toEqual([1, 5, 6, 8]);
      expect(idsStatuses.disabled).toEqual([2, 3]);
    });
    it('creates ids statuses and restore disabled from enabled and undefined', () => {
      const rangesStatuses = new IdsStatuses([1, 5, 6, 8], [2, 3, 7]).toRanges();
      const idsStatuses = IdsStatuses.fromRanges(rangesStatuses);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.isEmpty).toBeFalsy();
      expect(idsStatuses.enabled).toEqual([1, 5, 6, 8]);
      expect(idsStatuses.disabled).toEqual([2, 3, 7]);
    });
    it('creates ids statuses and restore enabled from disabled and undefined', () => {
      const rangesStatuses = new IdsStatuses([2, 3, 7], [1, 5, 6, 8]).toRanges();
      const idsStatuses = IdsStatuses.fromRanges(rangesStatuses);
      expect(idsStatuses).toBeDefined();
      expect(idsStatuses.isEmpty).toBeFalsy();
      expect(idsStatuses.enabled).toEqual([2, 3, 7]);
      expect(idsStatuses.disabled).toEqual([1, 5, 6, 8]);
    });
  });
  describe('toPurposesVendors', () => {
    it('creates empty PurposesVendors from empty object', () => {
      const idsStatuses = IdsStatuses.fromRanges([]);
      expect(idsStatuses.toPurposesVendors()).toEqual({
        enabled: [],
        disabled: [],
      });
    });
    it('creates correct PurposesVendors when both are not empty', () => {
      const idsStatuses = new IdsStatuses([2, 3, 7], [1, 5, 6, 8]);
      expect(idsStatuses.toPurposesVendors()).toEqual({
        enabled: [2, 3, 7],
        disabled: [1, 5, 6, 8],
      });
    });
    it('creates correct PurposesVendors when disabled is empty', () => {
      const idsStatuses = new IdsStatuses([2, 3, 7], []);
      expect(idsStatuses.toPurposesVendors()).toEqual({
        enabled: [2, 3, 7],
        disabled: [],
      });
    });
    it('creates correct PurposesVendors when enabled is empty', () => {
      const idsStatuses = new IdsStatuses([], [129]);
      expect(idsStatuses.toPurposesVendors()).toEqual({
        enabled: [],
        disabled: [129],
      });
    });
  });
});
