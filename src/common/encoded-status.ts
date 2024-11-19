import { ENCODED_STATUSES_REVERSE_MAP, STATUS_TO_BIT_SET } from '@/common/ids-statuses';
import { IdsRanges } from '@/common/ids-ranges';

/**
 * Get the binary string for the combined statuses of all ranges
 *
 * @param statusesRanges `IdsRanges` to encode
 * @returns Binary string for the combined statuses of all ranges
 */
export function getEncodedStatusBinaryString(statusesRanges: IdsRanges[]): string {
  // Convert the status of each range (enabled, disabled, etc.) to its associated bit string and join them
  // For instance, if we have ranges with statuses [enabled, disabled], the statusesForRanges will be '1001'
  const statuses = statusesRanges.map((range) => STATUS_TO_BIT_SET.get(range.status)).join('');

  // Get the bit string for the combined statuses of all ranges
  const encodedStatuses = ENCODED_STATUSES_REVERSE_MAP.get(statuses);

  if (!encodedStatuses) {
    throw new Error('Invalid statuses');
  }

  // Set `EncodedStatuses`
  return encodedStatuses;
}
