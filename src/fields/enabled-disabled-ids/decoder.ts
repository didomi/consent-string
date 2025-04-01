import { BitSet } from '@/common/bit-set';
import type { DecoderResult } from '@/types/decoder-result';
import { IdsStatuses } from '@/common/ids-statuses';
import { PurposesVendors } from '@/types/purposes-vendors.type';
import {
  EncodingAlgorithm,
  EncodingAlgorithmCodeword,
  REVERSE_ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS,
} from '@/constants/encoding-algorithm';
import { decodeRangesU16 } from '@/fields/enabled-disabled-ids/ranges-u16/decoder';
import { decodeRangesFibonacci } from '@/fields/enabled-disabled-ids/ranges-fibonacci/decoder';
import { decodeBitField2Bits } from '@/fields/enabled-disabled-ids/bit-field-2-bits/decoder';


/**
 * Map of variants to their decoders
 */
export const ENABLED_DISABLED_IDS_VARIANTS = {
  [EncodingAlgorithm.RANGES_U16]: decodeRangesU16,
  [EncodingAlgorithm.RANGES_FIBONACCI]: decodeRangesFibonacci,
  [EncodingAlgorithm.BIT_FIELD_2_BITS]: decodeBitField2Bits
}

/**
 * Decodes a BitSet containing enabled/disabled IDs for purposes and vendors.
 *
 * The encoded BitSet must have the following structure
 *  — `encodedAlgorithmCodeword` (2 bits) defines an algorithm that used to encode.
 *  — encoded IDs using (BitField 2 bits, Fibonacci or U16 ranges)
 *
 * @param encoded - The BitSet containing the encoded IDs to decode.
 * @param offset - The starting position within the BitSet to begin decoding.
 * @returns The decoded result containing the enabled and disabled IDs for purposes and vendors, or an error message
 *    if the decoding process fails.
 */
export const decodeEnabledDisabledIDs = (encoded: BitSet, offset: number): DecoderResult<PurposesVendors> => {
  let position = offset;

  const encodedAlgorithmCodeword = encoded.subSet(position, 2).toString() as EncodingAlgorithmCodeword;
  position += 2;

  const encodedAlgorithm = REVERSE_ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS[encodedAlgorithmCodeword];
  const decoder = ENABLED_DISABLED_IDS_VARIANTS[encodedAlgorithm];

  if (!decoder) {
    return {
      error: `Failed to decode Enabled Disabled Ids with error: Invalid encoded Algorithm: ${encodedAlgorithmCodeword}`,
      decodedLength: 2,
    }
  }
  const result = decoder(encoded, position) as DecoderResult<IdsStatuses>;
  const usedEncoder = result.usedEncoder ?? 'unknown';

  const idsStatuses = result.value;
  const decodedLength =  (result.decodedLength ?? 0) + 2;

  if (result.error || !idsStatuses) {
    return {
      error: result.error,
      decodedLength,
      usedEncoder
    }
  }

  return {
    value: {
      enabled: idsStatuses.enabled,
      disabled: idsStatuses.disabled,
    },
    decodedLength,
    usedEncoder
  }
}
