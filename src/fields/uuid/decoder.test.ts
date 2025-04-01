import { decodeUUID } from '@/fields/uuid/decoder';
import { BitSet } from '@/common/bit-set';

describe('decodeUUID', () => {
  it('decodes UUID correctly', () => {
    expect(decodeUUID(new BitSet().fromBinaryString(
      '1100' + // some padding
      '00011000011101011010111111100001010001100001101101101011100111111001110101100110011100000000000101110100101010111011111111111100'
    ),
      4
    )).toEqual({
      value: '1875afe1-461b-6b9f-9d66-700174abbffc',
      decodedLength: 128,
      usedEncoder: 'UUID',
    })
  });
});
