import { BitSet } from '@/common/bit-set';
import { EncodingAlgorithm } from '@/constants/encoding-algorithm';
import { encodeField, FieldValue } from '@/fields/encoder';
import { Schema } from '@/types/schema.type';

/**
 * Overrides applied to a schema
 * This can be used to override various parts of a pre-defined schema
 */
export type SchemaOverrides = {
  fields?: {
    [key: string]: {
      variants?: EncodingAlgorithm[];
    };
  };
}

/**
 * Options for encoding a consent string
 */
export interface EncodingOptions {
  /**
   * Schema to use for encoding
   */
  schema: Schema;

  /**
   * The user status
   */
  userStatus: Record<string, FieldValue>;

  /**
   * Overrides applied to the schema
   * This can be used to override various parts of the pre-defined schema
   */
  schemaOverrides?: SchemaOverrides;
}

/**
 * Encode a consent string
 */
export function encode({
  schema,
  userStatus,
  schemaOverrides,
}: EncodingOptions): string {
  if (!schema || !userStatus) {
    throw new Error('Missing required options');
  }

  const bitSet = new BitSet();

  for (const field of schema.fields) {
    const fieldValue = userStatus[field.key];

    // Apply schema overrides if defined so that the encoder can use the final definition
    if (schemaOverrides?.fields?.[field.key]?.variants) {
      field.variants = schemaOverrides.fields[field.key].variants;
    }

    bitSet.add(encodeField(field, fieldValue));
  }

  return bitSet.toBase64();
}
