export const RESTRICTED_VERSION = 1;
export const DEFAULT_VERSION = 2;

export const CONSENT_STRING_SECTION_DIVIDER = '.';
export const CONSENT_STRING_SIGNATURE_DIVIDER = '~';
/**
 * We will encode Purposes and Vendors `id` between `MIN_ID` and `MAX_ID` : `MIN_ID < id < MAX_ID`
 *
 * The Purposes and Vendors IDs are started from `1`, so we set `MIN_ID` to `0`
 *
 */
export const MIN_ID = 0;
/**
 * We will encode Purposes and Vendors `id` between `MIN_ID` and `MAX_ID` : `MIN_ID < id < MAX_ID`
 *
 * For encoding some `id` we have reserve 16 bits, so maximum value that we could encode is `2 ** 16 - 1`
 *
 */
export const MAX_ID = 65536;
