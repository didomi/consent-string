import { encodeDate } from './encoder';

describe('encodeDate', () => {
  it('should encode date correctly', () => {
    const date = new Date('2023-04-12T18:10:00.000Z');
    expect(encodeDate(date).toString()).toEqual('001111101010001001011000011110110000');
  });
});
