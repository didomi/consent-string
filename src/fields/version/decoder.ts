import { BitSet } from '@/common/bit-set';
import type { DecoderResult } from '@/types/decoder-result';
import { decodeU6 } from '@/fields/number/decoder';

/**
 * Decodes a version number from the given BitSet starting at the specified offset.
 *
 * @param encoded - An instance of BitSet from which the version number is decoded.
 * @param offset - The bit offset at which to begin decoding.
 * @returns The decoded version number and the updated offset.
 */
export const decodeVersion = (encoded: BitSet, offset: number): DecoderResult<number> => decodeU6(encoded, offset);
