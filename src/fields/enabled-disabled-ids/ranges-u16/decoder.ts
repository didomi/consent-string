import { BitSet } from '@/common/bit-set';
import type { DecoderResult } from '@/types/decoder-result';
import { ENCODED_STATUSES_MAP, IdsStatuses } from '@/common/ids-statuses';
import { IdsRanges } from '@/common/ids-ranges';
import { IdsRange } from '@/common/ids-range';
import { decodeU16 } from '@/fields/number/decoder';

/**
 * Decodes U16 encoded ranges from a given BitSet starting at the specified offset.
 *
 * The encoded BitSet must have the following structure
 * — `encodedStatusesCodeword` (4 bits) defines what statuses (undefined, enabled, and disabled) and in
 *      what order encoded.
 *  — for each encoded status:
 *   — `numberOfRanges` (16 bits) U16 ranges number encoded.
 *   — for each U16 range:
 *      — `singleIdRange` (1bit) true if `range` has `rangeStart` only (single value).
 *      — `rangeStart` (16 bits) the first ID in the range of single value (ID) if `singleIdRange` true.
 *      — `rangeEnd` (16 bits) the last ID in the range.
 *
 * @param encoded - The BitSet containing the encoded data.
 * @param offset - The offset from where to start decoding in the BitSet.
 * @returns An object representing either the decoded IdsStatuses or an error message, along with the length of the decoded data.
 */
export const decodeRangesU16 = (encoded: BitSet, offset: number): DecoderResult<IdsStatuses> => {
  let position = offset;

  const statusesRanges: Array<IdsRanges> = [];

  const encodedStatusesCodeword = encoded.subSet(position, 4).toString();
  position += 4;

  const encodedStatuses = ENCODED_STATUSES_MAP.get(encodedStatusesCodeword);

  if (!encodedStatuses) {
    return {
      error: `Failed to decode U16 ranges: wrong value for encoded statuses: ${encodedStatusesCodeword}`,
      decodedLength: 2,
    }
  }

  for (const status of encodedStatuses) {
    const idsRanges = new IdsRanges(status);

    const { value: numberOfRanges } = decodeU16(encoded, position);
    position += 16;

    if (typeof numberOfRanges === 'undefined') {
      return {
        error: 'Failed to decode U16 ranges: wrong value for number of ranges',
        decodedLength: position - offset,
      }
    }

    for (let rangeIndex = 0; rangeIndex < numberOfRanges; rangeIndex++) {
      const singleIdRange = encoded.get(position++);

      const { value: rangeStart } = decodeU16(encoded, position);
      position+= 16;

      if (typeof rangeStart === 'undefined') {
        return {
          error: 'Failed to decode U16 ranges: wrong value for range start',
          decodedLength: position - offset,
        }
      }

      let rangeEnd = rangeStart;

      if (!singleIdRange) {
        const rangeEndDecodeResult = decodeU16(encoded, position);
        position+= 16;

        if (typeof rangeEndDecodeResult.value === 'undefined') {
          return {
            error: 'Failed to decode U16 ranges: wrong value for range end',
            decodedLength: position - offset,
          }
        } else {
          rangeEnd = rangeEndDecodeResult.value;
        }
      }

     idsRanges.add(new IdsRange(rangeStart, rangeEnd));

    }
    statusesRanges.push(idsRanges);
  }

  return {
    value: IdsStatuses.fromRanges(statusesRanges),
    decodedLength: position - offset,
    usedEncoder: 'rangesU16',
  }
}
