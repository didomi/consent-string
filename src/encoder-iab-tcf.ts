import { GVL, PurposeRestriction, RestrictionType, Segment, TCModel, TCString } from '@iabtechlabtcf/core';
import { Timestamp } from "@/types/timestamp.type";
import { IABTCFPublisherRestriction, IABTCFPublisherRestrictionType, IABTCFPublisherRestrictionVendorsType } from '@/types/publisher-restrictions.type';
import { IABTCFID } from '@/types/iab-tcf-id-mapping.type';

/**
 * User status for IAB TCF consent string
 */
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
   * Whether non-standard texts are used
   */
  useNonStandardTexts?: boolean;

  /**
   * Special features opted in
   */
  specialFeatureOptins: IABTCFID[];

  /**
   * Whether purpose one disclosed under consent (`false`) or not disclosed at all (`true`)
   */
  purposeOneTreatment: boolean;

  /**
   * Enabled purposes by data processing rule
   */
  purposes: {
    optin: IABTCFID[];
    optout: IABTCFID[];
  };

  /**
   * Enabled vendors by data processing rule
   */
  vendors: {
    optin: IABTCFID[];
    optout: IABTCFID[];
  };

  publisher: {
    /**
     * Publisher restrictions
     */
    restrictions?: IABTCFPublisherRestriction[];

    /**
     * Publisher ISO 3166-1 alpha-2 country code
     */
    countryCode: string;

    /**
     * Enabled TCF purposes for the publisher by data processing rule
     */
    tcfPurposes?: {
      optin: IABTCFID[];
      optout: IABTCFID[];
    };

    /**
     * Enabled custom purposes for the publisher by data processing rule
     */
    customPurposes?: {
      optin: IABTCFID[];
      optout: IABTCFID[];
    };
  };
}

/**
 * Encode user status to IAB TCF consent string
 *
 * `consentLanguage` and `policyVersion` are taken from the GVL and cannot be overriden on the `TCModel`.
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
  tcModel.useNonStandardTexts = userStatus.useNonStandardTexts ?? false;
  tcModel.purposeOneTreatment = userStatus.purposeOneTreatment;

  // `isServiceSpecific` must be set to `true` for all TC strings (https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md#tcdata)
  tcModel.isServiceSpecific = true;

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

  // Publisher restrictions
  userStatus.publisher.restrictions?.forEach(restriction => {
    const purposeRestriction = new PurposeRestriction();

    purposeRestriction.purposeId = restriction.purposeId;

    if (restriction.restrictionType === IABTCFPublisherRestrictionType.ALLOW) {
      // "ALLOW" does not exist in the TCF that only supports "DISALLOW" so we make it work by disallowing vendors that are not allowed
      purposeRestriction.restrictionType = RestrictionType.NOT_ALLOWED;

      if (restriction.vendors.type === IABTCFPublisherRestrictionVendorsType.LIST) {
        // Add a purpose restriction for each vendor that is in the GVL but not in the list of allowed vendors
        Object.keys(gvl.vendors).forEach(vendorId => {
          if (!restriction.vendors.ids?.includes(parseInt(vendorId))) {
            tcModel.publisherRestrictions.add(parseInt(vendorId), purposeRestriction);
          }
        });
      }
    } else {
      switch (restriction.restrictionType) {
        case IABTCFPublisherRestrictionType.DISALLOW:
          purposeRestriction.restrictionType = RestrictionType.NOT_ALLOWED;
          break;

        case IABTCFPublisherRestrictionType.REQ_CONSENT:
          purposeRestriction.restrictionType = RestrictionType.REQUIRE_CONSENT;
          break;

        case IABTCFPublisherRestrictionType.REQ_LI:
          purposeRestriction.restrictionType = RestrictionType.REQUIRE_LI;
          break;
      }

      if (restriction.vendors.type === IABTCFPublisherRestrictionVendorsType.LIST) {
        // Add a purpose restriction for each vendor in the list
        restriction.vendors.ids?.forEach(id => tcModel.publisherRestrictions.add(id, purposeRestriction));
      } else if (restriction.vendors.type === IABTCFPublisherRestrictionVendorsType.ALL) {
        // Add a purpose restriction for all vendors
        tcModel.publisherRestrictions.restrictPurposeToLegalBasis(purposeRestriction);
      }
    }
  });

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

