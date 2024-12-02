/**
 * Didomi API ID
 *
 * The unique string ID of a Didomi entity in the API.
 */
export type DidomiAPIID = string;

/**
 * IAB TCF ID
 *
 * The numeric ID of an IAB TCF entity.
 */
export type IABTCFID = number;

/**
 * ID mapping for purposes, special features and custom purposes from Didomi IDs to IAB TCF IDs
 */
export type IABTCFPurposesIDMapping = {
  /**
   * Map of custom purposes (publisher purposes) from Didomi purpose IDs to IAB TCF IDs
   */
  customPurposes: Record<DidomiAPIID, IABTCFID>;

  /**
   * Map of purposes from Didomi purpose IDs to IAB TCF purpose IDs
   */
  purposes: Record<DidomiAPIID, IABTCFID>;

  /**
   * Map of special features from Didomi purpose IDs to IAB TCF special feature IDs
   */
  specialFeatures: Record<DidomiAPIID, IABTCFID>;
};

/**
 * ID mapping for vendors from Didomi IDs to IAB TCF IDs
 */
export type IABTCFVendorsIDMapping = Record<DidomiAPIID, IABTCFID>;

/**
 * Didomi purpose with IAB TCF IDs in namespaces
 */
export type DidomiPurpose = {
  /**
   * Didomi ID
   */
  id: DidomiAPIID;

  /**
   * Namespaces
   */
  namespaces: {
    /**
     * IAB TCF ID for purposes
     */
    iab2?: IABTCFID;

    /**
     * IAB TCF ID for special features
     */
    iab2_special_feature?: IABTCFID;

    /**
     * ID for a custom purpose that is specific to a publisher
     */
    pub?: IABTCFID;
  }
}

/**
 * Didomi vendor with IAB TCF ID in namespaces
 */
export type DidomiVendor = {
  /**
   * Didomi ID
   */
  id: DidomiAPIID;

  /**
   * Namespaces
   */
  namespaces: {
    /**
     * IAB TCF ID for vendors
     */
    iab2?: IABTCFID;
  }
}
