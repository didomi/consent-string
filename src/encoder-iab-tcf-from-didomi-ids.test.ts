import { GVL, PurposeRestriction, RestrictionType, TCString, VersionOrVendorList } from '@iabtechlabtcf/core';
import { encodeIABTCFFromDidomiIDs } from './encoder-iab-tcf-from-didomi-ids';
import gvlJson from './gvl.json';
import { IABTCFPublisherRestrictionType } from '@/types/publisher-restrictions.type';
import { IABTCFPublisherRestrictionVendorsType } from '@/types/publisher-restrictions.type';

const gvl = new GVL(gvlJson as unknown as VersionOrVendorList);

describe('encodeIABTCFFromDidomiIDs', () => {
  const purposesIDMapping = {
    purposes: {
      'marketing': 1,
      'analytics': 2,
      'content-delivery': 3,
    },
    specialFeatures: {
      'precise-geolocation': 1,
      'device-fingerprinting': 2,
    },
    customPurposes: {
      'custom-marketing': 4,
      'custom-analytics': 5,
    },
  };

  const vendorsIDMapping = {
    'google': 1,
    'facebook': 2,
    'criteo': 8,
  };

  it('should map Didomi IDs to IAB TCF IDs and encode to consent string', () => {
    const userStatus = {
      created: '2024-01-01T00:00:00.000Z',
      updated: '2024-01-01T00:00:00.000Z',
      cmpId: 7,
      cmpVersion: 1,
      consentScreen: 1,
      useNonStandardTexts: false,
      purposeOneTreatment: false,
      purposes: {
        optin: ['marketing', 'analytics', 'content-delivery'],
        optout: ['analytics'],
      },
      vendors: {
        optin: ['google', 'facebook'],
        optout: ['criteo'],
      },
      publisher: {
        countryCode: 'FR',
      }
    };

    const consentString = encodeIABTCFFromDidomiIDs(gvl, userStatus, purposesIDMapping, vendorsIDMapping);
    const tcModel = TCString.decode(consentString);

    // Verify metadata fields are correctly passed through
    expect(tcModel.created).toEqual(new Date(userStatus.created));
    expect(tcModel.lastUpdated).toEqual(new Date(userStatus.updated));
    expect(tcModel.cmpId).toBe(userStatus.cmpId);
    expect(tcModel.cmpVersion).toBe(userStatus.cmpVersion);
    expect(tcModel.consentScreen).toBe(userStatus.consentScreen);
    expect(tcModel.useNonStandardTexts).toBe(userStatus.useNonStandardTexts);
    expect(tcModel.purposeOneTreatment).toBe(userStatus.purposeOneTreatment);
    expect(tcModel.publisherCountryCode).toBe(userStatus.publisher.countryCode);
    expect(tcModel.vendorListVersion).toBe(gvl.vendorListVersion);

    // Verify purposes were correctly mapped
    expect(Array.from(tcModel.purposeConsents.values())).toEqual([1, 2, 3]);
    expect(Array.from(tcModel.purposeLegitimateInterests.values())).toEqual([2]);

    // Verify vendors were correctly mapped
    expect(Array.from(tcModel.vendorConsents.values())).toEqual([1, 2]);
    expect(Array.from(tcModel.vendorLegitimateInterests.values())).toEqual([8]);

    // Verify empty fields
    expect(Array.from(tcModel.specialFeatureOptins.values())).toEqual([]);
    expect(Array.from(tcModel.publisherCustomConsents.values())).toEqual([]);
    expect(Array.from(tcModel.publisherCustomLegitimateInterests.values())).toEqual([]);
    expect(tcModel.publisherRestrictions.getRestrictions()).toEqual([]);
  });

  it('should map special features and custom purposes', () => {
    const userStatus = {
      created: '2024-01-01T00:00:00.000Z',
      updated: '2024-01-01T00:00:00.000Z',
      cmpId: 7,
      cmpVersion: 1,
      consentScreen: 1,
      useNonStandardTexts: false,
      purposeOneTreatment: false,
      purposes: {
        optin: ['precise-geolocation', 'custom-marketing', 'custom-analytics'],
        optout: ['custom-analytics'],
      },
      vendors: {
        optin: [],
        optout: [],
      },
      publisher: {
        countryCode: 'FR',
      }
    };

    const consentString = encodeIABTCFFromDidomiIDs(gvl, userStatus, purposesIDMapping, vendorsIDMapping);
    const tcModel = TCString.decode(consentString);

    // Verify special features were correctly mapped
    expect(Array.from(tcModel.specialFeatureOptins.values())).toEqual([1]);

    // Verify custom purposes were correctly mapped
    expect(Array.from(tcModel.publisherCustomConsents.values())).toEqual([4, 5]);
    expect(Array.from(tcModel.publisherCustomLegitimateInterests.values())).toEqual([5]);
  });

  it('should handle unmapped IDs by ignoring them', () => {
    const userStatus = {
      created: '2024-01-01T00:00:00.000Z',
      updated: '2024-01-01T00:00:00.000Z',
      cmpId: 7,
      cmpVersion: 1,
      consentScreen: 1,
      useNonStandardTexts: false,
      purposeOneTreatment: false,
      purposes: {
        optin: ['unknown-purpose', 'marketing'],
        optout: ['unknown-purpose-2'],
      },
      vendors: {
        optin: ['unknown-vendor', 'google'],
        optout: ['unknown-vendor-2'],
      },
      publisher: {
        countryCode: 'FR',
      }
    };

    const consentString = encodeIABTCFFromDidomiIDs(gvl, userStatus, purposesIDMapping, vendorsIDMapping);
    const tcModel = TCString.decode(consentString);

    // Verify only mapped IDs are included
    expect(Array.from(tcModel.purposeConsents.values())).toEqual([1]);
    expect(Array.from(tcModel.purposeLegitimateInterests.values())).toEqual([]);
    expect(Array.from(tcModel.vendorConsents.values())).toEqual([1]);
    expect(Array.from(tcModel.vendorLegitimateInterests.values())).toEqual([]);
  });

  it('should handle empty arrays of IDs', () => {
    const userStatus = {
      created: '2024-01-01T00:00:00.000Z',
      updated: '2024-01-01T00:00:00.000Z',
      cmpId: 7,
      cmpVersion: 1,
      consentScreen: 1,
      useNonStandardTexts: false,
      purposeOneTreatment: false,
      purposes: {
        optin: [],
        optout: [],
      },
      vendors: {
        optin: [],
        optout: [],
      },
      publisher: {
        countryCode: 'FR',
      }
    };

    const consentString = encodeIABTCFFromDidomiIDs(gvl, userStatus, purposesIDMapping, vendorsIDMapping);
    const tcModel = TCString.decode(consentString);

    // Verify all arrays are empty
    expect(Array.from(tcModel.purposeConsents.values())).toEqual([]);
    expect(Array.from(tcModel.purposeLegitimateInterests.values())).toEqual([]);
    expect(Array.from(tcModel.vendorConsents.values())).toEqual([]);
    expect(Array.from(tcModel.vendorLegitimateInterests.values())).toEqual([]);
    expect(Array.from(tcModel.specialFeatureOptins.values())).toEqual([]);
    expect(Array.from(tcModel.publisherCustomConsents.values())).toEqual([]);
    expect(Array.from(tcModel.publisherCustomLegitimateInterests.values())).toEqual([]);
  });

  it('should map publisher restrictions', () => {
    const userStatus = {
      created: '2024-01-01T00:00:00.000Z',
      updated: '2024-01-01T00:00:00.000Z',
      cmpId: 7,
      cmpVersion: 1,
      consentScreen: 1,
      useNonStandardTexts: false,
      purposeOneTreatment: false,
      purposes: {
        optin: ['precise-geolocation', 'custom-marketing', 'custom-analytics'],
        optout: ['custom-analytics'],
      },
      vendors: {
        optin: [],
        optout: [],
      },
      publisher: {
        countryCode: 'FR',
        restrictions: [{
          purposeId: 'marketing',
          vendors: { type: IABTCFPublisherRestrictionVendorsType.ALL },
          restrictionType: IABTCFPublisherRestrictionType.DISALLOW,
        }],
      }
    };

    const consentString = encodeIABTCFFromDidomiIDs(gvl, userStatus, purposesIDMapping, vendorsIDMapping);
    const tcModel = TCString.decode(consentString);

    expect(tcModel.publisherRestrictions.getRestrictions().length).toBe(1);
    expect(tcModel.publisherRestrictions.getRestrictions()[0].purposeId).toBe(1);
    expect(tcModel.publisherRestrictions.getRestrictions()[0].restrictionType).toEqual(RestrictionType.NOT_ALLOWED);
    expect(tcModel.publisherRestrictions.getVendors(
      new PurposeRestriction(1, RestrictionType.NOT_ALLOWED),
    ).length).toBeGreaterThan(500);
  });
});
