import { BitSet } from '@/common/bit-set';
import { ConsentStringType } from '@/types/consent-string.type';
import { UserStatus } from '@/types/user-status.type';
import { encodeField } from '@/fields/encoder';
import { schemas } from '@/schemas';

/**
 * Options for encoding a consent string
 */
export interface EncodingOptions {
  /**
   * The type of consent string to encode
   */
  type: ConsentStringType;

  /**
   * The user status
   */
  userStatus: UserStatus;
}

/**
 * Encode a consent string
 */
export function encode({
  type,
  userStatus,
}: EncodingOptions): string {
  if (!type || !userStatus) {
    throw new Error('Missing required options');
  }

  const schema = schemas[type];

  if (!schema) {
    throw new Error(`Unsupported consent string type: ${type}`);
  }

  const bitSet = new BitSet();

  for (const field of schema.fields) {
    const fieldValue = userStatus[field.key as keyof UserStatus];

    bitSet.add(encodeField(field, fieldValue));
  }

  return bitSet.toBase64();
}
