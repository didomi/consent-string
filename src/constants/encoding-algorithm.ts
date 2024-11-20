/**
 * Encoding algorithms for the `EncodingAlgorithm` field
 */
export enum EncodingAlgorithm {
  BIT_FIELD_2_BITS = 'bit_field_2_bits',
  RANGES_FIBONACCI = 'ranges_fibonacci',
  RANGES_U16 = 'ranges_u16',
}

/**
 * Map of encoding algorithms to their binary strings for the `EncodingAlgorithm` field
 */
export const ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS = {
  [EncodingAlgorithm.BIT_FIELD_2_BITS]: '00',
  [EncodingAlgorithm.RANGES_FIBONACCI]: '10',
  [EncodingAlgorithm.RANGES_U16]: '01',
}

