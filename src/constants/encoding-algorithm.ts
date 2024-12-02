/**
 * Encoding algorithms for the `EncodingAlgorithm` field
 */
export enum EncodingAlgorithm {
  BIT_FIELD_2_BITS = 'bit_field_2_bits',
  RANGES_FIBONACCI = 'ranges_fibonacci',
  RANGES_U16 = 'ranges_u16',
}

export enum EncodingAlgorithmCodeword {
  BIT_FIELD_2_BITS = '00',
  RANGES_FIBONACCI = '10',
  RANGES_U16 = '01',
}

/**
 * Map of encoding algorithms to their binary strings for the `EncodingAlgorithm` field
 */
export const ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS: Record<EncodingAlgorithm, EncodingAlgorithmCodeword> = {
  [EncodingAlgorithm.BIT_FIELD_2_BITS]: EncodingAlgorithmCodeword.BIT_FIELD_2_BITS,
  [EncodingAlgorithm.RANGES_FIBONACCI]: EncodingAlgorithmCodeword.RANGES_FIBONACCI,
  [EncodingAlgorithm.RANGES_U16]: EncodingAlgorithmCodeword.RANGES_U16,
}

export const REVERSE_ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS: Record<EncodingAlgorithmCodeword, EncodingAlgorithm> = {
  [EncodingAlgorithmCodeword.BIT_FIELD_2_BITS]: EncodingAlgorithm.BIT_FIELD_2_BITS,
  [EncodingAlgorithmCodeword.RANGES_FIBONACCI]: EncodingAlgorithm.RANGES_FIBONACCI,
  [EncodingAlgorithmCodeword.RANGES_U16]: EncodingAlgorithm.RANGES_U16,
}

