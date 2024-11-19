import type { UUID } from './uuid.type';
import type { PurposesVendors } from './purposes-vendors.type';
import type { Timestamp } from './timestamp.type';

/**
 * User Status contains an user consent and legitimate interest disclosure for vendors and purposes
 */
export type UserStatus = {
  /**
   * User ID
   */
  user_id: UUID;

  /**
   * Creation Date
   */
  created: Timestamp;

  /**
   * Update Date
   */
  updated: Timestamp;

  /**
   * Enabled / disabled vendors (based on consent)
   */
  vendors: PurposesVendors;

  /**
   * Enabled / disabled purposes (based on consent)
   */
  purposes: PurposesVendors;

  /**
   * Enabled / disabled vendors (based on LI)
   */
  vendors_li: PurposesVendors;

  /**
   * Enabled / disabled vendors (based on LI)
   */
  purposes_li: PurposesVendors;

  /**
   * Last sync date
   */
  sync: Timestamp | null;

  /**
   * Regulation ID
   */
  regulation_id: number | null;
};
