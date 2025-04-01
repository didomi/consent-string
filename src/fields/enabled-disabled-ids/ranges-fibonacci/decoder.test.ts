import { IdsStatuses } from '@/common/ids-statuses';
import { decodeRangesFibonacci } from '@/fields/enabled-disabled-ids/ranges-fibonacci/decoder';
import { BitSet } from '@/common/bit-set';

describe('decodeRangesFibonacci', () => {
  it('should correctly decode range numbers with enabled then disabled IDs', () => {
    const expectedValue = new IdsStatuses([1, 3], [2, 4]);
    expect(decodeRangesFibonacci(new BitSet().fromBinaryString(
      '111' + // some initial padding
      '0001' + // EncodedStatuses (enabled then disabled) — 4 bits
      '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status - 16 bits
      // Range 1 of enabled status
      '11' + // FibonacciRangeStart (1) - 2 bits
      '11' + // FibonacciNumberIdsInRange (1) - 2 bits

      // Range 2 of enabled status
      '0011' + // FibonacciRangeStart (3) - 4 bits
      '11' + // FibonacciNumberIdsInRange (1) - 2 bits

      '0000000000000010' + // NumberOfRanges (2 ranges) for disabled status — 16 bits

      // Range 1 of disabled status
      '011' + // FibonacciRangeStart (2) - 3 bits
      '11' + // FibonacciNumberIdsInRange (1) - 2 bits

      // Range 2 of disabled status
      '1011' + // FibonacciRangeStart (4) - 4 bits
      '11' // FibonacciNumberIdsInRange (1) - 2 bits
    ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 57, // 4 + 16 + 2 + 2 + 4 + 2 + 16 + 3 + 2 + 4 + 2
      usedEncoder: 'rangesFibonacci',
    });
  });
  it('should correctly decode range numbers with only enabled IDs', () => {
    const expectedValue = new IdsStatuses([1, 3], []);
    expect(decodeRangesFibonacci(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0000' + // EncodedStatuses (enabled only) — 4 bits
        '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status - 16 bits
        // Range 1 of enabled status
        '11' + // FibonacciRangeStart (1) - 2 bits
        '11' + // FibonacciNumberIdsInRange (1) - 2 bits

        // Range 2 of enabled status
        '0011' + // FibonacciRangeStart (3) - 4 bits
        '11'  // FibonacciNumberIdsInRange (1) - 2 bits
      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 30, // 4 + 16 + 2 + 2 + 4 + 2
      usedEncoder: 'rangesFibonacci',
    });
  });
  it('should correctly decode range numbers with only disabled IDs', () => {
    const expectedValue = new IdsStatuses([], [2, 4]);
    expect(decodeRangesFibonacci(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0101' + // EncodedStatuses (disabled only) — 4 bits
        '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status - 16 bits
        // Range 1 of enabled status
        '011' + // FibonacciRangeStart (2) - 3 bits
        '11' + // FibonacciNumberIdsInRange (1) - 2 bits

        // Range 2 of enabled status
        '1011' + // FibonacciRangeStart (4) - 4 bits
        '11'  // FibonacciNumberIdsInRange (1) - 2 bits
      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 31, // 4 + 16 + 3 + 2 + 4 + 2
      usedEncoder: 'rangesFibonacci',
    });
  });
  it('should correctly decode range numbers with disabled then undefined IDs', () => {
    const expectedValue = new IdsStatuses([2, 3], [1, 5]);
    expect(decodeRangesFibonacci(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0111' + // EncodedStatuses (disabled then undefined) — 4 bits
        '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status - 16 bits
        // Range 1 of enabled status
        '11' + // FibonacciRangeStart (1) - 2 bits
        '11' + // FibonacciNumberIdsInRange (1) - 2 bits

        // Range 2 of enabled status
        '00011' + // FibonacciRangeStart (5) - 5 bits
        '11' + // FibonacciNumberIdsInRange (1) - 2 bits

        '0000000000000001' + // NumberOfRanges (1 ranges) for disabled status — 16 bits

        // Range 1 of undefined status
        '1011' + // FibonacciRangeStart (4) - 4 bits
        '11' // FibonacciNumberIdsInRange (1) - 2 bits
      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 53, // 4 + 16 + 2 + 2 + 5 + 2 + 16 +  4 + 2
      usedEncoder: 'rangesFibonacci',
    });
  });
  it('should correctly decode range numbers with multiple IDs in a range', () => {
    const expectedValue = new IdsStatuses([1, 2], [3, 4]);
    expect(decodeRangesFibonacci(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0001' + // EncodedStatuses (enabled then disabled) — 4 bits
        '0000000000000001' + // NumberOfRanges (1 range) for enabled status - 16 bits
        // Range 1 of enabled status
        '11' + // FibonacciRangeStart (1) - 2 bits
        '011' + // FibonacciNumberIdsInRange (2) - 3 bits

        '0000000000000001' + // NumberOfRanges (1 ranges) for disabled status — 16 bits

        // Range 1 of undefined status
        '0011' + // FibonacciRangeStart (3) - 4 bits
        '011' // FibonacciNumberIdsInRange (2) - 3 bits
      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 48, // 4 + 16 + 2 + 3 + 16 + 4 + 3
      usedEncoder: 'rangesFibonacci',
    });
  });
  it('should correctly decode range numbers with a mix of single and multiple IDs in ranges', () => {
    const expectedValue = new IdsStatuses([1], [3, 4]);
    expect(decodeRangesFibonacci(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0001' + // EncodedStatuses (enabled then disabled) — 4 bits
        '0000000000000001' + // NumberOfRanges (1 range) for enabled status - 16 bits
        // Range 1 of enabled status
        '11' + // FibonacciRangeStart (1) - 2 bits
        '11' + // FibonacciNumberIdsInRange (1) - 2 bits

        '0000000000000001' + // NumberOfRanges (1 ranges) for disabled status — 16 bits

        // Range 1 of undefined status
        '0011' + // FibonacciRangeStart (3) - 4 bits
        '011' // FibonacciNumberIdsInRange (2) - 3 bits
      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 47, // 4 + 16 + 2 + 2 + 16 + 4 + 3
      usedEncoder: 'rangesFibonacci',
    });
  });
});
