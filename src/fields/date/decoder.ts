import { BitSet } from '@/common/bit-set';
import type { DecoderResult } from '@/types/decoder-result';

/**
 * Decodes a date from a given BitSet starting at a specific offset.
 *
 * @param encoded - The BitSet containing the encoded consent string.
 * @param offset - The offset in the BitSet where the date information begins.
 * @returns An ISO string containing the decoded Date value, and the amount bits read from the encoded consent string.
 */
export const decodeDate = (encoded: BitSet, offset: number): DecoderResult<string> => {
  const date: Date = new Date();
  const time = parseInt(encoded.subSet(offset, 36).toString(), 2);

  date.setTime(time * 100);

  return {
    value: date.toISOString(),
    decodedLength: 36,
  };
}
