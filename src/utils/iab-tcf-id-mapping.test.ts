import { buildIABTCFPurposesIDMapping, buildIABTCFVendorsIDMapping } from '@/utils/iab-tcf-id-mapping';
import { DidomiPurpose, DidomiVendor } from '@/types/iab-tcf-id-mapping.type';
describe('buildPurposesIDMapping', () => {
  it('should create empty mappings when no purposes or vendors are provided', () => {
    const result = buildIABTCFPurposesIDMapping([]);

    expect(result).toEqual({
      purposes: {},
      specialFeatures: {},
      customPurposes: {},
    });
  });

  it('should correctly map IAB2 purposes', () => {
    const purposes: DidomiPurpose[] = [
      {
        id: 'cookies',
        namespaces: {
          iab2: 1
        }
      },
      {
        id: 'advertising',
        namespaces: {
          iab2: 3
        }
      }
    ];

    const result = buildIABTCFPurposesIDMapping(purposes);

    expect(result.purposes).toEqual({
      'cookies': 1,
      'advertising': 3
    });
  });

  it('should correctly map special features', () => {
    const purposes: DidomiPurpose[] = [
      {
        id: 'precise-geolocation',
        namespaces: {
          iab2_special_feature: 1
        }
      }
    ];

    const result = buildIABTCFPurposesIDMapping(purposes);

    expect(result.specialFeatures).toEqual({
      'precise-geolocation': 1
    });
  });

  it('should correctly map custom purposes', () => {
    const purposes: DidomiPurpose[] = [
      {
        id: 'custom-purpose-1',
        namespaces: {
          pub: 1
        }
      }
    ];

    const result = buildIABTCFPurposesIDMapping(purposes);

    expect(result.customPurposes).toEqual({
      'custom-purpose-1': 1
    });
  });

  it('should handle mixed purpose types', () => {
    const purposes: DidomiPurpose[] = [
      {
        id: 'cookies',
        namespaces: {
          iab2: 1
        }
      },
      {
        id: 'precise-geolocation',
        namespaces: {
          iab2_special_feature: 1
        }
      },
      {
        id: 'custom-purpose-1',
        namespaces: {
          pub: 1
        }
      }
    ];

    const result = buildIABTCFPurposesIDMapping(purposes);

    expect(result).toEqual({
      purposes: {
        'cookies': 1
      },
      specialFeatures: {
        'precise-geolocation': 1
      },
      customPurposes: {
        'custom-purpose-1': 1
      },
    });
  });

  it('should respect namespace priority when purpose has multiple namespaces', () => {
    const purposes: DidomiPurpose[] = [
      {
        id: 'multi-namespace-1',
        namespaces: {
          iab2: 1,
          iab2_special_feature: 2,
          pub: 3
        }
      },
      {
        id: 'multi-namespace-2',
        namespaces: {
          iab2_special_feature: 4,
          pub: 5
        }
      },
      {
        id: 'multi-namespace-3',
        namespaces: {
          pub: 6
        }
      }
    ];

    const result = buildIABTCFPurposesIDMapping(purposes);

    expect(result).toEqual({
      purposes: {
        'multi-namespace-1': 1  // iab2 takes priority
      },
      specialFeatures: {
        'multi-namespace-2': 4  // iab2_special_feature takes priority when no iab2
      },
      customPurposes: {
        'multi-namespace-3': 6  // pub only used when no other namespaces
      },
    });

    // Verify that purposes with multiple namespaces are only mapped once
    expect(Object.keys(result.purposes).length).toBe(1);
    expect(Object.keys(result.specialFeatures).length).toBe(1);
    expect(Object.keys(result.customPurposes).length).toBe(1);
  });
});

describe('buildIABTCFVendorsIDMapping', () => {
  it('should create empty mapping when no vendors are provided', () => {
    const result = buildIABTCFVendorsIDMapping([]);

    expect(result).toEqual({});
  });

  it('should correctly map vendors', () => {
    const vendors: DidomiVendor[] = [
      {
        id: 'google',
        namespaces: {
          iab2: 1
        }
      },
      {
        id: 'facebook',
        namespaces: {
          iab2: 2
        }
      }
    ];

    const result = buildIABTCFVendorsIDMapping(vendors);

    expect(result).toEqual({
      'google': 1,
      'facebook': 2
    });
  });
});
