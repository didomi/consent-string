import { BitSet } from '@/common/bit-set';
import type { DecoderResult } from '@/types/decoder-result';
import { UUID } from '@/types/uuid.type';

/**
 * Decodes a UUID from a given BitSet starting at a specified offset.
 *
 * @param encoded - The BitSet containing the encoded UUID.
 * @param offset - The starting position in the BitSet from where decoding begins.
 * @returns An object containing the decoded UUID value and the length of the decoded information.
 */
export const decodeUUID= (encoded: BitSet, offset: number): DecoderResult<UUID> => ({
  value: encoded.subSet(offset, 128).toUUID(),
  decodedLength: 128,
});
