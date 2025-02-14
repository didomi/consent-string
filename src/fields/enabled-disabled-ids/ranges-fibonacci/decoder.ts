import { BitSet } from '@/common/bit-set';
import type { DecoderResult } from '@/types/decoder-result';
import { ENCODED_STATUSES_MAP, IdsStatuses } from '@/common/ids-statuses';
import { IdsRanges } from '@/common/ids-ranges';
import { FibonacciNumber } from '@/common/fibonacci-number';
import { FibonacciNumberIdsRange } from '@/common/fibonacci-number-ids-range';
import { RangeConverters } from '@/common/range-converters';

/**
 * Decode Fibonacci ranges from BitSet for different statues
 *
 * The encoded BitSet must have the following structure
 *  — `encodedStatusesCodeword` (4 bits) defines what statuses (undefined, enabled, and disabled) and in
 *      what order encoded.
 *  — for each encoded status:
 *    - `numberOfRanges` (16 bits) Fibonacci ranges number encoded
 *    — for each Fibonacci range
 *      — `fibonacciRangeStart` — Fibonacci number (variable length) defines the start ID in the range
 *      — `fibonacciNumberIdsInRange` — Fibonacci number (variable length) defines IDs number in the range.
 *
 * @param  encoded - The bit field to be decoded.
 * @param  offset - The starting position in the bit field for decoding.
 * @returns  An object containing the decoded IDs categorized by their status and the number of bits processed.
 */
export const decodeRangesFibonacci = (
  encoded: BitSet,
  offset: number,
): DecoderResult<IdsStatuses> => {
  let position = offset;

  const statusesRanges: Array<IdsRanges> = [];

  const encodedStatusesCodeword = encoded.subSet(position, 4).toString();
  position += 4;

  const encodedStatuses = ENCODED_STATUSES_MAP.get(encodedStatusesCodeword);

  if (!encodedStatuses) {
    return {
      error: `Failed to decode Fibonacci ranges: wrong value for encoded statuses: ${encodedStatusesCodeword}`,
      decodedLength: 2,
    };
  }

  for (const status of encodedStatuses) {
    const idsRanges = new IdsRanges(status);
    const numberOfRanges = parseInt(encoded.subSet(position, 16).toString(), 2);
    position += 16;

    for (let rangeIndex = 0; rangeIndex < numberOfRanges; rangeIndex++) {
      const fibonacciRangeStart = new FibonacciNumber().fromBitSet(
        encoded,
        position,
      );
      position += fibonacciRangeStart.size;

      const fibonacciNumberIdsInRange = new FibonacciNumber().fromBitSet(
        encoded,
        position,
      );
      position += fibonacciNumberIdsInRange.size;

      const fibonacciRange = new FibonacciNumberIdsRange(
        fibonacciRangeStart,
        fibonacciNumberIdsInRange,
      );
      idsRanges.add(RangeConverters.toIdsRange(fibonacciRange));
    }
    statusesRanges.push(idsRanges);
  }

  return {
    value: IdsStatuses.fromRanges(statusesRanges),
    decodedLength: position - offset,
  };
};
