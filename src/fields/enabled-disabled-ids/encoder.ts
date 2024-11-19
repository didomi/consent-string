
import { encodeBitField2Bits } from "@/fields/enabled-disabled-ids/bit-field-2-bits/encoder";
import { encodeRangesFibonacci } from "@/fields/enabled-disabled-ids/ranges-fibonacci/encoder";
import { encodeRangesU16 } from '@/fields/enabled-disabled-ids/ranges-u16/encoder';
import { BitSet } from '@/common/bit-set';
import { IdsStatuses } from '@/common/ids-statuses';
import { SchemaField } from '@/types/schema.type';
import { PurposesVendors } from '@/types/purposes-vendors.type';

/**
 * Map of variants to their encoders
 */
const VARIANTS = {
  ranges_u16: encodeRangesU16,
  ranges_fibonacci: encodeRangesFibonacci,
  bit_field_2_bits: encodeBitField2Bits
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
    if (variant in VARIANTS) {
      return VARIANTS[variant as keyof typeof VARIANTS](idsStatuses);
    } else {
      throw new Error(`Unsupported field variant "${variant}" for field ${field.key}`);
    }
  });

  // Return the smallest possible value
  return possibleValues.reduce((acc, curr) => (curr.size < acc.size ? curr : acc));
}
