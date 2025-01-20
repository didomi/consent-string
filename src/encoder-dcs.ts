import { encode, SchemaOverrides } from '@/encoder';
import { Schema } from '@/types/schema.type';

import { dcsV1Schema } from '@didomi/consent-string-schema/schemas';
import { dcsV2Schema } from '@didomi/consent-string-schema/schemas';
import { UserStatusDCS, UserStatusDCSV1, UserStatusDCSV2 } from '@/types/user-status-dcs.type';

/**
 * Map of DCS versions to their schemas
 */
const DCS_SCHEMAS = {
  1: dcsV1Schema as Schema,
  2: dcsV2Schema as Schema,
};


/**
 * Options for encoding a DCS
 */
export type EncodeDCSOptions = {
  /**
   * Overrides applied to the schema
   */
  schemaOverrides?: SchemaOverrides;
}

/**
 * Overloads for encodeDCS
 */
export function encodeDCS(version: 1, userStatus: UserStatusDCSV1, options?: EncodeDCSOptions): string;
export function encodeDCS(version: 2, userStatus: UserStatusDCSV2, options?: EncodeDCSOptions): string;

/**
 * Encode a Didomi Consent String (DCS)
 *
 * @param version - The version of the DCS to use
 * @param userStatus - The user status to encode
 * @param options - Options for encoding the DCS
 *
 * @returns The encoded DCS
 */
export function encodeDCS(version: keyof typeof DCS_SCHEMAS, userStatus: UserStatusDCS, options?: EncodeDCSOptions): string {
  if (!(version in DCS_SCHEMAS)) {
    throw new Error(`Unsupported DCS version: ${version}`);
  }

  const schema = DCS_SCHEMAS[version as keyof typeof DCS_SCHEMAS];

  return encode({
    schema,
    userStatus: {
      version,
      user_id: userStatus.userId,
      created: userStatus.created,
      updated: userStatus.updated,
      vendors_optin: userStatus.vendors.optin,
      vendors_optout: userStatus.vendors.optout,
      purposes_optin: userStatus.purposes.optin,
      purposes_optout: userStatus.purposes.optout,
      sync: userStatus.sync,
      ...(version === 2 ? { regulation_id: (userStatus as UserStatusDCSV2).regulationId } : {}),
    },
    schemaOverrides: options?.schemaOverrides,
  });
}
