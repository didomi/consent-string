import { EncodingAlgorithm } from '@/constants/encoding-algorithm';
import type { FieldType } from '@/fields/encoder';
import type { FieldValue } from '@/types/field-value.type';

/**
 * A field in a consent string schema
 */
export interface SchemaField {
  key: string;
  type: FieldType;
  optional?: boolean;
  variants?: EncodingAlgorithm[];
  value?: FieldValue
}

/**
 * Schema for a consent string
 */
export interface Schema {
  fields: SchemaField[];
}
