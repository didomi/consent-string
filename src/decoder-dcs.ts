import { dcsV1Schema } from '@didomi/consent-string-schema/schemas';
import { dcsV2Schema } from '@didomi/consent-string-schema/schemas';
import { Schema } from '@/types/schema.type';
import { UserStatusDCS } from '@/types/user-status-dcs.type';
import { decode } from '@/decoder';

/**
 * Map of DCS versions to their schemas
 */
export type DCSVersionCodeword = 'B' | 'C';
const DCS_SCHEMAS: Record<DCSVersionCodeword, Schema> = {
  'B': dcsV1Schema as Schema,
  'C': dcsV2Schema as Schema,
};

/**
 * Didomi Consent String decoder.
 *
 * @param consentString - The consent string to be decoded.
 * @return The decoded user status information from the consent string.
 * @throws {Error} If the DCS version is unsupported.
 */
export function decodeDCS(consentString: string): UserStatusDCS {
  const versionCodeword = consentString[0] as DCSVersionCodeword;
  const schema = DCS_SCHEMAS[versionCodeword];
  if (!schema) {
    throw new Error(`Unsupported DCS version: ${versionCodeword}`);
  }
  return decode({
    schema,
    consentString,
  }) as unknown as UserStatusDCS;
}

