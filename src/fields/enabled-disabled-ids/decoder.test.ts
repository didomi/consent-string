import { PurposesVendors } from '@/types/purposes-vendors.type';
import { BitSet } from '@/common/bit-set';
import { decodeEnabledDisabledIDs } from '@/fields/enabled-disabled-ids/decoder';

describe('decodeEnabledDisabledIDs', () => {
  it('should correctly decode enabled disabled ids for Bitfield 2 bits encoded', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [9, 10, 13],
      disabled: [11]
    };
    expect(decodeEnabledDisabledIDs(
      new BitSet().fromBinaryString(
        '00' + // BitField 2 bits encoding algorithm
        '0000' + // Some padding to skip with offset
        '0' + // StartFromOne (true)
        '0000000000001001' + // StartID=9
        '0000000000000101' + // NumberOfIDs=5
        '1010010010' // Statuses by ID
      ),
      4
    )).toEqual({
      value: purposesVendors,
      decodedLength: 45,
      usedEncoder: 'bitField2Bits',
    });
  });
  it('should correctly decode enabled disabled ids for Fibonacci ranges encoded', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [1],
      disabled: [3, 4]
    };
    expect(decodeEnabledDisabledIDs(new BitSet().fromBinaryString(
        '10' + // Fibonacci ranges encoding - 2 bits
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
      0 // offset to skip the initial padding
    )).toEqual({
      value: purposesVendors,
      decodedLength: 49, // 2 + 4 + 16 + 2 + 2 + 16 + 4 + 3
      usedEncoder: 'rangesFibonacci',
    });
  });
  it('should correctly decode enabled disabled ids for U16 ranges encoded', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [2, 3],
      disabled: [1, 5]
    };
    expect(decodeEnabledDisabledIDs(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '01' + // U16 ranges encoding
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
      value: purposesVendors,
      decodedLength: 89, // 2 + 4 + 16 + 1 + 16 + 1 + 16 + 16 + 1 + 16
      usedEncoder: 'rangesU16',
    });
  });
  it('should returns error for invalid algorithms codeword', () => {
    expect(decodeEnabledDisabledIDs(new BitSet().fromBinaryString(
        '111' + // some initial padding
        '11' + // Invalid encoding code
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
      error: 'Failed to decode Enabled Disabled Ids with error: Invalid encoded Algorithm: 11',
      decodedLength: 2
    });
  });
});
