import { DidomiPurpose, DidomiVendor, IABTCFPurposesIDMapping, IABTCFVendorsIDMapping } from "@/types/iab-tcf-id-mapping.type";


/**
 * Build maps of Didomi purpose IDs to IAB TCF IDs
 *
 * @param purposes - Array of purposes
 * @param vendors - Array of vendors
 */
export function buildIABTCFPurposesIDMapping(purposes: DidomiPurpose[]): IABTCFPurposesIDMapping {
  const idMapping: IABTCFPurposesIDMapping = {
    purposes: {},
    specialFeatures: {},
    customPurposes: {},
  };

  for (const purpose of purposes) {
    if (purpose.namespaces?.iab2) {
      idMapping.purposes[purpose.id] = purpose.namespaces.iab2;
    } else if (purpose.namespaces?.iab2_special_feature) {
      idMapping.specialFeatures[purpose.id] = purpose.namespaces.iab2_special_feature;
    } else if (purpose.namespaces?.pub) {
      idMapping.customPurposes[purpose.id] = purpose.namespaces.pub;
    }
  }

  return idMapping;
}

/**
 * Build map of Didomi vendor IDs to IAB TCF IDs
 *
 * @param vendors - Array of vendors
 */
export function buildIABTCFVendorsIDMapping(vendors: DidomiVendor[]): IABTCFVendorsIDMapping {
  const idMapping: IABTCFVendorsIDMapping = {};

  for (const vendor of vendors) {
    if (vendor.namespaces?.iab2) {
      idMapping[vendor.id] = vendor.namespaces.iab2;
    }
  }

  return idMapping;
}
