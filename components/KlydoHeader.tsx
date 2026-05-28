"use client";

import { KlydoStar, PinIcon, BagIcon, SearchIcon, ProfileAvatar } from "./icons";

export function KlydoHeader() {
  return (
    <div className="bg-white pt-3 pb-3 px-4">
      {/* Top bar: logo + time + meta + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KlydoStar className="w-7 h-7 -mr-1" />
          <div className="flex items-baseline gap-1">
            <span
              className="text-[34px] leading-none font-extrabold tracking-tight"
              style={{ color: "#EC2D7C" }}
            >
              01
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold text-[#0F1117]">
                :30 PM <span className="text-[#0F1117]">Next delivery</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[#6B7280]">
                <PinIcon className="w-3 h-3" />
                Near you
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BagIcon />
          <ProfileAvatar />
        </div>
      </div>

      {/* Search bar */}
      <div className="mt-3 flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-3 shadow-sm">
        <div className="w-7 h-7 rounded-full bg-[#FFE4F0] grid place-items-center -ml-1">
          <SearchIcon className="w-4 h-4" />
        </div>
        <span className="text-[13px] text-[#6B7280]">Search party wear for men</span>
      </div>
    </div>
  );
}
