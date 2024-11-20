import { BitSet } from '@/common/bit-set';

/**
 * Encode a date to a BitSet
 *
 * @param field date to encode
 * @returns encoded date
 */
export function encodeDate(field: Date): BitSet {
  const time = Math.round(field.getTime() / 100);
  return new BitSet().fromBinaryString(time.toString(2).padStart(36, '0'));
}
