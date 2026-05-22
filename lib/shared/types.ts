/**
 * Shared types used across client, worker, and admin domains.
 * Import from here instead of defining locally to keep the contract consistent.
 */

export const TRADE_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Cleaning",
  "Painting",
  "Moving",
  "HVAC",
  "Landscaping",
  "General Handyman",
] as const;

export type TradeCategory = (typeof TRADE_CATEGORIES)[number];
