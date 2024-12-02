import { encodeIABTCF } from "@/encoder-iab-tcf";
import { IABTCFPublisherRestriction } from "@/types/publisher-restrictions.type";
import { Timestamp } from "@/types/timestamp.type";
import { GVL } from "@iabtechlabtcf/core";
import { DidomiAPIID, IABTCFID, IABTCFPurposesIDMapping, IABTCFVendorsIDMapping } from "@/types/iab-tcf-id-mapping.type";

/**
 * User status for IAB TCF consent string with Didomi IDs for purposes and vendors
 */
export interface UserStatusIABTCFWithDidomiIDs {
  /**
   * Creation Date
   */
  created: Timestamp;

  /**
   * Update Date
   */
  updated: Timestamp;

  /**
   * CMP ID
   */
  cmpId: number;

  /**
   * CMP Version
   */
  cmpVersion: number;

  /**
   * Consent Screen
   */
  consentScreen: number;

  /**
   * Whether non-standard texts are used
   */
  useNonStandardTexts?: boolean;

  /**
   * Whether purpose one disclosed under consent (`false`) or not disclosed at all (`true`)
   */
  purposeOneTreatment: boolean;

  /**
   * Enabled purposes by data processing rule
   */
  purposes: {
    optin: DidomiAPIID[];
    optout: DidomiAPIID[];
  };

  /**
   * Enabled vendors by data processing rules
   */
  vendors: {
    optin: DidomiAPIID[];
    optout: DidomiAPIID[];
  };

  publisher: {
    /**
     * Publisher restrictions
     */
    restrictions?: IABTCFPublisherRestriction<DidomiAPIID, DidomiAPIID | IABTCFID>[];

    /**
     * Publisher ISO 3166-1 alpha-2 country code
     */
    countryCode: string;
  };
}

/**
 * Map an array of Didomi IDs to an array of IAB TCF IDs
 *
 * @param idsToMap - Array of IDs to map
 * @param idMapping - Mapping of Didomi IDs to IAB TCF IDs
 * @returns Array of IAB TCF IDs
 */
export function mapIds(idsToMap: (DidomiAPIID | IABTCFID)[] | undefined | null, idMapping: Record<DidomiAPIID, IABTCFID>): IABTCFID[] {
  if (!idsToMap || !Array.isArray(idsToMap) || idsToMap.length === 0) {
    return [];
  }

  return idsToMap.reduce<IABTCFID[]>((acc, id) => {
    if (id) {
      if (typeof id === "string") {
        // If the ID is a string, it's a Didomi ID so we map it to an IAB TCF ID
        const mappedId = idMapping[id];

        if (mappedId) {
          acc.push(mappedId);
        }
      } else if (typeof id === "number") {
        // If the ID is a number, it's an IAB TCF ID so we don't need to map it
        acc.push(id);
      }
    }

    return acc;
  }, []);
}

/**
 * Encode user status to IAB TCF consent string with Didomi IDs for purposes and vendors
 *
 * @param gvl - Global Vendor List
 * @param userStatus - User status with Didomi IDs for purposes and vendors
 * @param idMapping - Mapping of Didomi IDs to IAB TCF IDs
 * @returns IAB TCF consent string
 */
export function encodeIABTCFFromDidomiIDs(gvl: GVL, userStatus: UserStatusIABTCFWithDidomiIDs, purposesIDMapping: IABTCFPurposesIDMapping, vendorsIDMapping: IABTCFVendorsIDMapping): string {
  const userStatusIABTCF = {
    ...userStatus,
    purposes: {
      optin: mapIds(userStatus.purposes.optin, purposesIDMapping.purposes),
      optout: mapIds(userStatus.purposes.optout, purposesIDMapping.purposes),
    },
    vendors: {
      optin: mapIds(userStatus.vendors.optin, vendorsIDMapping),
      optout: mapIds(userStatus.vendors.optout, vendorsIDMapping),
    },
    specialFeatureOptins: mapIds(userStatus.purposes.optin, purposesIDMapping.specialFeatures),
    publisher: {
      ...userStatus.publisher,
      tcfPurposes: {
        optin: mapIds(userStatus.purposes.optin, purposesIDMapping.purposes),
        optout: mapIds(userStatus.purposes.optout, purposesIDMapping.purposes),
      },
      customPurposes: {
        optin: mapIds(userStatus.purposes.optin, purposesIDMapping.customPurposes),
        optout: mapIds(userStatus.purposes.optout, purposesIDMapping.customPurposes),
      },
      restrictions: userStatus.publisher.restrictions?.map((restriction) => ({
        ...restriction,
        purposeId: purposesIDMapping.purposes[restriction.purposeId],
        vendors: {
          ...restriction.vendors,
          ids: mapIds(restriction.vendors?.ids, vendorsIDMapping),
        },
      })),
    },
  };

  return encodeIABTCF(gvl, userStatusIABTCF);
}
