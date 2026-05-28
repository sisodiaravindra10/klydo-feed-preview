"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FeedDoc,
  FeedSection,
  SectionType,
  SECTION_LABELS,
} from "@/lib/types";
import {
  deleteFeed,
  deleteImage,
  loadFeeds,
  newFeed,
  setActiveFeedId,
  upsertFeed,
} from "@/lib/storage";
import { SectionEditor } from "./SectionEditor";
import { QRDialog } from "./QRDialog";
import { PresetPicker } from "./PresetPicker";
import { DownloadDialog } from "./DownloadDialog";

function makeSection(type: SectionType): FeedSection {
  return {
    id: `sec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    title: "",
    imageIds: [],
  };
}

export function EditorPanel({
  feed,
  setFeed,
}: {
  feed: FeedDoc;
  setFeed: (f: FeedDoc) => void;
}) {
  const [feeds, setFeeds] = useState<FeedDoc[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const debounceRef = useRef<number | null>(null);

  // Refresh saved feeds list
  const refreshFeeds = () => setFeeds(loadFeeds());
  useEffect(() => { refreshFeeds(); }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const stamped = { ...feed, updatedAt: Date.now() };
      upsertFeed(stamped);
      setActiveFeedId(stamped.id);
      setSavedAt(Date.now());
      refreshFeeds();
    }, 400) as unknown as number;
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(feed)]);

  // Handle section reorder via custom event from drag/drop
  useEffect(() => {
    function onDrop(e: Event) {
      const { dragged, target } = (e as CustomEvent).detail as {
        dragged: string;
        target: string;
      };
      const sections = [...feed.sections];
      const from = sections.findIndex((s) => s.id === dragged);
      const to = sections.findIndex((s) => s.id === target);
      if (from < 0 || to < 0) return;
      const [moved] = sections.splice(from, 1);
      sections.splice(to, 0, moved);
      setFeed({ ...feed, sections });
    }
    window.addEventListener("section-drop", onDrop as EventListener);
    return () => window.removeEventListener("section-drop", onDrop as EventListener);
  }, [feed, setFeed]);

  const sectionTypes: SectionType[] = useMemo(
    () => [
      "banner",
      "hero",
      "trends-banner",
      "looks-banner",
      "grid-2-big",
      "grid-2",
      "grid-3",
      "grid-4",
      "mixed",
      "strip",
      "custom",
      "promo-text",
    ],
    []
  );

  function addSection(type: SectionType) {
    setFeed({ ...feed, sections: [...feed.sections, makeSection(type)] });
    setShowAddMenu(false);
  }

  function updateSection(id: string, next: FeedSection) {
    setFeed({
      ...feed,
      sections: feed.sections.map((s) => (s.id === id ? next : s)),
    });
  }

  function removeSection(id: string) {
    const s = feed.sections.find((x) => x.id === id);
    if (s) s.imageIds.forEach((iid) => deleteImage(iid).catch(() => {}));
    setFeed({ ...feed, sections: feed.sections.filter((x) => x.id !== id) });
  }

  function moveSection(idx: number, dir: -1 | 1) {
    const next = [...feed.sections];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setFeed({ ...feed, sections: next });
  }

  function startNew() {
    const f = newFeed("Untitled feed");
    upsertFeed(f);
    setActiveFeedId(f.id);
    setFeed(f);
    refreshFeeds();
  }

  function open(f: FeedDoc) {
    setFeed(f);
    setActiveFeedId(f.id);
    setShowSaved(false);
  }

  function remove(id: string) {
    deleteFeed(id);
    refreshFeeds();
    if (id === feed.id) startNew();
  }

  function applyPreset(newSections: FeedSection[], mode: "replace" | "append") {
    if (mode === "replace") {
      // Clean up image blobs from the discarded sections
      feed.sections.forEach((s) => s.imageIds.forEach((iid) => deleteImage(iid).catch(() => {})));
      setFeed({ ...feed, sections: newSections });
    } else {
      setFeed({ ...feed, sections: [...feed.sections, ...newSections] });
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="p-3 border-b border-[#1f2230] space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={feed.name}
            onChange={(e) => setFeed({ ...feed, name: e.target.value })}
            placeholder="Feed name"
            className="flex-1 !text-[14px] !font-semibold"
          />
          <button className="ghost" onClick={() => setShowSaved((v) => !v)}>
            Saved ({feeds.length})
          </button>
          <button className="ghost" onClick={startNew}>+ New</button>
        </div>
        <div className="flex items-center gap-2">
          <button className="ghost flex-1" onClick={() => setShowPresets(true)}>
            ✦ Presets
          </button>
          <button className="ghost flex-1" onClick={() => setShowDownload(true)}>
            ↓ Download
          </button>
          <button className="primary flex-1" onClick={() => setShowQR(true)}>
            Open on phone
          </button>
        </div>
      </div>

      {/* Saved feeds dropdown panel */}
      {showSaved && (
        <div className="border-b border-[#1f2230] max-h-[260px] overflow-y-auto">
          {feeds.length === 0 ? (
            <div className="p-4 text-[12px] text-[#9ca3af]">No saved feeds yet.</div>
          ) : (
            feeds.map((f) => (
              <div
                key={f.id}
                className={`flex items-center gap-2 px-3 py-2 hover:bg-[#15182250] border-b border-[#1f2230]/50 ${
                  f.id === feed.id ? "bg-[#161924]" : ""
                }`}
              >
                <button
                  className="flex-1 text-left"
                  onClick={() => open(f)}
                >
                  <div className="text-[13px] font-semibold text-white truncate">
                    {f.name}
                  </div>
                  <div className="text-[10px] text-[#5a6173]">
                    {f.sections.length} sections · {new Date(f.updatedAt).toLocaleString()}
                  </div>
                </button>
                <button
                  className="ghost danger !px-2 !py-1 !text-[11px]"
                  onClick={() => remove(f.id)}
                  title="Delete feed"
                >×</button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sections list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {feed.sections.length === 0 ? (
          <div className="text-center py-10 text-[#5a6173] text-[13px]">
            Add a section below to begin →
          </div>
        ) : (
          feed.sections.map((s, i) => (
            <SectionEditor
              key={s.id}
              section={s}
              index={i}
              total={feed.sections.length}
              onChange={(next) => updateSection(s.id, next)}
              onDelete={() => removeSection(s.id)}
              onMoveUp={() => moveSection(i, -1)}
              onMoveDown={() => moveSection(i, 1)}
            />
          ))
        )}
      </div>

      {/* Add section bar */}
      <div className="border-t border-[#1f2230] p-3 relative">
        {showAddMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2 panel p-1 max-h-[300px] overflow-y-auto">
            {sectionTypes.map((t) => (
              <button
                key={t}
                className="w-full text-left px-3 py-2 text-[13px] hover:bg-[#1a1d28] rounded-md text-[#e7eaf0] flex items-center gap-2"
                onClick={() => addSection(t)}
              >
                <SectionGlyph type={t} />
                {SECTION_LABELS[t]}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            className="primary flex-1"
            onClick={() => setShowAddMenu((v) => !v)}
          >
            + Add section
          </button>
          <div className="text-[11px] text-[#5a6173]">
            {savedAt ? (
              <>Saved {timeAgo(savedAt)}</>
            ) : (
              <>Auto-saves to this browser</>
            )}
          </div>
        </div>
      </div>

      <QRDialog open={showQR} onClose={() => setShowQR(false)} feedId={feed.id} />
      <PresetPicker
        open={showPresets}
        onClose={() => setShowPresets(false)}
        currentFeedHasSections={feed.sections.length > 0}
        onPick={applyPreset}
      />
      <DownloadDialog open={showDownload} onClose={() => setShowDownload(false)} feed={feed} />
    </div>
  );
}

function timeAgo(t: number) {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return new Date(t).toLocaleTimeString();
}

function SectionGlyph({ type }: { type: SectionType }) {
  const stroke = "#9ca3af";
  return (
    <svg viewBox="0 0 24 16" className="w-5 h-4 shrink-0" fill="none" stroke={stroke} strokeWidth="1.4">
      {type === "banner" && <rect x="1" y="7" width="22" height="2" rx="0.5" />}
      {type === "hero" && <rect x="3" y="1" width="18" height="14" rx="2" />}
      {type === "trends-banner" && <rect x="1" y="3" width="22" height="10" rx="1.5" />}
      {type === "looks-banner" && <rect x="6" y="1" width="12" height="14" rx="1.5" />}
      {type === "grid-2-big" && (
        <>
          <rect x="1" y="1" width="10.5" height="14" rx="1.5" />
          <rect x="12.5" y="1" width="10.5" height="14" rx="1.5" />
        </>
      )}
      {type === "grid-2" && (
        <>
          <rect x="1" y="1" width="10" height="14" rx="1" />
          <rect x="13" y="1" width="10" height="14" rx="1" />
        </>
      )}
      {type === "grid-3" && (
        <>
          <rect x="1" y="1" width="6.6" height="14" rx="1" />
          <rect x="8.7" y="1" width="6.6" height="14" rx="1" />
          <rect x="16.4" y="1" width="6.6" height="14" rx="1" />
        </>
      )}
      {type === "grid-4" && (
        <>
          <rect x="1" y="3" width="4.8" height="10" rx="0.6" />
          <rect x="7" y="3" width="4.8" height="10" rx="0.6" />
          <rect x="13" y="3" width="4.8" height="10" rx="0.6" />
          <rect x="19" y="3" width="4.8" height="10" rx="0.6" />
        </>
      )}
      {type === "mixed" && (
        <>
          <rect x="1" y="1" width="10" height="9" rx="1" />
          <rect x="13" y="1" width="10" height="9" rx="1" />
          <rect x="1" y="11" width="6.6" height="4" rx="0.6" />
          <rect x="8.7" y="11" width="6.6" height="4" rx="0.6" />
          <rect x="16.4" y="11" width="6.6" height="4" rx="0.6" />
        </>
      )}
      {type === "strip" && (
        <>
          <rect x="6" y="1" width="12" height="14" rx="1" />
          <path d="M9 5l6 0M9 8l6 0M9 11l6 0" />
        </>
      )}
      {type === "custom" && (
        <>
          <rect x="3" y="3" width="18" height="10" rx="1" strokeDasharray="2 1.5" />
          <path d="M7 8h10M7 8l2-2M7 8l2 2M17 8l-2-2M17 8l-2 2" />
        </>
      )}
      {type === "promo-text" && (
        <>
          <path d="M2 5h20M4 11h16" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}
