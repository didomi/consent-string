import { decodeU1, decodeU16, decodeU6 } from '@/fields/number/decoder';
import { BitSet } from '@/common/bit-set';

describe('decode numbers', () => {
  describe('decodeU1', () => {
    it('should correctly decode 1 bit number', () => {
      expect(decodeU1(new BitSet().fromBinaryString(
        '111' + // some padding
        '1' // 1 for true
        ),
        3
      )).toEqual({
        value: true,
        decodedLength: 1,
        usedEncoder: 'u1',
      })
      expect(decodeU1(new BitSet().fromBinaryString(
          '0' // 0 for false
        ),
        0
      )).toEqual({
        value: false,
        decodedLength: 1,
        usedEncoder: 'u1',
      })
    });
  });
  describe('decodeU6', () => {
    it('should correctly decode 6 bits number', () => {
      expect(decodeU6(new BitSet().fromBinaryString(
          '111' + // some padding
          '000111' // 7
        ),
        3
      )).toEqual({
        value: 7,
        decodedLength: 6,
        usedEncoder: 'u6',
      })
      expect(decodeU6(new BitSet().fromBinaryString(
          '11111111111111' // 63
        ),
        0
      )).toEqual({
        value: 63,
        decodedLength: 6,
        usedEncoder: 'u6',
      })
    });
  });
  describe('decodeU16', () => {
    it('should correctly decode 6 bits number', () => {
      expect(decodeU16(new BitSet().fromBinaryString(
          '111' + // some padding
          '0000000000000111' // 7
        ),
        3
      )).toEqual({
        value: 7,
        decodedLength: 16,
        usedEncoder: 'u16',
      })
      expect(decodeU16(new BitSet().fromBinaryString(
          '1111111111111111' // 63
        ),
        0
      )).toEqual({
        value: 65535,
        decodedLength: 16,
        usedEncoder: 'u16',
      })
    });
  });
});
