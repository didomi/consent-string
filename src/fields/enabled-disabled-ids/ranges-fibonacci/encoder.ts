import { BitSet } from '@/common/bit-set';
import { IdsStatuses } from '@/common/ids-statuses';
import { getEncodedStatusBinaryString } from '@/common/encoded-status';
import { encodeU16 } from '@/fields/number/encoder';
import { ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS } from '@/constants/encoding-algorithm';

/**
 * Encode `IdsStatuses` to a `BitSet` using ranges of Fibonacci numbers
 *
 * We encode ranges as :
 *  - `EncodedStatuses` (4 bits) to indicate in which order the ranges are encoded (enabled then disabled, enabled then undefined, etc.)
 *
 * Repeated for each status in `EncodedStatuses`:
 *  - `NumberOfRanges` (16 bits) to indicate the number of ranges for the current status
 *
 * Repeated for each range in `NumberOfRanges`:
 *  - `FibonacciRangeStart` (2 to 23 bits) to indicate the start ID of the range
 *  - `FibonacciNumberIdsInRange` (2 to 23 bits) to indicate the number of IDs in the range
 *
 * See https://iabtechlab.com/wp-content/uploads/2022/06/global_privacy_platform_rfc_june_2022.pdf for more information on Fibonacci encoding.
 *
 * @param ids `IdsStatuses` to encode
 * @returns `BitSet` representation of `IdsStatuses`
 */
export function encodeRangesFibonacci(ids: IdsStatuses): BitSet {
  const bitSet = new BitSet();
  const rangesByStatus = ids.getRanges();

  // Set `EncodingAlgorithm`
  bitSet.addBinaryString(ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS.ranges_fibonacci);

  // Set `EncodedStatuses`
  bitSet.addBinaryString(getEncodedStatusBinaryString(rangesByStatus));

  // Encode each status one after the other
  for (const statusRanges of rangesByStatus) {
    // Set `NumberOfRanges` to the number of ranges for the current status
    bitSet.add(encodeU16(statusRanges.numberOfRanges));

    for (const range of statusRanges.ranges) {
      const fibonacciRange = range.toFibonacciNumberIdsRange();

      // Set `FibonacciRangeStart` as the first ID (encoded as a Fibonacci number) in the range
      bitSet.add(fibonacciRange.startId.codeword);

      // Set `FibonacciNumberIdsInRange` to the number of IDs (encoded as a Fibonacci number) in the range
      bitSet.add(fibonacciRange.numberOfIds.codeword);
    }
  }

  return bitSet;
}
