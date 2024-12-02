/**
 * Didomi numeric ID for purposes and vendors
 *
 * Numeric IDs are used to encode purposes and vendors in a DCS which is a binary format that requires numeric IDs.
 */
export type DidomiAPINumericID = number;

/**
 * Purposes or vendors enabled and disabled
 */
export type PurposesVendors = {
  enabled: DidomiAPINumericID[];
  disabled: DidomiAPINumericID[];
};
