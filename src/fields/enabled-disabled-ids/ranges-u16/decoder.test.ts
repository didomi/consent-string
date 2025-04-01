import { IdsStatuses } from '@/common/ids-statuses';
import { BitSet } from '@/common/bit-set';
import { decodeRangesU16 } from '@/fields/enabled-disabled-ids/ranges-u16/decoder';

describe('decodeRangesU16', () => {
  it('should correctly decode range numbers with enabled then disabled IDs', () => {
    const expectedValue = new IdsStatuses([1, 3], [2, 4]);
    expect(decodeRangesU16(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0001' + // EncodedStatuses (enabled then disabled) — 4 bits
        '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status - 16 bits

        // Range 1 of enabled status
        '1' + // SingleIdRange (true) — 1 bit
        '0000000000000001' + // RangeStart (1) - 16 bits

        // Range 2 of enabled status
        '1' + // SingleIdRange (true) — bit
        '0000000000000011' + // RangeStart (3) - 16 bits

        '0000000000000010' + // NumberOfRanges (2 ranges) for disabled status — 16 bits

        // Range 1 of disabled status
        '1' + // SingleIdRange (true) — 1 bit
        '0000000000000010' + // RangeStart (2) - 16 bits

        // Range 2 of disabled status
        '1' + // SingleIdRange (true) — 1 bit
        '0000000000000100' // RangeStart (4) - 16 bits
      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 104, // 4 + 16 + 1 + 16 + 1 + 16 + 16 + 1 + 16 + 1 + 16
      usedEncoder: 'rangesU16',
    });
  });
  it('should correctly decode range numbers with only enabled IDs', () => {
    const expectedValue = new IdsStatuses([1, 3], []);
    expect(decodeRangesU16(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0000' + // EncodedStatuses (enabled only) — 4 bits
        '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status - 16 bits

        // Range 1 of enabled status
        '1' + // SingleIdRange (true) — 1 bit
        '0000000000000001' + // RangeStart (1) - 16 bits

        // Range 2 of enabled status
        '1' + // SingleIdRange (true) — bit
        '0000000000000011'  // RangeStart (3) - 16 bits
      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 54, // 4 + 16 + 1 + 16 + 1 + 16
      usedEncoder: 'rangesU16',
    });
  });
  it('should correctly decode range numbers with only disabled IDs', () => {
    const expectedValue = new IdsStatuses([], [2, 4]);
    expect(decodeRangesU16(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0101' + // EncodedStatuses (disabled only) — 4 bits
        '0000000000000010' + // NumberOfRanges (2 ranges) for disabled status — 16 bits

        // Range 1 of disabled status
        '1' + // SingleIdRange (true) — 1 bit
        '0000000000000010' + // RangeStart (2) - 16 bits

        // Range 2 of disabled status
        '1' + // SingleIdRange (true) — bit
        '0000000000000100'  // RangeStart (4) - 16 bits
      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 54, // 4 + 16 + 1 + 16 + 1 + 16
      usedEncoder: 'rangesU16',
    });
  });
  it('should correctly decode range numbers with enabled then undefined IDs', () => {
    const expectedValue = new IdsStatuses([1, 100], [2, 99]);
    expect(decodeRangesU16(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0011' + // EncodedStatuses (enabled, undefined) — 4 bits
        '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status — 16 bits

        // Range 1 of enabled status
        '1' + // SingleIdRange (true) — 1 bit
        '0000000000000001' + // RangeStart (1) - 16 bits

        // Range 2 of enabled status
        '1' + // SingleIdRange (true) — bit
        '0000000001100100' +  // RangeStart (100) - 16 bits

        '0000000000000001' + // NumberOfRanges (1 range) for undefined status - 16 bits

        // Range 1 of undefined status
        '0' + // SingleIdRange (false) — 1 bit
        '0000000000000011' + // RangeStart (3) - 16 bits
        '0000000001100010' // RangeEnd (98) - 16 bits
      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 103, // 4 + 16 + 1 + 16 + 1 + 16 + 16 + 1 + 16 + 16
      usedEncoder: 'rangesU16',
    });
  });
  it('should correctly decode range numbers with disabled then undefined IDs', () => {
    const expectedValue = new IdsStatuses([2, 3], [1, 5]);
    expect(decodeRangesU16(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0111' + // EncodedStatuses (disabled then undefined) — 4 bits
        '0000000000000010' + // NumberOfRanges (2 ranges) for disabled status — 16 bits

        // Range 1 of disabled status
        '1' + // SingleIdRange (true) — 1 bit
        '0000000000000001' + // RangeStart (1) - 16 bits

        // Range 2 of disabled status
        '1' + // SingleIdRange (true) — bit
        '0000000000000101' +  // RangeStart (5) - 16 bits

        '0000000000000001' + // NumberOfRanges (1 range) for undefined status - 16 bits

        // Range 1 of undefined status
        '1' + // SingleIdRange (true) — 1 bit
        '0000000000000100' // RangeStart (4) - 16 bits

      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 87, // 4 + 16 + 1 + 16 + 1 + 16 + 16 + 1 + 16
      usedEncoder: 'rangesU16',
    });
  });
  it('should correctly decode range numbers with multiple IDs in a range', () => {
    const expectedValue = new IdsStatuses([1, 2], [3, 4]);
    expect(decodeRangesU16(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0001' + // EncodedStatuses (enabled and disables) — 4 bits
        '0000000000000001' + // NumberOfRanges (1 range) for enabled status — 16 bits

        // Range 1 of enabled status
        '0' + // SingleIdRange (false) — 1 bit
        '0000000000000001' + // RangeStart (1) - 16 bits
        '0000000000000010' + // RangeEnd (2) - 16 bits

        '0000000000000001' + // NumberOfRanges (1 range) for disabled status - 16 bits

        // Range 1 of undefined status
        '0' + // SingleIdRange (false) — 1 bit
        '0000000000000011' + // RangeStart (3) - 16 bits
        '0000000000000100' // RangeEnd (4) - 16 bits

      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 102, // 4 + 16 + 1 + 16 + 16 + 16 + 1 + 16 + 16
      usedEncoder: 'rangesU16',
    });
  });
  it('should correctly decode range numbers with a mix of single and multiple IDs in ranges', () => {
    const expectedValue = new IdsStatuses([1], [3, 4]);
    expect(decodeRangesU16(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '0001' + // EncodedStatuses (enabled and disables) — 4 bits
        '0000000000000001' + // NumberOfRanges (1 range) for enabled status — 16 bits

        // Range 1 of enabled status
        '1' + // SingleIdRange (true) — 1 bit
        '0000000000000001' + // RangeStart (1) - 16 bits

        '0000000000000001' + // NumberOfRanges (1 range) for disabled status - 16 bits

        // Range 1 of undefined status
        '0' + // SingleIdRange (false) — 1 bit
        '0000000000000011' + // RangeStart (3) - 16 bits
        '0000000000000100' // RangeEnd (4) - 16 bits

      ),
      3 // offset to skip the initial padding
    )).toEqual({
      value: expectedValue,
      decodedLength: 86, // 4 + 16 + 1 + 16 + 16 + 16 + 1 + 16 + 16
      usedEncoder: 'rangesU16',
    });
  });
});
