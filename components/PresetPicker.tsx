"use client";

import { PRESETS, Preset, instantiatePreset } from "@/lib/presets";
import { FeedDoc } from "@/lib/types";

export function PresetPicker({
  open,
  onClose,
  onPick,
  currentFeedHasSections,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (sections: ReturnType<typeof instantiatePreset>, mode: "replace" | "append") => void;
  currentFeedHasSections: boolean;
}) {
  if (!open) return null;

  function choose(p: Preset, mode: "replace" | "append") {
    onPick(instantiatePreset(p), mode);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <div
        className="panel p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[15px] font-bold text-white">Layout presets</div>
            <div className="text-[12px] text-[#9ca3af] mt-0.5">
              Pre-built feed arrangements that match Klydo's real campaign layouts.
              Drop your images into the placeholders after picking.
            </div>
          </div>
          <button className="ghost" onClick={onClose}>Close</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((p) => (
            <div key={p.id} className="panel-soft p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl leading-none">{p.glyph}</span>
                <div className="text-[14px] font-bold text-white">{p.name}</div>
              </div>
              <div className="text-[11px] text-[#9ca3af] mb-3 leading-snug">
                {p.tagline}
              </div>

              {/* Visual stack of section types */}
              <div className="flex flex-col gap-1 mb-3">
                {p.sections.map((s, i) => (
                  <div
                    key={i}
                    className="text-[10px] uppercase tracking-wide text-[#7a8294] flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#EC2D7C]" />
                    {s.title || s.type}
                  </div>
                ))}
              </div>

              <div className="mt-auto flex gap-2">
                {currentFeedHasSections && (
                  <button
                    className="ghost flex-1 !text-[12px]"
                    onClick={() => choose(p, "append")}
                  >
                    Append
                  </button>
                )}
                <button
                  className="primary flex-1 !text-[12px]"
                  onClick={() => choose(p, "replace")}
                >
                  {currentFeedHasSections ? "Replace" : "Use this"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
