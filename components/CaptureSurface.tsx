"use client";

import { forwardRef } from "react";
import { FeedDoc } from "@/lib/types";
import { KlydoHeader } from "./KlydoHeader";
import { KlydoBottomNav } from "./KlydoBottomNav";
import { SectionRenderer } from "./SectionRenderer";

/**
 * A hidden in-flow render of the full feed at native phone width (390px).
 * Used as the source for html-to-image captures so the whole feed comes
 * out in one image — no scroll truncation, no editor chrome.
 *
 * Two modes: "feed" (white card only) and "phone" (with iPhone frame).
 *
 * The surface is rendered with opacity:0 + pointer-events:none rather
 * than position:fixed offscreen. The offscreen approach can cause some
 * browsers to skip painting it, which makes html-to-image produce a
 * blank-white capture in production. Keeping it in-flow but invisible
 * guarantees full paint while staying invisible to the user.
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
      style={{
        // Wrapper that consumes 0 space in flow but lets children be painted
        position: "absolute",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        overflow: "visible",
        pointerEvents: "none",
        zIndex: -1,
      }}
      aria-hidden
    >
      <div
        ref={ref}
        style={{
          background: frame === "phone" ? "#0a0b10" : "#ffffff",
          padding: frame === "phone" ? 24 : 0,
          width: frame === "phone" ? 438 : 390,
          // Invisible, but fully laid out and painted
          opacity: 0,
        }}
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
    </div>
  );
});
