import { IABTCFID } from "./iab-tcf-id-mapping.type";

/**
 * Restriction type
 */
export enum IABTCFPublisherRestrictionType {
  /**
   * Allow all vendors provided
   *
   * This is encoded as disallowing all vendors that are not allowed in the IAB TCF consent string as the TCF does not support "allow" as a restriction type.
   */
  ALLOW = 'allow',

  /**
   * Disallow all vendors provided
   */
  DISALLOW = 'disallow',

  /**
   * Require consent (opt-in) for all vendors provided
   */
  REQ_CONSENT = 'req-consent',

  /**
   * Require legitimate interest (opt-out) for all vendors provided
   */
  REQ_LI = 'req-li',
}

/**
 * How vendors are specified
 */
export enum IABTCFPublisherRestrictionVendorsType {
  /**
   * All vendors in the IAB TCF GVL
   */
  ALL = 'all',

  /**
   * Vendors provided in a list
   */
  LIST = 'list',
}

/**
 * Vendors that the restriction applies to
 */
export type IABTCFPublisherRestrictionVendors<VendorId = IABTCFID> = {
  /**
   * Vendor IDs
   */
  ids?: VendorId[];

  /**
   * How vendors are provided
   */
  type: IABTCFPublisherRestrictionVendorsType;
};

/**
 * A publisher restriction
 */
export type IABTCFPublisherRestriction<PurposeId = IABTCFID, VendorId = IABTCFID> = {
  /**
   * Purpose ID the restriction applies to
   */
  purposeId: PurposeId;

  /**
   * Vendors that the restriction applies to
   */
  vendors: IABTCFPublisherRestrictionVendors<VendorId>;

  /**
   * Restriction type
   */
  restrictionType: IABTCFPublisherRestrictionType;
};
