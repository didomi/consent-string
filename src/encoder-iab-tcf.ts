import { GVL, PurposeRestrictionVector, Segment, TCModel, TCString } from '@iabtechlabtcf/core';
import { Timestamp } from "@/types/timestamp.type";

export interface UserStatusIABTCF {
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
   * Consent Language
   */
  consentLanguage: string;

  /**
   * TCF policy version
   */
  policyVersion: number;

  /**
   * Whether non-standard texts are used
   */
  useNonStandardTexts?: boolean;

  /**
   * Special features opted in
   */
  specialFeatureOptins: number[];

  /**
   * Whether purpose one disclosed under consent (`false`) or not disclosed at all (`true`)
   */
  purposeOneTreatment: boolean;

  /**
   * Enabled / disabled purposes for all data processing rules
   */
  purposes: {
    optin: number[];
    optout: number[];
  };

  /**
   * Enabled / disabled vendors for all data processing rules
   */
  vendors: {
    optin: number[];
    optout: number[];
  };

  publisher: {
    /**
     * Publisher restrictions
     */
    restrictions?: PurposeRestrictionVector;

    /**
     * Publisher ISO 3166-1 alpha-2 country code
     */
    countryCode: string;

    /**
     * Enabled / disabled TCF purposes for the publisher for all data processing rules
     */
    tcfPurposes?: {
      optin: number[];
      optout: number[];
    };

    /**
     * Enabled / disabled custom purposes for the publisher for all data processing rules
     */
    customPurposes?: {
      optin: number[];
      optout: number[];
    };
  };
}

/**
 * Encode user status to IAB TCF consent string
 *
 * @param gvl Global Vendor List
 * @param userStatus User status
 * @returns Consent string
 */
export function encodeIABTCF(gvl: GVL, userStatus: UserStatusIABTCF): string {
  const tcModel = new TCModel(gvl);

  const segments = [Segment.CORE];

  tcModel.vendorListVersion = gvl.vendorListVersion;
  tcModel.created = new Date(userStatus.created);
  tcModel.lastUpdated = new Date(userStatus.updated);
  tcModel.cmpId = userStatus.cmpId;
  tcModel.cmpVersion = userStatus.cmpVersion;
  tcModel.consentScreen = userStatus.consentScreen;
  tcModel.consentLanguage = userStatus.consentLanguage;
  tcModel.policyVersion = userStatus.policyVersion;
  tcModel.useNonStandardTexts = userStatus.useNonStandardTexts ?? false;
  tcModel.purposeOneTreatment = userStatus.purposeOneTreatment;

  // Special features
  userStatus.specialFeatureOptins.forEach(id => tcModel.specialFeatureOptins.set(id));

  // Purposes
  userStatus.purposes.optin.forEach(id => tcModel.purposeConsents.set(id));
  userStatus.purposes.optout.forEach(id => tcModel.purposeLegitimateInterests.set(id));

  // Vendors
  userStatus.vendors.optin.forEach(id => tcModel.vendorConsents.set(id));
  userStatus.vendors.optout.forEach(id => tcModel.vendorLegitimateInterests.set(id));

  // Publisher-specific fields in the core segment
  tcModel.publisherCountryCode = userStatus.publisher.countryCode;

  // TODO: Publisher restrictions

  // Publisher TC segment
  if (
    userStatus.publisher.tcfPurposes?.optin?.length ||
    userStatus.publisher.tcfPurposes?.optout?.length ||
    userStatus.publisher.customPurposes?.optin?.length ||
    userStatus.publisher.customPurposes?.optout?.length
  ) {
    // Add publisher TC segment
    segments.push(Segment.PUBLISHER_TC);

    // TCF purposes for publisher
    userStatus.publisher.tcfPurposes?.optin.forEach(id => tcModel.publisherConsents.set(id));
    userStatus.publisher.tcfPurposes?.optout.forEach(id => tcModel.publisherLegitimateInterests.set(id));

    // Custom purposes for publisher
    if (userStatus.publisher.customPurposes?.optin?.length || userStatus.publisher.customPurposes?.optout?.length) {
      userStatus.publisher.customPurposes?.optin.forEach(id => tcModel.publisherCustomConsents.set(id));
      userStatus.publisher.customPurposes?.optout.forEach(id => tcModel.publisherCustomLegitimateInterests.set(id));

      // Create custom purposes map
      tcModel.customPurposes = Array.from(
        new Set([
          ...(userStatus.publisher.customPurposes?.optin ?? []),
          ...(userStatus.publisher.customPurposes?.optout ?? [])
        ])
      ).reduce((acc, id: number) => {
        acc[id] = {};
        return acc;
      }, {} as Record<number, any>);
    }
  }

  return TCString.encode(tcModel, {
    version: 2,
    segments
  });
}

