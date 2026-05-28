import { FeedSection, SectionType } from "./types";

export interface Preset {
  id: string;
  name: string;
  tagline: string;
  /** Used in the picker grid as a glyph stack — purely visual */
  glyph: string;
  sections: Omit<FeedSection, "id">[];
}

function mkId(): string {
  return `sec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function instantiatePreset(p: Preset): FeedSection[] {
  return p.sections.map((s) => ({
    ...s,
    id: mkId(),
    imageIds: [],
  }));
}

const empty = (type: SectionType, title?: string): Omit<FeedSection, "id"> => ({
  type,
  title,
  imageIds: [],
});

export const PRESETS: Preset[] = [
  {
    id: "eid-sale-drop",
    name: "Eid Sale Drop",
    tagline: "Festive launch — promo header → hero → fit-check grid",
    glyph: "🌙",
    sections: [
      { type: "promo-text", imageIds: [], promoLine1: "EID MUBARAK", promoLine2: "50-80% OFF" } as Omit<FeedSection, "id">,
      empty("banner", undefined),
      empty("hero", "EID GLAM STEALS"),
      empty("banner", undefined),
      empty("mixed", "EID GLAM FIT CHECK"),
      empty("banner", undefined),
    ],
  },
  {
    id: "brand-drop",
    name: "Brand Drop Campaign",
    tagline: "Brand reveal → multi-grid price drops → cricket tie-in",
    glyph: "🏷️",
    sections: [
      empty("banner"),
      empty("hero", "FRESH BRAND DROP"),
      empty("grid-2", "PRICE DROP PICKS"),
      empty("grid-3", "LAST CALL BRAND STEALS"),
      empty("banner"),
      empty("grid-2", "TRENDING FITS, BETTER DEALS"),
      empty("grid-3", "LAST MINUTE ADD-ON DEALS"),
    ],
  },
  {
    id: "celebrity-looks",
    name: "Celebrity Looks",
    tagline: "Looks composition → hero carousel → budget chips",
    glyph: "⭐️",
    sections: [
      empty("banner"),
      empty("looks-banner", "CELEBRITY LOOKS DROP"),
      empty("hero", "SHEER TOPS & DRESSES"),
      empty("grid-4", "SHOP UNDER YOUR BUDGET"),
      empty("grid-3", "MATCHING ACCESSORIES"),
    ],
  },
  {
    id: "trends-deals",
    name: "Trends & Deals",
    tagline: "Hero swipe → savings grid → trends carousel → chips",
    glyph: "🔥",
    sections: [
      empty("hero", "KLYDO'S NEWEST SALE DROP"),
      empty("grid-3", "SAVINGS IN EVERY STEPS"),
      empty("banner", undefined),
      empty("grid-3", "HOTTEST DEAL PICKS"),
      empty("trends-banner", "TRENDS UNDER SALE"),
      empty("grid-4", "SHOP UNDER YOUR BUDGET"),
    ],
  },
];
