"use client";

import { FeedDoc } from "@/lib/types";
import { KlydoHeader } from "./KlydoHeader";
import { KlydoBottomNav } from "./KlydoBottomNav";
import { SectionRenderer } from "./SectionRenderer";

export function FeedRenderer({
  feed,
  emptyHint = true,
}: {
  feed: FeedDoc;
  emptyHint?: boolean;
}) {
  return (
    <>
      {/* Sticky header inside the phone screen */}
      <div className="shrink-0">
        <KlydoHeader />
      </div>

      {/* Scrollable feed content */}
      <div className="flex-1 overflow-y-auto phone-scroll bg-white pb-2">
        {feed.sections.length === 0 && emptyHint ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFE4F0] to-[#F5EAFE] grid place-items-center mb-4">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="3" stroke="#EC2D7C" strokeWidth="1.6" />
                <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#EC2D7C" strokeWidth="1.6" />
                <circle cx="9" cy="10" r="1.2" fill="#EC2D7C" />
              </svg>
            </div>
            <div className="text-[14px] font-semibold text-[#0F1117]">No designs yet</div>
            <div className="mt-1 text-[12px] text-[#6B7280]">
              Add a section on the left, then drop your card images in.
            </div>
          </div>
        ) : (
          feed.sections.map((s) => (
            <div key={s.id}>
              <SectionRenderer section={s} />
            </div>
          ))
        )}
      </div>

      {/* Sticky bottom nav */}
      <div className="shrink-0">
        <KlydoBottomNav />
      </div>
    </>
  );
}
