import { encodeBitField2Bits } from './encoder';
import { IdsStatuses } from '@/common/ids-statuses';
import { PurposesVendors } from '@/types/purposes-vendors.type';

describe('encodeBitField2Bits', () => {
  it('encodes correctly when there is no enabled or disabled IDs', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [],
      disabled: []
    };
    const encoded = encodeBitField2Bits(new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled));
    expect(encoded.isEmpty).toBeTruthy();
  });

  describe('StartFromOne=true (low IDs)', () => {
    it('encodes correctly with only enabled IDs', () => {
      const purposesVendors: PurposesVendors = {
        enabled: [1, 2, 3, 4, 5],
        disabled: []
      };
      const encoded = encodeBitField2Bits(new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled));
      expect(encoded.isEmpty).toBeFalsy();
      expect(encoded.toString()).toEqual(
        '00' + // EncodingAlgorithm
        '1' + // StartFromOne (true)
        '0000000000000101' + // NumberOfIDs=5
        '1010101010' // Statuses by ID
      );
    });

    it('encodes correctly with only disabled IDs', () => {
      const purposesVendors: PurposesVendors = {
        enabled: [],
        disabled: [1, 2, 3, 4, 5]
      };
      const encoded = encodeBitField2Bits(new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled));
      expect(encoded.isEmpty).toBeFalsy();
      expect(encoded.toString()).toEqual(
        '00' + // EncodingAlgorithm
        '1' + // StartFromOne (true)
        '0000000000000101' + // NumberOfIDs=5
        '0101010101' // Statuses by ID
      );
    });

    it('encodes correctly with all types of IDs', () => {
      const purposesVendors: PurposesVendors = {
        enabled: [3, 4],
        disabled: [1, 5]
      };
      const encoded = encodeBitField2Bits(new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled));
      expect(encoded.isEmpty).toBeFalsy();
      expect(encoded.toString()).toEqual(
        '00' + // EncodingAlgorithm
        '1' + // StartFromOne (true)
        '0000000000000101' + // NumberOfIDs=5
        '0100101001' // Statuses by ID
      );
    });
  });

  describe('StartFromOne=false (high IDs)', () => {
    it('encodes correctly with only enabled IDs', () => {
      const purposesVendors: PurposesVendors = {
        enabled: [8, 9, 10, 11, 12],
        disabled: []
      };
      const encoded = encodeBitField2Bits(new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled));
      expect(encoded.isEmpty).toBeFalsy();
      expect(encoded.toString()).toEqual(
        '00' + // EncodingAlgorithm
        '0' + // StartFromOne (false)
        '0000000000001000' + // StartID=8
        '0000000000000101' + // NumberOfIDs=5
        '1010101010' // Statuses by ID
      );
    });

    it('encodes correctly with only disabled IDs', () => {
      const purposesVendors: PurposesVendors = {
        enabled: [],
        disabled: [8, 9, 10, 11, 12]
      };
      const encoded = encodeBitField2Bits(new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled));
      expect(encoded.isEmpty).toBeFalsy();
      expect(encoded.toString()).toEqual(
        '00' + // EncodingAlgorithm
        '0' + // StartFromOne (false)
        '0000000000001000' + // StartID=8
        '0000000000000101' + // NumberOfIDs=5
        '0101010101' // Statuses by ID
      );
    });

    it('encodes correctly with all types of IDs', () => {
      const purposesVendors: PurposesVendors = {
        enabled: [10, 11],
        disabled: [8, 12]
      };
      const encoded = encodeBitField2Bits(new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled));
      expect(encoded.isEmpty).toBeFalsy();
      expect(encoded.toString()).toEqual(
        '00' + // EncodingAlgorithm
        '0' + // StartFromOne (false)
        '0000000000001000' + // StartID=8
        '0000000000000101' + // NumberOfIDs=5
        '0100101001' // Statuses by ID
      );
    });
  });
});
