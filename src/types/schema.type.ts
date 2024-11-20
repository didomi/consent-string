import { EncodingAlgorithm } from '@/constants/encoding-algorithm';
import type { FieldType } from '@/fields/encoder';

/**
 * A field in a consent string schema
 */
export interface SchemaField {
  key: string;
  type: FieldType;
  optional?: boolean;
  variants?: EncodingAlgorithm[];
}

/**
 * Schema for a consent string
 */
export interface Schema {
  fields: SchemaField[];
}
