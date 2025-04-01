import { PurposesVendors } from './purposes-vendors.type';
import { UUID } from './uuid.type';
import { Timestamp } from './timestamp.type';
/**
 * Possible field values
 */
export type FieldValue = UUID | number | Timestamp | PurposesVendors | null;
