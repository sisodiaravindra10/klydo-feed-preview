"use client";

import { forwardRef } from "react";
import { FeedDoc } from "@/lib/types";
import { KlydoHeader } from "./KlydoHeader";
import { KlydoBottomNav } from "./KlydoBottomNav";
import { SectionRenderer } from "./SectionRenderer";

/**
 * A hidden off-screen render of the full feed at native phone width (390px).
 * Used as the source for html-to-image captures so the whole feed comes out
 * in one image — no scroll truncation, no editor chrome.
 *
 * Two modes: "feed" (white card only) and "phone" (with iPhone frame).
 */
interface Props {
  feed: FeedDoc;
  frame: "feed" | "phone";
}

export const CaptureSurface = forwardRef<HTMLDivElement, Props>(function CaptureSurface(
  { feed, frame },
  ref
) {
  const inner = (
    <div className="bg-white" style={{ width: 390 }}>
      <KlydoHeader />
      {feed.sections.map((s) => (
        <SectionRenderer key={s.id} section={s} />
      ))}
      <KlydoBottomNav />
    </div>
  );

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: -100000,
        top: 0,
        background: frame === "phone" ? "#0a0b10" : "transparent",
        padding: frame === "phone" ? 24 : 0,
        // Don't constrain height — let it grow to fit the full feed
        width: frame === "phone" ? 438 : 390,
      }}
      aria-hidden
    >
      {frame === "phone" ? (
        <div
          className="overflow-hidden bg-white"
          style={{
            width: 390,
            borderRadius: 42,
            boxShadow: "0 0 0 12px #0a0a0c, 0 0 0 13px rgba(255,255,255,0.05)",
          }}
        >
          {inner}
        </div>
      ) : (
        inner
      )}
    </div>
  );
});
