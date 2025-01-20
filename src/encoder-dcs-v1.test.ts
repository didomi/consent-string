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
      regulationId: 10,
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
    // We need to use V2 where all encoding variants available to restrict it in the second call to `encodeDCS`.
    const consentStringWithoutVariantRestrictions = encodeDCS(2, userStatus);

    const encodingAlgorithmWithoutVariantRestrictions = new BitSet().fromBase64(consentStringWithoutVariantRestrictions)?.subSet(223, 2);

    // Confirm the encoding algorithm is Fibonacci (no restriction on variants yet)
    expect(encodingAlgorithmWithoutVariantRestrictions?.toString()).toBe(ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS.ranges_fibonacci);

    // Encode again with a restriction on the variants. We use V2 schema here to apply restriction and create V1 from V2 as V1 has only `BIT_FIELD_2_BITS` encoding for `purposes_optin`.
    const consentStringWithVariantRestrictions = encodeDCS(2, userStatus, {
      schemaOverrides: {
        fields: {
          purposes_optin: {
            variants: [EncodingAlgorithm.BIT_FIELD_2_BITS],
          },
        },
      },
    });

    const encodingAlgorithmWithVariantRestrictions = new BitSet().fromBase64(consentStringWithVariantRestrictions)?.subSet(223, 2);

    // Confirm the encoding algorithm is Bit Field 2 Bits
    expect(encodingAlgorithmWithVariantRestrictions?.toString()).toBe(ENABLED_DISABLED_IDS_ENCODING_ALGORITHMS.bit_field_2_bits);
  });
});
