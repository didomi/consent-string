import { decodeDate } from './decoder';
import { BitSet } from '@/common/bit-set';

describe('decodeDate', () => {
  it('should decode date', () => {
    expect(decodeDate(new BitSet().fromBinaryString('11110011111010100010010110000111101100000000'), 4)).toEqual({
      value: '2023-04-12T18:10:00.000Z',
      decodedLength: 36,
      usedEncoder: 'date',
    })
  });
});
