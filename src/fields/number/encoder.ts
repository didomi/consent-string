import { BitSet } from '@/common/bit-set';

/**
 * Encode a number to a BitSet
 *
 * @param value number to encode
 * @param bitLength bit length of the number
 * @param max maximum value of the number
 * @returns encoded number
 */
export function encodeNumber(value: number, bitLength: number, max: number): BitSet {
  if (value < 0 || value > max) {
    throw new Error(`Value must be between 0 and ${max}`);
  }

  return new BitSet().fromBinaryString(value.toString(2).padStart(bitLength, '0'));
}

/**
 * Encode a boolean to a 1-bit BitSet
 *
 * @param value boolean to encode
 * @returns encoded boolean
 */
export function encodeU1(value: boolean): BitSet {
  return new BitSet().fromBinaryString(value ? '1' : '0');
}

/**
 * Encode a number to a 16-bit BitSet
 *
 * @param value number to encode
 * @returns encoded number
 */
export function encodeU16(value: number): BitSet {
  return encodeNumber(value, 16, 65535);
}
