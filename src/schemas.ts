import { ConsentStringType } from "@/types/consent-string.type";
import { Schema } from "@/types/schema.type";
import dcsSchema from "./dcs.json";

/**
 * Consent string schemas
 */
export const schemas: Record<ConsentStringType, Schema> = {
  [ConsentStringType.DCSv2]: dcsSchema as Schema
};
