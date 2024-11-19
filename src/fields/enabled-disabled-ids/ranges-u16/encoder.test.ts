import { IdsStatuses } from '@/common/ids-statuses';
import { encodeRangesU16 } from './encoder';

describe('encodeRangesU16', () => {
  it('should encode range numbers with enabled then disabled IDs', () => {
    const value = new IdsStatuses([1, 3], [2, 4]);

    const result = encodeRangesU16(value);

    expect(result.toString()).toBe(
      '01' + // EncodingAlgorithm

      '0001' + // EncodedStatuses (enabled then disabled)

      '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status

      // Range 1 of enabled status
      '1' + // SingleIdRange (true)
      '0000000000000001' + // RangeStart (1)

      // Range 2 of enabled status
      '1' + // SingleIdRange (false)
      '0000000000000011' + // RangeStart (3)

      '0000000000000010' + // NumberOfRanges (2 ranges) for disabled status

      // Range 1 of disabled status
      '1' + // SingleIdRange (true)
      '0000000000000010' + // RangeStart (2)

      // Range 2 of disabled status
      '1' + // SingleIdRange (true)
      '0000000000000100' // RangeStart (4)
    );
  });

  it('should encode range numbers with only enabled IDs', () => {
    const value = new IdsStatuses([1, 3], []);

    const result = encodeRangesU16(value);

    expect(result.toString()).toBe(
      '01' + // EncodingAlgorithm

      '0000' + // EncodedStatuses (enabled only)

      '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status

      // Range 1 of enabled status
      '1' + // SingleIdRange (true)
      '0000000000000001' + // RangeStart (1)

      // Range 2 of enabled status
      '1' + // SingleIdRange (false)
      '0000000000000011' // RangeStart (3)
    );
  });

  it('should encode range numbers with only disabled IDs', () => {
    const value = new IdsStatuses([], [2, 4]);

    const result = encodeRangesU16(value);

    expect(result.toString()).toBe(
      '01' + // EncodingAlgorithm

      '0101' + // EncodedStatuses (disabled)

      '0000000000000010' + // NumberOfRanges (2 ranges) for disabled status

      // Range 1 of disabled status
      '1' + // SingleIdRange (true)
      '0000000000000010' + // RangeStart (2)

      // Range 2 of disabled status
      '1' + // SingleIdRange (true)
      '0000000000000100' // RangeStart (4)
    );
  });

  it('should encode range numbers with enabled then undefined IDs', () => {
    const value = new IdsStatuses([1, 100], [2, 99]);

    const result = encodeRangesU16(value);

    expect(result.toString()).toBe(
      '01' + // EncodingAlgorithm

      '0011' + // EncodedStatuses (enabled, undefined)

      '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status

      // Range 1 of enabled status
      '1' + // SingleIdRange (true)
      '0000000000000001' + // RangeStart (1)

      // Range 2 of enabled status
      '1' + // SingleIdRange (true)
      '0000000001100100' + // RangeStart (100)

      '0000000000000001' + // NumberOfRanges (1 range) for undefined status

      // Range 1 of undefined status
      '0' + // SingleIdRange (false)
      '0000000000000011' + // RangeStart (3)
      '0000000001100010' // RangeEnd (98)
    );
  });

  it('should encode range numbers with disabled then undefined IDs', () => {
    const value = new IdsStatuses([2, 3], [1, 5]);

    const result = encodeRangesU16(value);

    expect(result.toString()).toBe(
      '01' + // EncodingAlgorithm

      '0111' + // EncodedStatuses (disabled then undefined)

      '0000000000000010' + // NumberOfRanges (2 ranges) for disabled status

      // Range 1 of disabled status
      '1' + // SingleIdRange (true)
      '0000000000000001' + // RangeStart (1)

      // Range 2 of disabled status
      '1' + // SingleIdRange (true)
      '0000000000000101' + // RangeStart (5)

      '0000000000000001' + // NumberOfRanges (1 range) for undefined status

      // Range 1 of undefined status
      '1' + // SingleIdRange (true)
      '0000000000000100' // RangeStart (4)
    );
  });

  it('should encode range numbers with multiple IDs in a range', () => {
    const value = new IdsStatuses([1, 2], [3, 4]);

    const result = encodeRangesU16(value);

    expect(result.toString()).toBe(
      '01' + // EncodingAlgorithm

      '0001' + // EncodedStatuses (enabled only)

      '0000000000000001' + // NumberOfRanges (1 range) for enabled status

      // Range 1 of enabled status
      '0' + // SingleIdRange (false)
      '0000000000000001' + // RangeStart (1)
      '0000000000000010' + // RangeEnd (2)

      '0000000000000001' + // NumberOfRanges (1 range) for disabled status

      // Range 1 of disabled status
      '0' + // SingleIdRange (false)
      '0000000000000011' + // RangeStart (3)
      '0000000000000100' // RangeEnd (4)
    );
  });

  it('should encode range numbers with a mix of single and multiple IDs in ranges', () => {
    const value = new IdsStatuses([1], [3, 4]);

    const result = encodeRangesU16(value);

    expect(result.toString()).toBe(
      '01' + // EncodingAlgorithm

      '0001' + // EncodedStatuses (enabled only)

      '0000000000000001' + // NumberOfRanges (1 range) for enabled status

      // Range 1 of enabled status
      '1' + // SingleIdRange (false)
      '0000000000000001' + // RangeStart (1)

      '0000000000000001' + // NumberOfRanges (1 range) for disabled status

      // Range 1 of disabled status
      '0' + // SingleIdRange (false)
      '0000000000000011' + // RangeStart (3)
      '0000000000000100' // RangeEnd (4)
    );
  });
});
