import { Schema } from '@/types/schema.type';
import { FieldValue } from '@/types/field-value.type';
import { BitSet } from '@/common/bit-set';
import { decodeField } from '@/fields/decoder';

export interface DecoderOptions {
  /**
   * Schema to use for decoding
   */
  schema: Schema;

  /**
   * Base64 encoded string
   */
  consentString: string;
}

/**
 * Decodes a consent string based on a provided schema.
 *
 * @param DecoderOptions - The options required for decoding.
 * @param DecoderOptions.schema - The schema that defines the fields and structure of the consent string.
 * @param DecoderOptions.consentString - The Base64 encoded consent string to be decoded.
 * @return An object where each key corresponds to a field from the schema and the values are the decoded values from the consent string.
 * @throws {Error} throw an error if the consent string is invalid or if there's an error during decoding.
 */
export function decode({
  schema,
  consentString }: DecoderOptions) : Record<string, FieldValue> {
  let offset = 0;
  const encoded = new BitSet().fromBase64(consentString);

  if (!encoded) {
    throw new Error('Invalid consent string');
  }
  const model: Record<string, FieldValue> = {};

  for (const field of schema.fields) {
    const result = decodeField(field, encoded, offset);

    if (result.error) {
      throw new Error(`[${offset}]:[${field.key}]:${result.error}`);
    }

    offset += result.decodedLength ?? 0;

    /**
     * Not save `result.value` if `value` defined in the schema (`field.value`)
     *  or `result.value` is `null` or `undefined`. The `result.value` could be `null` for an optional field.
     */
    if (typeof result.value !== 'undefined' && result.value !== null && typeof field.value === 'undefined') {
      model[field.key] = result.value;
    }
  }

  return model;
}
