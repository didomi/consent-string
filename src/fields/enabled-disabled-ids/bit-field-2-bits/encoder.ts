import { BitSet } from '@/common/bit-set';
import { IdsStatuses, STATUS_TO_BIT_SET } from '@/common/ids-statuses';
import { ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS } from '@/constants/encoding-algorithm';
import { encodeU16 } from '@/fields/number/encoder';

/**
 * Encode `IdsStatuses` to a `BitSet` with:
 *  - `StartFromOne` (1 bit) to indicate if the IDs start from 1 or from a higher minimum ID
 *  - `StartID` (16 bits) to indicate the minimum ID encoded, only if `StartFromOne` is false (otherwise it's assumed to be 1 by the decoder)
 *  - `NumberOfIDs` (16 bits) to indicate the number of IDs encoded
 *  - `Statuses` (2 bits per ID), the actual statuses of the IDs encoded, repeated for each ID in `NumberOfIDs`
 *
 * @param ids `IdsStatuses` to encode
 * @returns `BitSet` representation of `IdsStatuses`
 */
export function encodeBitField2Bits(ids: IdsStatuses): BitSet {
  const bitSet = new BitSet();

  if (ids.isEmpty) {
    return bitSet;
  }

  // Set `EncodingAlgorithm`
  bitSet.addBinaryString(ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS.bit_field_2_bits);

  let numberOfIDs;
  let startID;

  /**
   * When encoding the bitfield, we need to decide if the encoded IDs start from 1 or from a higher minimum ID
   *
   * If we start from 1, we do not need to encode `NumberOfIDs` in 16 bits
   * If we start from a higher minimum ID, we need to encode `NumberOfIDs` in 16 bits.
   *
   * We start from 1 if the minimum ID is less than 8 as encoding `NumberOfIDs` in that case would require 16 bits while encoding the values of the first 8 IDs would require only 16 bits so it's a bit more efficient to start from 1 until ID 8.
   */
  if (ids.minimumID < 8) {
    startID = 1;
    numberOfIDs = ids.maximumID; // Set `NumberOfIDs` to the maximum ID

    // Set `StartFromOne` to true
    bitSet.addBoolean(true);
  } else {
    startID = ids.minimumID;
    numberOfIDs = ids.maximumID - ids.minimumID + 1; // Set `NumberOfIDs` to the number of IDs in the range

    // Set `StartFromOne` to false
    bitSet.addBoolean(false);

    // Set `StartID` to the minimum ID
    bitSet.add(encodeU16(startID));
  }

  // Set `NumberOfIDs` to the number of IDs
  bitSet.add(encodeU16(numberOfIDs));

  // Encode the statuses of the IDs in `BitField`
  for (let id = startID; id <= ids.maximumID; id++) {
    const status = ids.getIdStatus(id);
    const binaryStringStatus = STATUS_TO_BIT_SET.get(status);

    if (!binaryStringStatus) {
      throw new Error(`Unknown status: ${status}`);
    }

    bitSet.addBinaryString(binaryStringStatus);
  }
  return bitSet;
}
