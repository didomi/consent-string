import { decodeVersion } from '@/fields/version/decoder';
import { BitSet } from '@/common/bit-set';

describe('decodeVersion', () => {
  it('should decode a version', () => {
    expect(decodeVersion(new BitSet().fromBinaryString('000001'), 0)).toEqual({
      value: 1,
      decodedLength: 6,
    });
  });
});
