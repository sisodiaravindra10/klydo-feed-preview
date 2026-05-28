"use client";

import { ReactNode } from "react";

export function PhoneFrame({
  children,
  scale = 1,
}: {
  children: ReactNode;
  scale?: number;
}) {
  // Real iPhone 14 ratio. We render at logical 390x844 then optionally scale.
  return (
    <div
      className="relative shrink-0"
      style={{
        width: 390 * scale,
        height: 844 * scale,
      }}
    >
      <div
        className="absolute inset-0 origin-top-left"
        style={{ transform: `scale(${scale})`, width: 390, height: 844 }}
      >
        {/* Phone body */}
        <div
          className="relative w-[390px] h-[844px] rounded-[52px] bg-[#0a0a0c] shadow-phone"
          style={{ padding: 11 }}
        >
          {/* Subtle outer highlight */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[52px]"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          />

          {/* Inner screen */}
          <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-white flex flex-col">
            {/* Status bar */}
            <div className="relative h-[44px] shrink-0 bg-white">
              {/* Dynamic island */}
              <div
                className="absolute left-1/2 -translate-x-1/2 top-[10px] w-[110px] h-[32px] rounded-full bg-black"
                aria-hidden
              />
              <div className="flex justify-between items-center h-full px-7 text-[14px] font-semibold text-black">
                <span>9:41</span>
                <span className="flex items-center gap-1">
                  {/* Signal */}
                  <svg viewBox="0 0 16 10" className="w-4 h-3" fill="currentColor">
                    <rect x="0" y="6" width="2.4" height="4" rx="0.6" />
                    <rect x="3.6" y="4" width="2.4" height="6" rx="0.6" />
                    <rect x="7.2" y="2" width="2.4" height="8" rx="0.6" />
                    <rect x="10.8" y="0" width="2.4" height="10" rx="0.6" />
                  </svg>
                  {/* Wifi */}
                  <svg viewBox="0 0 16 12" className="w-4 h-3" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M1 4.5a10 10 0 0114 0" />
                    <path d="M3.5 7a6.5 6.5 0 019 0" />
                    <circle cx="8" cy="10" r="0.9" fill="currentColor" stroke="none" />
                  </svg>
                  {/* Battery */}
                  <svg viewBox="0 0 26 12" className="w-7 h-3" fill="none">
                    <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" />
                    <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" />
                    <rect x="23.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" />
                  </svg>
                </span>
              </div>
            </div>

            {children}
          </div>
        </div>

        {/* Reflection (subtle) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[52px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04), transparent 30%, transparent 70%, rgba(255,255,255,0.03))",
          }}
        />
      </div>
    </div>
  );
}
