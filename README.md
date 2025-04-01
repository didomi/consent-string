# Consent String Encoding / Decoding

Consent strings store user consent status as binary data, encoded in base64.
Encoding user consent status into a binary string, or decoding it from an existing one, requires an encoder/decoder library.

The library supports number of consent string formats defined in `@didomi/consent-string-schema` library.

See consent string formats description [here](../consent-string-schema/README.md)

## Didomi Consent String

The Didomi Consent String format described in the following files:

- DCS v1 [didomi-consent-string-schema-v1.json](../consent-string-schema/src/schemas/didomi-consent-string/didomi-consent-string-schema-v1.json)
- DCS v2 [didomi-consent-string-schema-v2.json](../consent-string-schema/src/schemas/didomi-consent-string/didomi-consent-string-schema-v2.json)

### Encoding

We are using the library `encodeDCS` function to encode user status to DCS:

```typescript
import { encodeDCS } from '@didomi/consent-string';

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
```

The `encodeDCS` accepts the following parameters:

- `version` - The `number` version of the DCS to use
- `userStatus` - The user status `object` to encode
- `options` - Options `object` for encoding the DCS

where optional `options` object provides `SchemaOverrides` feature

```typescript
/**
 * Options for encoding a DCS
 */
export type EncodeDCSOptions = {
  /**
   * Overrides applied to the schema
   */
  schemaOverrides?: SchemaOverrides;
};
```

Using `SchemaOverrides` we can restrict the schema to use only selected encoding algorithms, for example:

```typescript
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

const consentStringWithVariantRestrictions = encodeDCS(2, userStatus, {
  schemaOverrides: {
    fields: {
      purposes_optin: {
        variants: [EncodingAlgorithm.BIT_FIELD_2_BITS],
      },
    },
  },
});
```

In this case `consentStringWithVariantRestrictions` should have BitField encoding used for `purposes_optin` and
produced result will be the same as for DCS v1 encoding.

There is `EncodingAlgorithm` supported options

```typescript
export enum EncodingAlgorithm {
  BIT_FIELD_2_BITS = 'bit_field_2_bits',
  RANGES_FIBONACCI = 'ranges_fibonacci',
  RANGES_U16 = 'ranges_u16',
}
```

### Decoding

To decode DCS string we need to use `decodeDCS` function

```typescript
import { decodeDCS } from '@didomi/consent-string';

const consentString =
  'BGHWv4UYba5-dZnABdKu__D6iWHsD6iWHsJ9iee2BAAilKiABFKVQAACIscAAAiLGAAA';
const expectedUserStatus = {
  user_id: '1875afe1-461b-6b9f-9d66-700174abbffc',
  created: '2023-04-12T18:10:00.000Z',
  updated: '2023-04-12T18:10:00.000Z',
  sync: '2023-05-24T18:10:00.000Z',
  vendors_optin: {
    enabled: [128, 129, 130, 131, 132],
    disabled: [],
  },
  purposes_optin: {
    enabled: [1, 2, 6, 7, 8],
    disabled: [3, 4],
  },
  vendors_optout: {
    enabled: [128, 129, 130, 131, 132],
    disabled: [],
  },
  purposes_optout: {
    enabled: [1, 2, 6, 7, 8],
    disabled: [3, 4],
  },
};
expect(decodeDCS(consentString)).toEqual(expectedUserStatus);
```

The `decodeDCS` accept the `consentString` as a parameter and returns user status object.
