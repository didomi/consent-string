import { encodeDCS } from '@/encoder-dcs';
import { dcsV1Schema } from '@didomi/consent-string-schema/schemas';

interface Test {
  description: string;
  encoded: string;
  decoded: {
    user_id: string;
    created: string;
    updated: string;
    sync: string | null;
    vendors_optin: {
      enabled: number[];
      disabled: number[];
    };
    vendors_optout: {
      enabled: number[];
      disabled: number[];
    };
    purposes_optin: {
      enabled: number[];
      disabled: number[];
    };
    purposes_optout: {
      enabled: number[];
      disabled: number[];
    };
  };
}

describe('encoderDCS - v1 tests from schema', () => {
  const tests: Test[] = dcsV1Schema.tests;

  for (const test of tests) {
    it(test.description, () => {
      const consentString = encodeDCS(1, {
        userId: test.decoded.user_id,
        created: new Date(test.decoded.created),
        updated: new Date(test.decoded.updated),
        vendors: {
          optin: test.decoded.vendors_optin,
          optout: test.decoded.vendors_optout,
        },
        purposes: {
          optin: test.decoded.purposes_optin,
          optout: test.decoded.purposes_optout,
        },
        sync: test.decoded.sync ? new Date(test.decoded.sync) : null,
      });

      expect(consentString).toBe(test.encoded);
    });
  }
});
