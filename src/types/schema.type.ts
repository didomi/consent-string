import type { FieldType } from '@/fields/encoder';

/**
 * A field in a consent string schema
 */
export interface SchemaField {
  key: string;
  type: FieldType;
  optional?: boolean;
  variants?: FieldType[];
}

/**
 * Schema for a consent string
 */
export interface Schema {
  fields: SchemaField[];
}
