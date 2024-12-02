import { BitSet } from '@/common/bit-set';
import type { DecoderResult } from '@/types/decoder-result';
import { BIT_SET_TO_STATUS, IdsStatuses, Status } from '@/common/ids-statuses';

/**
 * Decodes a bit field representing a 2-bit encoded status for multiple IDs.
 *
 * The function interprets a bit field as a sequence of 2-bit values, where each 2-bit value
 *  denotes the status of a corresponding ID:
 *    - undefined — '00';
 *    - disabled — '01';
 *    - enabled — '10'.
 * The IDs assigned sequentially starting from 1 or from `StartID`.
 *
 * The `encoded` BitSet must have the following format:
 *  — `startFromOne`(1bit) 0 — then we have optional `startID`, if 1 then `numberOfIds` coming next;
 *  — `startID` (16 bits) if `startFromOne` 0 then this is the start id;
 *  — `numberOfIDs` (16 bits) number of ids encoded;
 *  — `statuses` (`numberOfIDs` * 2) encoded statuses for each id.
 *
 * @param  encoded - The bit field to be decoded.
 * @param  offset - The starting position in the bit field for decoding.
 * @returns  An object containing the decoded IDs categorized by their status and the number of bits processed.
 */

export const decodeBitField2Bits = (encoded: BitSet, offset: number): DecoderResult<IdsStatuses> => {
  let position = offset;
  let id = 1;

  const enabled = new Array<number>();
  const disabled = new Array<number>();

  const startFromOne = encoded.get(position++);

  if (!startFromOne) {
    id = parseInt(encoded.subSet(position, 16).toString(), 2);
    position+= 16;
  }

  const numberOfIds = parseInt(encoded.subSet(position, 16).toString(), 2);
  position+= 16;

  let numberOfDecodedIds = 0;

  while (numberOfDecodedIds < numberOfIds) {
    const encodedStatus = encoded
      .subSet(position, 2)
      .toString();
    const status = BIT_SET_TO_STATUS.get(encodedStatus);

    if (status === Status.Disabled) {
      disabled.push(id);
    } else if (status == Status.Enabled) {
      enabled.push(id);
    }

    id++;
    position += 2;
    numberOfDecodedIds++;
  }

  return {
    value: new IdsStatuses(enabled, disabled),
    decodedLength: position - offset,
  };
}
