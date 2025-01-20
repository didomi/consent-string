import { dcsV1Schema } from '@didomi/consent-string-schema/schemas';
import { decodeDCS } from '@/decoder-dcs';

describe('encoderDCS - v1 tests from schema', () => {
  const tests = dcsV1Schema.tests;

  for (const test of tests) {
    it(test.description, () => {
      const userStatus = decodeDCS(test.encoded);
      expect(userStatus).toEqual(test.decoded);
    });
  }
});
