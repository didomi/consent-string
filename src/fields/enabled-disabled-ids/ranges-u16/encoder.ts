import { BitSet } from '@/common/bit-set';
import { IdsStatuses } from '@/common/ids-statuses';
import { getEncodedStatusBinaryString } from '@/common/encoded-status';
import { encodeU1, encodeU16 } from '@/fields/number/encoder';

/**
 * Encode `IdsStatuses` to a `BitSet` using ranges of 16-bit unsigned integers
 *
 * We encode ranges as :
 *  - `EncodedStatuses` (4 bits) to indicate in which order the ranges are encoded (enabled then disabled, enabled then undefined, etc.)
 *
 * Repeated for each status in `EncodedStatuses`:
 *  - `NumberOfRanges` (16 bits) to indicate the number of ranges for the current status
 *
 * Repeated for each range in `NumberOfRanges`:
 *  - `SingleIdRange` (1 bit) to indicate if the range is a single ID range
 *  - `RangeStart` (16 bits) to indicate the start ID of the range
 *  - `RangeEnd` (16 bits) to indicate the end ID of the range, only if `SingleIdRange` is false
 *
 * @param ids `IdsStatuses` to encode
 * @returns `BitSet` representation of `IdsStatuses`
 */
export const encodeRangesU16 = (ids: IdsStatuses): BitSet => {
  const bitSet = new BitSet();
  const rangesByStatus = ids.getRanges();

  // Set `EncodingAlgorithm`
  bitSet.addBinaryString('01');

  // Set `EncodedStatuses`
  bitSet.addBinaryString(getEncodedStatusBinaryString(rangesByStatus));

  // Encode each status one after the other
  for (const statusRanges of rangesByStatus) {
    // Set `NumberOfRanges` to the number of ranges for the current status
    bitSet.add(encodeU16(statusRanges.numberOfRanges));

    // Encode each range for the current status
    for (const range of statusRanges.ranges) {
      // Set `SingleIdRange`
      bitSet.add(encodeU1(range.isSingleIdRange));

      // Set `RangeStart`
      bitSet.add(encodeU16(range.startId));

      if (!range.isSingleIdRange) {
        // Set `RangeEnd`
        bitSet.add(encodeU16(range.endId));
      }
    }
  }

  return bitSet;
};
