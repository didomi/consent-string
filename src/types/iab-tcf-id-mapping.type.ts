/**
 * ID mapping for purposes, special features and custom purposes from Didomi IDs to IAB TCF IDs
 */
export type IABTCFPurposesIDMapping = {
  /**
   * Map of custom purposes (publisher purposes) from Didomi purpose IDs to IAB TCF IDs
   */
  customPurposes: Record<string, number>;

  /**
   * Map of purposes from Didomi purpose IDs to IAB TCF purpose IDs
   */
  purposes: Record<string, number>;

  /**
   * Map of special features from Didomi purpose IDs to IAB TCF special feature IDs
   */
  specialFeatures: Record<string, number>;
};

/**
 * ID mapping for vendors from Didomi IDs to IAB TCF IDs
 */
export type IABTCFVendorsIDMapping = Record<string, number>;

/**
 * Didomi purpose with IAB TCF IDs in namespaces
 */
export type DidomiPurpose = {
  /**
   * Didomi ID
   */
  id: string;

  /**
   * Namespaces
   */
  namespaces: {
    /**
     * IAB TCF ID for purposes
     */
    iab2?: number;

    /**
     * IAB TCF ID for special features
     */
    iab2_special_feature?: number;

    /**
     * ID for a custom purpose that is specific to a publisher
     */
    pub?: number;
  }
}

/**
 * Didomi vendor with IAB TCF ID in namespaces
 */
export type DidomiVendor = {
  /**
   * Didomi ID
   */
  id: string;

  /**
   * Namespaces
   */
  namespaces: {
    /**
     * IAB TCF ID for vendors
     */
    iab2?: number;
  }
}
