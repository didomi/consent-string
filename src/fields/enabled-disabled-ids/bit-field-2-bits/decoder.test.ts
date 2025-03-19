import { decodeBitField2Bits } from '@/fields/enabled-disabled-ids/bit-field-2-bits/decoder';
import { BitSet } from '@/common/bit-set';
import { PurposesVendors } from '@/types/purposes-vendors.type';
import { IdsStatuses } from '@/common/ids-statuses';

describe('decodeBitField2Bits', () => {
  it('should correctly decode statuses when ids started from 1 and all ids are enabled', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [1, 2, 3, 4, 5],
      disabled: []
    };
    expect(decodeBitField2Bits(
      new BitSet().fromBinaryString(
        '0000' + // Some padding to skip with offset
        '1' + // StartFromOne (true)
        '0000000000000101' + // NumberOfIDs=5
        '1010101010' // Statuses by ID
      ),
      4
    )).toEqual({
      value: new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled),
      decodedLength: 27
    });
  });
  it('should correctly decode statuses when ids started from 1 and all ids are disabled', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [],
      disabled: [1, 2, 3, 4, 5]
    };
    expect(decodeBitField2Bits(
      new BitSet().fromBinaryString(
        '1' + // StartFromOne (true)
        '0000000000000101' + // NumberOfIDs=5
        '0101010101' // Statuses by ID
      ),
      0
    )).toEqual({
      value: new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled),
      decodedLength: 27
    });
  });
  it('should correctly decode statuses when ids started from 1 and all ids are undefined', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [],
      disabled: []
    };
    expect(decodeBitField2Bits(
      new BitSet().fromBinaryString(
        '1' + // StartFromOne (true)
        '0000000000000101' + // NumberOfIDs=5
        '0000000000' // Statuses by ID
      ),
      0
    )).toEqual({
      value: new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled),
      decodedLength: 27
    });
  });
  it('should correctly decode statuses when ids started from 1', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [1, 2, 5],
      disabled: [3]
    };
    expect(decodeBitField2Bits(
      new BitSet().fromBinaryString(
        '1' + // StartFromOne (true)
        '0000000000000101' + // NumberOfIDs=5
        '1010010010' // Statuses by ID
      ),
      0
    )).toEqual({
      value: new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled),
      decodedLength: 27
    });
  });
  it('should correctly decode statuses when all ids are enabled', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [8, 9, 10, 11, 12],
      disabled: []
    };
    expect(decodeBitField2Bits(
      new BitSet().fromBinaryString(
        '0000' + // Some padding to skip with offset
        '0' + // StartFromOne (true)
        '0000000000001000' + // StartID=8
        '0000000000000101' + // NumberOfIDs=5
        '1010101010' // Statuses by ID
      ),
      4
    )).toEqual({
      value: new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled),
      decodedLength: 43
    });
  });
  it('should correctly decode statuses when all ids are disabled', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [],
      disabled: [8, 9, 10, 11, 12]
    };
    expect(decodeBitField2Bits(
      new BitSet().fromBinaryString(
        '0000' + // Some padding to skip with offset
        '0' + // StartFromOne (true)
        '0000000000001000' + // StartID=8
        '0000000000000101' + // NumberOfIDs=5
        '0101010101' // Statuses by ID
      ),
      4
    )).toEqual({
      value: new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled),
      decodedLength: 43
    });
  });
  it('should correctly decode statuses when all ids are undefined', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [],
      disabled: []
    };
    expect(decodeBitField2Bits(
      new BitSet().fromBinaryString(
        '0000' + // Some padding to skip with offset
        '0' + // StartFromOne (true)
        '0000000000001000' + // StartID=8
        '0000000000000101' + // NumberOfIDs=5
        '0000000000' // Statuses by ID
      ),
      4
    )).toEqual({
      value: new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled),
      decodedLength: 43
    });
  });
  it('should correctly decode statuses', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [9, 10, 13],
      disabled: [11]
    };
    expect(decodeBitField2Bits(
      new BitSet().fromBinaryString(
        '0000' + // Some padding to skip with offset
        '0' + // StartFromOne (true)
        '0000000000001001' + // StartID=9
        '0000000000000101' + // NumberOfIDs=5
        '1010010010' // Statuses by ID
      ),
      4
    )).toEqual({
      value: new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled),
      decodedLength: 43
    });
  });
  it('should correctly decode empty statuses', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [],
      disabled: []
    };
    expect(decodeBitField2Bits(
      new BitSet().fromBinaryString(
        '0000' + // Some padding to skip with offset
        '0' + // StartFromOne (true)
        '0000000000000001' + // StartID=1
        '0000000000000000' // NumberOfIDs=0
      ),
      4
    )).toEqual({
      value: new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled),
      decodedLength: 33
    });
  })
});
