import { GVL, TCString, VersionOrVendorList } from '@iabtechlabtcf/core';
import { encodeIABTCF } from './encoder-iab-tcf';
import gvlJson from './gvl.json';

const gvl = new GVL(gvlJson as unknown as VersionOrVendorList);

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
    expect(Array.from(tcModel.publisherCustomConsents.values())).toEqual(userStatus.publisher.customPurposes?.optin);
    expect(Array.from(tcModel.publisherCustomLegitimateInterests.values())).toEqual(userStatus.publisher.customPurposes?.optout);
  });
});
