import { GVL, PurposeRestriction, RestrictionType, TCString, VersionOrVendorList } from '@iabtechlabtcf/core';
import { encodeIABTCF } from './encoder-iab-tcf';
import gvlJson from './gvl.json';
import { IABTCFPublisherRestrictionVendorsType } from '@/types/publisher-restrictions.type';
import { IABTCFPublisherRestrictionType } from '@/types/publisher-restrictions.type';

const gvl = new GVL(gvlJson as unknown as VersionOrVendorList);
const allGVLVendorIds = Array.from({ length: Math.max(...gvl.vendorIds) }, (_, i) => i + 1); // All GVL vendor IDs with gaps filled (ie missing vendor IDs are included)

describe('encodeIABTCF', () => {
  it('should encode empty user status to IAB TCF consent string', () => {
    const consentString = encodeIABTCF(gvl, {
      created: '2024-01-01',
      updated: '2024-01-01',
      cmpId: 7,
      cmpVersion: 1,
      consentScreen: 1,
      consentLanguage: 'en',
      policyVersion: 5,
      useNonStandardTexts: false,
      specialFeatureOptins: [],
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
    });

    expect(consentString).toBe('CP3tAUAP3tAUAAHABBENBQFAAAAAAAAAAAqIAAAAAAAA');
  });

  it('should encode full user status to IAB TCF consent string', () => {
    const userStatus = {
      created: '2024-01-01T00:00:00.000Z',
      updated: '2024-01-01T00:00:00.000Z',
      cmpId: 7,
      cmpVersion: 1,
      consentScreen: 1,
      consentLanguage: 'EN',
      policyVersion: 5,
      useNonStandardTexts: false,
      specialFeatureOptins: [1],
      purposeOneTreatment: false,
      purposes: {
        optin: [1, 2, 3],
        optout: [2],
      },
      vendors: {
        optin: [1, 2],
        optout: [8],
      },
      publisher: {
        countryCode: 'FR',
        tcfPurposes: {
          optin: [1, 2, 3],
          optout: [2],
        },
        customPurposes: {
          optin: [4, 5],
          optout: [5],
        },
      }
    };

    const consentString = encodeIABTCF(gvl, userStatus);

    const tcModel = TCString.decode(consentString);

    expect(tcModel.created).toEqual(new Date(userStatus.created));
    expect(tcModel.lastUpdated).toEqual(new Date(userStatus.updated));
    expect(tcModel.cmpId).toEqual(userStatus.cmpId);
    expect(tcModel.cmpVersion).toEqual(userStatus.cmpVersion);
    expect(tcModel.consentScreen).toEqual(userStatus.consentScreen);
    expect(tcModel.consentLanguage).toEqual(userStatus.consentLanguage);
    expect(tcModel.policyVersion).toEqual(userStatus.policyVersion);
    expect(tcModel.useNonStandardTexts).toEqual(userStatus.useNonStandardTexts);
    expect(tcModel.purposeOneTreatment).toEqual(userStatus.purposeOneTreatment);
    expect(Array.from(tcModel.specialFeatureOptins.values())).toEqual(userStatus.specialFeatureOptins);
    expect(Array.from(tcModel.purposeConsents.values())).toEqual(userStatus.purposes.optin);
    expect(Array.from(tcModel.purposeLegitimateInterests.values())).toEqual(userStatus.purposes.optout);
    expect(Array.from(tcModel.vendorConsents.values())).toEqual(userStatus.vendors.optin);
    expect(Array.from(tcModel.vendorLegitimateInterests.values())).toEqual(userStatus.vendors.optout);
    expect(tcModel.publisherCountryCode).toEqual(userStatus.publisher.countryCode);
    expect(Array.from(tcModel.publisherConsents.values())).toEqual(userStatus.publisher.tcfPurposes?.optin);
    expect(Array.from(tcModel.publisherLegitimateInterests.values())).toEqual(userStatus.publisher.tcfPurposes?.optout);
    expect(tcModel.numCustomPurposes).toEqual(5);
    expect(Array.from(tcModel.publisherCustomConsents.values())).toEqual(userStatus.publisher.customPurposes?.optin);
    expect(Array.from(tcModel.publisherCustomLegitimateInterests.values())).toEqual(userStatus.publisher.customPurposes?.optout);
  });

  describe('publisher restrictions', () => {
    it('should encode publisher restrictions for disallowing all vendors', () => {
      const consentString = encodeIABTCF(gvl, {
        created: '2024-01-01',
        updated: '2024-01-01',
        cmpId: 7,
        cmpVersion: 1,
        consentScreen: 1,
        consentLanguage: 'en',
        policyVersion: 5,
        useNonStandardTexts: false,
        specialFeatureOptins: [],
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
          restrictions: [
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.ALL,
              },
              restrictionType: IABTCFPublisherRestrictionType.DISALLOW,
            },
          ],
        }
      });

      const tcModel = TCString.decode(consentString);

      expect(tcModel.publisherRestrictions.getRestrictions()).toEqual([
        {
          purposeId_: 2,
          restrictionType: RestrictionType.NOT_ALLOWED,
        },
      ]);

      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            2,
            RestrictionType.NOT_ALLOWED
          )
        )
      ).toEqual(allGVLVendorIds);
    });

    it('should encode publisher restrictions for disallowing specific vendors', () => {
      const consentString = encodeIABTCF(gvl, {
        created: '2024-01-01',
        updated: '2024-01-01',
        cmpId: 7,
        cmpVersion: 1,
        consentScreen: 1,
        consentLanguage: 'en',
        policyVersion: 5,
        useNonStandardTexts: false,
        specialFeatureOptins: [],
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
          restrictions: [
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.LIST,
                ids: [1, 2],
              },
              restrictionType: IABTCFPublisherRestrictionType.DISALLOW,
            },
          ],
        }
      });

      const tcModel = TCString.decode(consentString);

      expect(tcModel.publisherRestrictions.getRestrictions()).toEqual([
        {
          purposeId_: 2,
          restrictionType: RestrictionType.NOT_ALLOWED,
        },
      ]);

      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            2,
            RestrictionType.NOT_ALLOWED
          )
        )
      ).toEqual([
        1, 2,
      ]);
    });

    it('should encode publisher restrictions for requiring consent for all vendors', () => {
      const consentString = encodeIABTCF(gvl, {
        created: '2024-01-01',
        updated: '2024-01-01',
        cmpId: 7,
        cmpVersion: 1,
        consentScreen: 1,
        consentLanguage: 'en',
        policyVersion: 5,
        useNonStandardTexts: false,
        specialFeatureOptins: [],
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
          restrictions: [
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.ALL,
              },
              restrictionType: IABTCFPublisherRestrictionType.REQ_CONSENT,
            },
          ],
        }
      });

      const tcModel = TCString.decode(consentString);

      expect(tcModel.publisherRestrictions.getRestrictions()).toEqual([
        {
          purposeId_: 2,
          restrictionType: RestrictionType.REQUIRE_CONSENT,
        },
      ]);

      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            2,
            RestrictionType.REQUIRE_CONSENT
          )
        )
      ).toEqual(allGVLVendorIds);
    });

    it('should encode publisher restrictions for requiring consent for specific vendors', () => {
      const consentString = encodeIABTCF(gvl, {
        created: '2024-01-01',
        updated: '2024-01-01',
        cmpId: 7,
        cmpVersion: 1,
        consentScreen: 1,
        consentLanguage: 'en',
        policyVersion: 5,
        useNonStandardTexts: false,
        specialFeatureOptins: [],
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
          restrictions: [
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.LIST,
                ids: [8],
              },
              restrictionType: IABTCFPublisherRestrictionType.REQ_CONSENT,
            },
          ],
        }
      });

      const tcModel = TCString.decode(consentString);

      expect(tcModel.publisherRestrictions.getRestrictions()).toEqual([
        {
          purposeId_: 2,
          restrictionType: RestrictionType.REQUIRE_CONSENT,
        },
      ]);

      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            2,
            RestrictionType.REQUIRE_CONSENT
          )
        )
      ).toEqual([
        8,
      ]);
    });

    it('should encode publisher restrictions for requiring legitimate interests for all vendors', () => {
      const consentString = encodeIABTCF(gvl, {
        created: '2024-01-01',
        updated: '2024-01-01',
        cmpId: 7,
        cmpVersion: 1,
        consentScreen: 1,
        consentLanguage: 'en',
        policyVersion: 5,
        useNonStandardTexts: false,
        specialFeatureOptins: [],
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
          restrictions: [
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.ALL,
              },
              restrictionType: IABTCFPublisherRestrictionType.REQ_LI,
            },
          ],
        }
      });

      const tcModel = TCString.decode(consentString);

      expect(tcModel.publisherRestrictions.getRestrictions()).toEqual([
        {
          purposeId_: 2,
          restrictionType: RestrictionType.REQUIRE_LI,
        },
      ]);

      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            2,
            RestrictionType.REQUIRE_LI
          )
        )
      ).toEqual(allGVLVendorIds);
    });

    it('should encode publisher restrictions for requiring legitimate interests for specific vendors', () => {
      const consentString = encodeIABTCF(gvl, {
        created: '2024-01-01',
        updated: '2024-01-01',
        cmpId: 7,
        cmpVersion: 1,
        consentScreen: 1,
        consentLanguage: 'en',
        policyVersion: 5,
        useNonStandardTexts: false,
        specialFeatureOptins: [],
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
          restrictions: [
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.LIST,
                ids: [1],
              },
              restrictionType: IABTCFPublisherRestrictionType.REQ_LI,
            },
          ],
        }
      });

      const tcModel = TCString.decode(consentString);

      expect(tcModel.publisherRestrictions.getRestrictions()).toEqual([
        {
          purposeId_: 2,
          restrictionType: RestrictionType.REQUIRE_LI,
        },
      ]);

      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            2,
            RestrictionType.REQUIRE_LI
          )
        )
      ).toEqual([
        1
      ]);
    });

    it('should encode publisher restrictions for allowing only specific vendors', () => {
      const consentString = encodeIABTCF(gvl, {
        created: '2024-01-01',
        updated: '2024-01-01',
        cmpId: 7,
        cmpVersion: 1,
        consentScreen: 1,
        consentLanguage: 'en',
        policyVersion: 5,
        useNonStandardTexts: false,
        specialFeatureOptins: [],
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
          restrictions: [
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.LIST,
                ids: [1, 2],
              },
              restrictionType: IABTCFPublisherRestrictionType.ALLOW,
            },
          ],
        }
      });

      const tcModel = TCString.decode(consentString);

      expect(tcModel.publisherRestrictions.getRestrictions()).toEqual([
        {
          purposeId_: 2,
          restrictionType: RestrictionType.NOT_ALLOWED,
        },
      ]);

      // Since ALLOW is implemented by disallowing all other vendors,
      // we expect all vendors except 1 and 2 to be in the restriction list
      const disallowedVendors = tcModel.publisherRestrictions.getVendors(
        new PurposeRestriction(
          2,
          RestrictionType.NOT_ALLOWED
        )
      );

      expect(disallowedVendors).not.toContain(1);
      expect(disallowedVendors).not.toContain(2);
      expect(disallowedVendors.length).toEqual(858);
    });

    it('should not add any restriction when allowing all vendors', () => {
      const consentString = encodeIABTCF(gvl, {
        created: '2024-01-01',
        updated: '2024-01-01',
        cmpId: 7,
        cmpVersion: 1,
        consentScreen: 1,
        consentLanguage: 'en',
        policyVersion: 5,
        useNonStandardTexts: false,
        specialFeatureOptins: [],
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
          restrictions: [
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.ALL,
              },
              restrictionType: IABTCFPublisherRestrictionType.ALLOW,
            },
          ],
        }
      });

      const tcModel = TCString.decode(consentString);

      // Verify no restrictions were added
      expect(tcModel.publisherRestrictions.getRestrictions()).toEqual([]);

      // Verify no vendors have restrictions for purpose 2
      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            2,
            RestrictionType.NOT_ALLOWED
          )
        )
      ).toEqual([]);
    });

    it('should encode multiple restrictions for the same purpose', () => {
      const consentString = encodeIABTCF(gvl, {
        created: '2024-01-01',
        updated: '2024-01-01',
        cmpId: 7,
        cmpVersion: 1,
        consentScreen: 1,
        consentLanguage: 'en',
        policyVersion: 5,
        useNonStandardTexts: false,
        specialFeatureOptins: [],
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
          restrictions: [
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.LIST,
                ids: [8],
              },
              restrictionType: IABTCFPublisherRestrictionType.REQ_CONSENT,
            },
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.LIST,
                ids: [1],
              },
              restrictionType: IABTCFPublisherRestrictionType.REQ_LI,
            },
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.LIST,
                ids: [6],
              },
              restrictionType: IABTCFPublisherRestrictionType.DISALLOW,
            },
          ],
        }
      });

      const tcModel = TCString.decode(consentString);

      // Verify all restriction types are present for purpose 2
      expect(tcModel.publisherRestrictions.getRestrictions()).toEqual([
        {
          purposeId_: 2,
          restrictionType: RestrictionType.REQUIRE_CONSENT,
        },
        {
          purposeId_: 2,
          restrictionType: RestrictionType.REQUIRE_LI,
        },
        {
          purposeId_: 2,
          restrictionType: RestrictionType.NOT_ALLOWED,
        },
      ]);

      // Verify vendors for each restriction type
      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            2,
            RestrictionType.REQUIRE_CONSENT
          )
        )
      ).toEqual([8]);

      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            2,
            RestrictionType.REQUIRE_LI
          )
        )
      ).toEqual([1]);

      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            2,
            RestrictionType.NOT_ALLOWED
          )
        )
      ).toEqual([6]);
    });

    it('should encode restrictions for multiple purposes', () => {
      const consentString = encodeIABTCF(gvl, {
        created: '2024-01-01',
        updated: '2024-01-01',
        cmpId: 7,
        cmpVersion: 1,
        consentScreen: 1,
        consentLanguage: 'en',
        policyVersion: 5,
        useNonStandardTexts: false,
        specialFeatureOptins: [],
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
          restrictions: [
            {
              purposeId: 2,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.LIST,
                ids: [8],
              },
              restrictionType: IABTCFPublisherRestrictionType.REQ_CONSENT,
            },
            {
              purposeId: 4,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.ALL,
              },
              restrictionType: IABTCFPublisherRestrictionType.DISALLOW,
            },
            {
              purposeId: 7,
              vendors: {
                type: IABTCFPublisherRestrictionVendorsType.LIST,
                ids: [10],
              },
              restrictionType: IABTCFPublisherRestrictionType.REQ_LI,
            },
          ],
        }
      });

      const tcModel = TCString.decode(consentString);

      // Verify restrictions for all purposes are present
      expect(tcModel.publisherRestrictions.getRestrictions()).toEqual([
        {
          purposeId_: 2,
          restrictionType: RestrictionType.REQUIRE_CONSENT,
        },
        {
          purposeId_: 4,
          restrictionType: RestrictionType.NOT_ALLOWED,
        },
        {
          purposeId_: 7,
          restrictionType: RestrictionType.REQUIRE_LI,
        },
      ]);

      // Verify vendors for purpose 2 (require consent)
      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            2,
            RestrictionType.REQUIRE_CONSENT
          )
        )
      ).toEqual([8]);

      // Verify vendors for purpose 4 (disallow all)
      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            4,
            RestrictionType.NOT_ALLOWED
          )
        )
      ).toEqual(allGVLVendorIds);

      // Verify vendors for purpose 7 (require LI)
      expect(
        tcModel.publisherRestrictions.getVendors(
          new PurposeRestriction(
            7,
            RestrictionType.REQUIRE_LI
          )
        )
      ).toEqual([10]);
    });
  });
});
