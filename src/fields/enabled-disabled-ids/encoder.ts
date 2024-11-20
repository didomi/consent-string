
import { BitSet } from '@/common/bit-set';
import { IdsStatuses } from '@/common/ids-statuses';
import { SchemaField } from '@/types/schema.type';
import { PurposesVendors } from '@/types/purposes-vendors.type';

import { EncodingAlgorithm } from "@/constants/encoding-algorithm";
import { encodeBitField2Bits } from "@/fields/enabled-disabled-ids/bit-field-2-bits/encoder";
import { encodeRangesFibonacci } from "@/fields/enabled-disabled-ids/ranges-fibonacci/encoder";
import { encodeRangesU16 } from '@/fields/enabled-disabled-ids/ranges-u16/encoder';

/**
 * Map of variants to their encoders
 */
export const ENABLED_DISABLED_IDS_VARIANTS = {
  [EncodingAlgorithm.RANGES_U16]: encodeRangesU16,
  [EncodingAlgorithm.RANGES_FIBONACCI]: encodeRangesFibonacci,
  [EncodingAlgorithm.BIT_FIELD_2_BITS]: encodeBitField2Bits
}

/**
 * Encode lists of enabled/disabled IDs
 *
 * @param value - The value to encode
 * @param field - The field to encode
 * @returns The encoded value
 */
export function encodeEnabledDisabledIDs(value: PurposesVendors, field: SchemaField): BitSet {
  if (!Array.isArray(field.variants) || field.variants.length === 0) {
    throw new Error(`Field "${field.key}" must have at least one variant`);
  }

  const idsStatuses = new IdsStatuses(value.enabled, value.disabled);

  // Compute all variants
  const possibleValues = field.variants.map((variant) => {
    if (variant in ENABLED_DISABLED_IDS_VARIANTS) {
      return ENABLED_DISABLED_IDS_VARIANTS[variant as keyof typeof ENABLED_DISABLED_IDS_VARIANTS](idsStatuses);
    } else {
      throw new Error(`Unsupported field variant "${variant}" for field ${field.key}`);
    }
  });

  // Return the smallest possible value
  return possibleValues.reduce((acc, curr) => (curr.size < acc.size ? curr : acc));
}
