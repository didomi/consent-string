export type DecoderResult<T> = {
  value?: T,
  decodedLength?: number;
  error?: string;
};
