export type SectionType =
  | "banner"          // 1290 x 250  — thin top strip (LAST CHANCE / INNERWEAR / EIDI GIFTS)
  | "hero"            // 1290 x 1614 — tall hero card (KLYDO'S NEWEST SALE DROP)
  | "trends-banner"   // 1200 x 864  — wider landscape carousel hero
  | "looks-banner"    // 720 x 864   — portrait composition (CELEBRITY LOOKS DROP)
  | "grid-2-big"      // 520 x 750   — tall 2-col (used for "Big 2 Grid banner" and mixed top)
  | "grid-2"          // 520 x 492   — near-square 2-col (PRICE DROP PICKS)
  | "grid-3"          // 387 x 492   — 3-col portrait (LAST CALL BRAND STEALS)
  | "grid-4"          // 4-col chips (SHOP UNDER YOUR BUDGET)
  | "mixed"           // grid-2-big top + grid-3 bottom (EID GLAM FIT CHECK)
  | "strip"           // single tall image at natural aspect
  | "custom"          // user-defined width × height × columns
  | "promo-text";

export const SECTION_LABELS: Record<SectionType, string> = {
  banner: "Banner — 1290×250 (carousel if >1)",
  hero: "Hero — 1290×1614 (carousel if >1)",
  "trends-banner": "Trends banner — 1200×864 (carousel if >1)",
  "looks-banner": "Looks banner — 720×864 (carousel if >1)",
  "grid-2-big": "2-col big — 520×750",
  "grid-2": "2-col — 520×492",
  "grid-3": "3-col — 387×492",
  "grid-4": "4-col chips",
  mixed: "Mixed — 2 big + 3-col",
  strip: "Strip (one tall image)",
  custom: "Custom card — set W × H × cols",
  "promo-text": "Promo text",
};

export const SECTION_SLOTS: Record<SectionType, number | "many"> = {
  banner: "many",
  hero: "many",
  "trends-banner": "many",
  "looks-banner": "many",
  "grid-2-big": "many",
  "grid-2": "many",
  "grid-3": "many",
  "grid-4": "many",
  mixed: "many",
  strip: 1,
  custom: "many",
  "promo-text": 0,
};

/**
 * Source-asset dimensions for each section item. The renderer applies these
 * as a CSS aspect-ratio so cards always render the same proportions the
 * designer's source images will have in production.
 */
export const SECTION_DIMS: Record<SectionType, [number, number] | null> = {
  banner: [1290, 250],
  hero: [1290, 1614],
  "trends-banner": [1200, 864],
  "looks-banner": [720, 864],
  "grid-2-big": [520, 750],
  "grid-2": [520, 492],
  "grid-3": [387, 492],
  "grid-4": [240, 320],
  mixed: [520, 750], // top row; bottom row uses grid-3 dims
  strip: null,
  custom: null, // uses section.customWidth/customHeight
  "promo-text": null,
};

export interface FeedSection {
  id: string;
  type: SectionType;
  title?: string;
  note?: string;
  imageIds: string[];
  promoLine1?: string;
  promoLine2?: string;
  /** For type === "custom" only */
  customWidth?: number;
  customHeight?: number;
  customCols?: 1 | 2 | 3 | 4;
}

export interface FeedDoc {
  id: string;
  name: string;
  updatedAt: number;
  sections: FeedSection[];
}
