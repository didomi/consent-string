import { encodeDCS } from '@/encoder-dcs';
import { BitSet } from './common/bit-set';
import { ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS, EncodingAlgorithm } from '@/constants/encoding-algorithm';

describe('encodeDCS - v1', () => {
  it('should encode an empty user status', () => {
    const consentString = encodeDCS(1, {
      userId: 'd113bb93-7aa3-4684-ab31-aa9ae45470cb',
      created: new Date('2024-01-01'),
      updated: new Date('2024-01-01'),
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
      sync: null,
    });

    expect(consentString).toBeDefined();
  });

  it('should encode a user status with schema overrides', () => {
    const userStatus = {
      userId: 'd113bb93-7aa3-4684-ab31-aa9ae45470cb',
      created: new Date('2024-01-01'),
      updated: new Date('2024-01-01'),
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
    };

    const consentStringWithoutVariantRestrictions = encodeDCS(1, userStatus);

    // TODO: To replace with decoder when available (reading from specific bits is not very maintainable)
    const encodingAlgorithmWithoutVariantRestrictions = new BitSet().fromBase64(consentStringWithoutVariantRestrictions)?.subSet(206, 2);

    // Confirm the encoding algorithm is Fibonacci (no restriction on variants yet)
    expect(encodingAlgorithmWithoutVariantRestrictions?.toString()).toBe(ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS.ranges_u16);

    // Encode again with a restriction on the variants
    const consentStringWithVariantRestrictions = encodeDCS(1, userStatus, {
      schemaOverrides: {
        fields: {
          purposes_optin: {
            variants: [EncodingAlgorithm.BIT_FIELD_2_BITS],
          },
        },
      },
    });

    // TODO: To replace with decoder when available (reading from specific bits is not very maintainable)
    const encodingAlgorithmWithVariantRestrictions = new BitSet().fromBase64(consentStringWithVariantRestrictions)?.subSet(206, 2);

    // Confirm the encoding algorithm is Bit Field 2 Bits
    expect(encodingAlgorithmWithVariantRestrictions?.toString()).toBe(ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS.bit_field_2_bits);
  });
});
