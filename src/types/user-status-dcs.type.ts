import type { UUID } from '@/types/uuid.type';
import { Timestamp } from '@/types/timestamp.type';
import { PurposesVendors } from '@/types/purposes-vendors.type';

/**
 * User Status for DCS v1
 */
export type UserStatusDCSV1 = {
  /**
   * User ID
   */
  userId: UUID;

  /**
   * Creation Date
   */
  created: Timestamp;

  /**
   * Update Date
   */
  updated: Timestamp;

  /**
   * Enabled / disabled vendors for all data processing rules
   */
  vendors: {
    optin: PurposesVendors;
    optout: PurposesVendors;
  };

  /**
   * Enabled / disabled purposes for all data processing rules
   */
  purposes: {
    optin: PurposesVendors;
    optout: PurposesVendors;
  };

  /**
   * Last sync date
   */
  sync: Timestamp | null;
};

/**
 * User Status for DCS v2
 */
export type UserStatusDCSV2 = UserStatusDCSV1 & {
  /**
   * Regulation ID that was used to collect the user status
   */
  regulationId: number;
};


/**
 * User Status for DCS
 */
export type UserStatusDCS = UserStatusDCSV1 | UserStatusDCSV2;
