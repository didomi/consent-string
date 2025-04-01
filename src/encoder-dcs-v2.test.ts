import { encodeDCS } from '@/encoder-dcs';
import { BitSet } from './common/bit-set';
import {
  ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS,
  EncodingAlgorithm,
} from '@/constants/encoding-algorithm';

describe('encodeDCS - v2', () => {
  it('should encode an empty user status', () => {
    const consentString = encodeDCS(2, {
      userId: 'd113bb93-7aa3-4684-ab31-aa9ae45470cb',
      created: '2024-01-01T00:00:00.000Z',
      updated: '2024-01-01T00:00:00.000Z',
      purposes: {
        optin: {
          enabled: [],
          disabled: [],
        },
        optout: {
          enabled: [],
          disabled: [],
        },
      },
      vendors: {
        optin: {
          enabled: [],
          disabled: [],
        },
        optout: {
          enabled: [],
          disabled: [],
        },
      },
      sync: null,
      regulationId: 1,
    });

    expect(consentString).toEqual(
      'C0RO7k3qjRoSrMaqa5FRwyz97QFAD97QFAAABEAACAABAAAgAAAA',
    );
  });

  it('should encode with various date string formats', () => {
    const consentString = encodeDCS(2, {
      userId: 'd113bb93-7aa3-4684-ab31-aa9ae45470cb',
      created: '2024-01-15', // Date only format (no time)
      updated: '2024/02/20 15:30:45', // Another valid date format
      purposes: {
        optin: {
          enabled: [],
          disabled: [],
        },
        optout: {
          enabled: [],
          disabled: [],
        },
      },
      vendors: {
        optin: {
          enabled: [],
          disabled: [],
        },
        optout: {
          enabled: [],
          disabled: [],
        },
      },
      sync: '1672531200000', // Unix timestamp as string
      regulationId: 1,
    });

    expect(consentString).toBeDefined();
  });

  it('should encode a user status with schema overrides', () => {
    const userStatus = {
      userId: 'd113bb93-7aa3-4684-ab31-aa9ae45470cb',
      created: '2024-01-01T00:00:00.000Z',
      updated: '2024-01-01T00:00:00.000Z',
      purposes: {
        optin: {
          enabled: [1, 100],
          disabled: [],
        },
        optout: {
          enabled: [],
          disabled: [],
        },
      },
      vendors: {
        optin: {
          enabled: [],
          disabled: [],
        },
        optout: {
          enabled: [],
          disabled: [],
        },
      },
      sync: null,
      regulationId: 1,
    };

    const consentStringWithoutVariantRestrictions = encodeDCS(2, userStatus);

    // TODO: To replace with decoder when available (reading from specific bits is not very maintainable)
    const encodingAlgorithmWithoutVariantRestrictions = new BitSet()
      .fromBase64(consentStringWithoutVariantRestrictions)
      ?.subSet(222, 2);

    // Confirm the encoding algorithm is Fibonacci (no restriction on variants yet)
    expect(encodingAlgorithmWithoutVariantRestrictions?.toString()).toBe(
      ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS.ranges_u16,
    );

    // Encode again with a restriction on the variants
    const consentStringWithVariantRestrictions = encodeDCS(2, userStatus, {
      schemaOverrides: {
        fields: {
          purposes_optin: {
            variants: [EncodingAlgorithm.BIT_FIELD_2_BITS],
          },
        },
      },
    });

    // TODO: To replace with decoder when available (reading from specific bits is not very maintainable)
    const encodingAlgorithmWithVariantRestrictions = new BitSet()
      .fromBase64(consentStringWithVariantRestrictions)
      ?.subSet(222, 2);

    // Confirm the encoding algorithm is Bit Field 2 Bits
    expect(encodingAlgorithmWithVariantRestrictions?.toString()).toBe(
      ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS.bit_field_2_bits,
    );
  });
});
