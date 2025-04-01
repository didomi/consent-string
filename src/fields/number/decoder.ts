import { BitSet } from '@/common/bit-set';
import type { DecoderResult } from '@/types/decoder-result';

/**
 * Decodes a single unsigned bit (U1) from a given BitSet starting at a specified offset.
 *
 * @param encoded - The BitSet from which to decode the U1 value.
 * @param offset - The position within the BitSet where the U1 value starts.
 * @returns  An object containing the decoded boolean value and the length of bits that were decoded.
 */
export const decodeU1= (encoded: BitSet, offset: number): DecoderResult<boolean> => ({
    value: encoded.get(offset),
    decodedLength: 1,
    usedEncoder: 'u1',
});

/**
 * Decodes a 6-bit unsigned integer from a given BitSet starting at the specified offset.
 *
 * @param encoded - The BitSet containing the encoded data.
 * @param offset - The offset position in the BitSet to start decoding from.
 * @returns An object containing the decoded value and the length of the decoded segment.
 */
export const decodeU6= (encoded: BitSet, offset: number): DecoderResult<number> => ({
  value: parseInt(encoded.subSet(offset, 6).toString(), 2),
  decodedLength: 6,
  usedEncoder: 'u6',
});

/**
 * Decodes a 16-bit unsigned integer from a BitSet starting at a given offset.
 *
 * @param encoded - The BitSet containing the encoded data.
 * @param  offset - The position in the BitSet to start decoding from.
 * @returns An object containing the decoded number and the length of the decoded part.
 */
export const decodeU16= (encoded: BitSet, offset: number): DecoderResult<number> => ({
  value: parseInt(encoded.subSet(offset, 16).toString(), 2),
  decodedLength: 16,
  usedEncoder: 'u16',
});
