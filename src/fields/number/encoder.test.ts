import { encodeNumber, encodeU1, encodeU16, encodeU6 } from './encoder';

describe('Number encoders', () => {
  describe('encodeNumber', () => {
    it('should encode numbers correctly', () => {
      expect(encodeNumber(1025, 11, 2047).toString()).toEqual('10000000001');
      expect(encodeNumber(0, 8, 255).toString()).toEqual('00000000');
      expect(encodeNumber(255, 8, 255).toString()).toEqual('11111111');
    });

    it('should throw error for invalid values', () => {
      expect(() => encodeNumber(-1, 8, 255)).toThrow('Value must be between 0 and 255');
      expect(() => encodeNumber(256, 8, 255)).toThrow('Value must be between 0 and 255');
    });
  });

  describe('encodeU1', () => {
    it('should encode boolean values correctly', () => {
      expect(encodeU1(true).toString()).toEqual('1');
      expect(encodeU1(false).toString()).toEqual('0');
    });
  });

  describe('encodeU6', () => {
    it('should encode 6-bit numbers correctly', () => {
      expect(encodeU6(0).toString()).toEqual('000000');
      expect(encodeU6(63).toString()).toEqual('111111');
    });

    it('should throw error for invalid values', () => {
      expect(() => encodeU6(-1)).toThrow('Value must be between 0 and 63');
      expect(() => encodeU6(64)).toThrow('Value must be between 0 and 63');
    });
  });

  describe('encodeU16', () => {
    it('should encode 16-bit numbers correctly', () => {
      expect(encodeU16(0).toString()).toEqual('0000000000000000');
      expect(encodeU16(65535).toString()).toEqual('1111111111111111');
      expect(encodeU16(1025).toString()).toEqual('0000010000000001');
    });

    it('should throw error for invalid values', () => {
      expect(() => encodeU16(-1)).toThrow('Value must be between 0 and 65535');
      expect(() => encodeU16(65536)).toThrow('Value must be between 0 and 65535');
    });
  });
});
