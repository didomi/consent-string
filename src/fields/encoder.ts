import { BitSet } from '@/common/bit-set';
import { encodeDate } from '@/fields/date/encoder';
import { encodeEnabledDisabledIDs } from '@/fields/enabled-disabled-ids/encoder';
import { encodeU16, encodeU6 } from '@/fields/number/encoder';
import { encodeUUID } from '@/fields/uuid/encoder';
import { encodeVersion } from '@/fields/version/encoder';
import { SchemaField } from '@/types/schema.type';

/**
 * Field encoder
 */
export type Encoder<T> = (value: T, field: SchemaField) => BitSet;

/**
 * Field types
 */
export enum FieldType {
  VERSION = 'version',
  U6 = 'u6',
  U16 = 'u16',
  UUID = 'uuid',
  DATE = 'date',
  ENABLED_DISABLED_IDS = 'enabled_disabled_ids'
}

/**
 * Field type to encoder map
 */
export const FIELD_TYPE_TO_ENCODER_MAP: Record<FieldType, Encoder<any>> = {
  [FieldType.VERSION]: encodeVersion,
  [FieldType.U6]: encodeU6,
  [FieldType.U16]: encodeU16,
  [FieldType.UUID]: encodeUUID,
  [FieldType.DATE]: encodeDate,
  [FieldType.ENABLED_DISABLED_IDS]: encodeEnabledDisabledIDs
};

/**
 * Get a field encoder for a given type
 *
 * @param type - The type of field to get an encoder for
 * @returns Field encoder or undefined if the type is not supported
 */
export function getFieldEncoder<T>(type: FieldType): Encoder<T> | undefined {
  return FIELD_TYPE_TO_ENCODER_MAP[type];
}

/**
 * Encode a field
 *
 * @param field - The field to encode
 * @param value - The value to encode
 * @returns The encoded field
 */
export function encodeField<T>(field: SchemaField, value: T): BitSet {
  const bitSet = new BitSet();

  if (field.optional === true) {
    if (value === undefined || value === null) {
      // The field is optional and not present, we append a `0` to the bit string to indicate that the field is not present
      bitSet.addBoolean(false);

      return bitSet;
    } else {
      // The field is optional and present, we append a `1` to the bit string to indicate that the field is present
      bitSet.addBoolean(true);
    }
  } else if (value === undefined) {
    // The field is required and not present, we throw an error
    throw new Error(`Missing required field: ${field.key}`);
  }

  const encodeField = getFieldEncoder(field.type as FieldType);

  if (!encodeField) {
    throw new Error(`Unsupported field type: ${field.type}`);
  }

  bitSet.add(encodeField(value, field));

  return bitSet;
}
