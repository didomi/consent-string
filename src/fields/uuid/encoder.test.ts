import { encodeUUID } from './encoder';

describe('encodeUUID', () => {
  it('encodes UUID correctly', () => {
    const uuid = '1875afe1-461b-6b9f-9d66-700174abbffc';
    expect(encodeUUID(uuid).toString()).toEqual(
      '00011000011101011010111111100001010001100001101101101011100111111001110101100110011100000000000101110100101010111011111111111100'
    );
  });
});
