import { BitSet } from '@/common/bit-set';

/**
 * Encode a date to a BitSet
 *
 * @param field date to encode (Date object or timestamp string)
 * @returns encoded date
 * @throws Error if the provided date string is invalid
 */
export function encodeDate(field: Date | string): BitSet {
  // Convert input to Date object, handling numeric timestamp strings
  const dateObj =
    typeof field === 'string'
      ? /^\d+$/.test(field)
        ? new Date(parseInt(field, 10))
        : new Date(field)
      : field;

  // Validate the date
  if (isNaN(dateObj.getTime())) {
    throw new Error(
      `Invalid date: ${field}. Please provide a valid Date object or date string.`,
    );
  }

  const time = Math.round(dateObj.getTime() / 100);
  return new BitSet().fromBinaryString(time.toString(2).padStart(36, '0'));
}
