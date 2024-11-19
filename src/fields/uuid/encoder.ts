import { BitSet } from '@/common/bit-set';
import { UUID } from '@/types/uuid.type';

/**
 * Encode a UUID to a BitSet
 *
 * @param field UUID to encode
 * @returns encoded UUID
 */
export function encodeUUID(field: UUID): BitSet {
  return new BitSet().fromUUID(field);
}
