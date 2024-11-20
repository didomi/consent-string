import { BitSet } from '@/common/bit-set';
import { IdsStatuses } from '@/common/ids-statuses';
import { encodeEnabledDisabledIDs } from './encoder';
import { SchemaField } from '@/types/schema.type';
import { PurposesVendors } from '@/types/purposes-vendors.type';
import { encodeBitField2Bits } from '@/fields/enabled-disabled-ids/bit-field-2-bits/encoder';
import { EncodingAlgorithm } from '@/constants/encoding-algorithm';
import { FieldType } from '@/fields/encoder';

describe('encodeEnabledDisabledIDs', () => {
  const mockField: SchemaField = {
    key: 'test_field',
    type: FieldType.ENABLED_DISABLED_IDS,
    variants: [EncodingAlgorithm.BIT_FIELD_2_BITS]
  };

  it('throws error when field has no variants', () => {
    const invalidField: SchemaField = {
      key: 'test_field',
      type: FieldType.ENABLED_DISABLED_IDS,
      variants: []
    };

    expect(() =>
      encodeEnabledDisabledIDs({ enabled: [], disabled: [] }, invalidField)
    ).toThrow('Field "test_field" must have at least one variant');
  });

  it('throws error for unsupported field variant', () => {
    const invalidField: SchemaField = {
      key: 'test_field',
      type: FieldType.ENABLED_DISABLED_IDS,
      variants: ['UnsupportedType' as any]
    };

    expect(() =>
      encodeEnabledDisabledIDs({ enabled: [], disabled: [] }, invalidField)
    ).toThrow('Unsupported field variant "UnsupportedType" for field test_field');
  });

  it('encodes empty enabled and disabled arrays', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [],
      disabled: []
    };

    const result = encodeEnabledDisabledIDs(purposesVendors, mockField);
    expect(result).toBeInstanceOf(BitSet);
    expect(result).toEqual(encodeBitField2Bits(new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled)));
    expect(result.isEmpty).toBeTruthy();
  });

  it('encodes values with enabled IDs', () => {
    const purposesVendors: PurposesVendors = {
      enabled: [1, 2, 3],
      disabled: []
    };

    const result = encodeEnabledDisabledIDs(purposesVendors, mockField);
    expect(result).toBeInstanceOf(BitSet);
    expect(result).toEqual(encodeBitField2Bits(new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled)));
    expect(result.isEmpty).toBeFalsy();
  });

  it('selects smallest possible encoded value when multiple variants are available', () => {
    const fieldWithMultipleVariants: SchemaField = {
      key: 'test_field',
      type: FieldType.ENABLED_DISABLED_IDS,
      variants: [EncodingAlgorithm.BIT_FIELD_2_BITS, EncodingAlgorithm.RANGES_U16, EncodingAlgorithm.RANGES_FIBONACCI]
    };

    const purposesVendors: PurposesVendors = {
      enabled: [1, 2, 3],
      disabled: [4, 5]
    };

    const result = encodeEnabledDisabledIDs(purposesVendors, fieldWithMultipleVariants);
    expect(result).toBeInstanceOf(BitSet);
    expect(result).toEqual(encodeBitField2Bits(new IdsStatuses(purposesVendors.enabled, purposesVendors.disabled)));
    expect(result.isEmpty).toBeFalsy();
  });
});
