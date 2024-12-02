import { BitSet } from '@/common/bit-set';
import type { DecoderResult } from '@/types/decoder-result';
import { SchemaField } from '@/types/schema.type';
import { FieldType } from '@/fields/encoder';
import type { FieldValue } from '@/types/field-value.type';
import { decodeVersion } from '@/fields/version/decoder';
import { decodeU16, decodeU6 } from '@/fields/number/decoder';
import { decodeUUID } from '@/fields/uuid/decoder';
import { decodeDate } from '@/fields/date/decoder';
import { decodeEnabledDisabledIDs } from '@/fields/enabled-disabled-ids/decoder';

export type Decoder = (encoded: BitSet, offset: number) => DecoderResult<FieldValue>;

export const FIELD_TYPE_TO_DECODER_MAP: Record<FieldType, Decoder> = {
  [FieldType.VERSION]: decodeVersion,
  [FieldType.U6]: decodeU6,
  [FieldType.U16]: decodeU16,
  [FieldType.UUID]: decodeUUID,
  [FieldType.DATE]: decodeDate,
  [FieldType.ENABLED_DISABLED_IDS]: decodeEnabledDisabledIDs
};

/**
 * A function that retrieves the appropriate decoder for a given field type.
 *
 * @param field - The type of the field for which a decoder is to be retrieved.
 * @returns The decoder corresponding to the specified field type.
 */
export const getFieldDecoder = (field: FieldType): Decoder => {
  return FIELD_TYPE_TO_DECODER_MAP[field] as Decoder;
}

/**
 * Decodes a binary-encoded field and returns the decoded value along with the number of bits read.
 *
 * @param field - The schema definition of the field to decode.
 * @param encoded - The binary data from which the field is to be decoded.
 * @param offset - The position in the encoded data where decoding should begin.
 * @returns An object containing the decoded field value, the length of the data that was read, and any potential error messages.
 */
export const decodeField = (field: SchemaField, encoded: BitSet, offset: number): DecoderResult<FieldValue> => {
  let position = offset;
  /**
   * Check if field is optional, and if so
   *  we need to check the one bit value in the decoded string, and
   *    if this value is `false` then the optional field value is not present, and we need to return `null` as a value
   *      with decoded length equal to 1.
   */
  if (field.optional === true) {
    if (!encoded.get(position++)) {
      return {
        decodedLength: 1,
        value: null
      };
    }
  }

  const decodeField = getFieldDecoder(field.type as FieldType);

  if (!decodeField) {
    return {
      decodedLength: position - offset,
      error: `Failed to decode field: unknown field type: ${field.type}`,
    }
  }

  const result = decodeField(encoded, position);
  const decodedLength = position - offset + (result.decodedLength ?? 0);

  return {
    ...result,
    decodedLength,
  };
}
