"use client";

import { useEffect, useState } from "react";
import {
  getActiveFeedId,
  loadFeeds,
  newFeed,
  setActiveFeedId,
  upsertFeed,
} from "@/lib/storage";
import { FeedDoc } from "@/lib/types";
import { EditorPanel } from "@/components/EditorPanel";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FeedRenderer } from "@/components/FeedRenderer";

export default function HomePage() {
  const [feed, setFeed] = useState<FeedDoc | null>(null);
  const [scale, setScale] = useState(1);

  // Bootstrap: load active or create a new feed
  useEffect(() => {
    const activeId = getActiveFeedId();
    const feeds = loadFeeds();
    if (activeId) {
      const found = feeds.find((f) => f.id === activeId);
      if (found) {
        setFeed(found);
        return;
      }
    }
    if (feeds.length > 0) {
      setFeed(feeds[0]);
      setActiveFeedId(feeds[0].id);
      return;
    }
    const fresh = newFeed("My first feed");
    upsertFeed(fresh);
    setActiveFeedId(fresh.id);
    setFeed(fresh);
  }, []);

  // Responsive phone scale — fit by whichever dimension is the bottleneck
  useEffect(() => {
    function recompute() {
      const h = window.innerHeight;
      const w = window.innerWidth;
      // Right column available width = total - editor (480px) - some padding
      const availW = Math.max(280, w - 480 - 80);
      const availH = Math.max(440, h - 140);
      const target = Math.min(1, availH / 844, availW / 390);
      setScale(Math.max(0.4, target));
    }
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  if (!feed) {
    return (
      <div className="h-screen grid place-items-center text-[#9ca3af] text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#0a0b10] text-[#e7eaf0]">
      {/* Left: Editor */}
      <aside className="w-[480px] shrink-0 border-r border-[#1f2230] flex flex-col">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] grid place-items-center text-white font-bold">
              K
            </div>
            <div>
              <div className="text-[14px] font-bold text-white">Klydo Feed Preview</div>
              <div className="text-[11px] text-[#5a6173]">
                Live mobile mockup for designers
              </div>
            </div>
          </div>
        </div>
        <EditorPanel feed={feed} setFeed={setFeed} />
      </aside>

      {/* Right: Phone canvas */}
      <main className="flex-1 relative overflow-hidden">
        {/* Grid backdrop */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #2a2f42 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(800px 400px at 50% 20%, rgba(236,72,153,0.08), transparent 60%)",
          }}
        />

        <div className="relative h-full flex flex-col items-center pt-8 pb-6 px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#7a8294]">
              Live preview
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          </div>
          <PhoneFrame scale={scale}>
            <FeedRenderer feed={feed} />
          </PhoneFrame>
        </div>
      </main>
    </div>
  );
}
