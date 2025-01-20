import { dcsV2Schema } from '@didomi/consent-string-schema/schemas';
import { decodeDCS } from '@/decoder-dcs';

describe('encoderDCS - v2 tests from schema', () => {
  const tests = dcsV2Schema.tests;

  for (const test of tests) {
    it(test.description, () => {
      const userStatus = decodeDCS(test.encoded);
      expect(userStatus).toEqual(test.decoded);
    });
  }
});
