import { encodeVersion } from '@/fields/version/encoder';

describe('encodeVersion', () => {
  it('should encode a version correctly', () => {
    expect(encodeVersion(1).toString()).toEqual('000001');
  });
});
