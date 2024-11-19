import {
  BASE64_BIT_FIELD_TO_NUMBER,
  BASE64_NUMBER_TO_BIT_FIELD,
  BASE64_DICT,
  BASE64_REVERSE_DICT,
} from './base64';

describe('Base64 BitField to number and number to BitField', () => {
  it('should be generated correctly', () => {
    for (let i = 0; i < 64; i++) {
      const base64BitField = BASE64_NUMBER_TO_BIT_FIELD.get(i);
      /* eslint-disable  @typescript-eslint/no-non-null-assertion */
      const base64Index = BASE64_BIT_FIELD_TO_NUMBER.get(base64BitField!);
      /* eslint-disable  @typescript-eslint/no-non-null-assertion */
      expect(parseInt(base64BitField!, 2)).toEqual(i);
      expect(base64Index).toEqual(i);
    }
  });
});

describe('Base64 dictionary and reverse dictionary', () => {
  it('should be generated correctly', () => {
    for (let i = 0; i < 64; i++) {
      const base64Character = BASE64_DICT[i];
      const base64Index = BASE64_REVERSE_DICT.get(base64Character);
      expect(base64Index).toEqual(i);
    }
  });
});
