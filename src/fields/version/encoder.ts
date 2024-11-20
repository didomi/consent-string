import { BitSet } from "@/common/bit-set";
import { encodeU6 } from "@/fields/number/encoder";

/**
 * Encode a version to a 6-bit BitSet
 *
 * @param value version to encode
 * @returns encoded version
 */
export function encodeVersion(value: number): BitSet {
  return encodeU6(value);
}
