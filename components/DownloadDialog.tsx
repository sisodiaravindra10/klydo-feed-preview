"use client";

import { useRef, useState } from "react";
import { FeedDoc } from "@/lib/types";
import { CaptureSurface } from "./CaptureSurface";
import {
  captureNode,
  triggerDownload,
  describeError,
  DownloadFormat,
  DownloadScale,
} from "@/lib/download";

export function DownloadDialog({
  open,
  onClose,
  feed,
}: {
  open: boolean;
  onClose: () => void;
  feed: FeedDoc;
}) {
  const [format, setFormat] = useState<DownloadFormat>("png");
  const [scale, setScale] = useState<DownloadScale>(2);
  const [frame, setFrame] = useState<"feed" | "phone">("feed");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  async function handleDownload() {
    if (!captureRef.current) return;
    setBusy(true);
    setErrorMsg(null);
    setProgress("Preparing…");
    try {
      const filename = `${feed.name.replace(/[^a-z0-9-_ ]/gi, "").trim() || "klydo-feed"}-${frame}${scale > 1 ? `@${scale}x` : ""}.${format}`;
      const expectedImageCount = feed.sections.reduce(
        (n, s) => n + s.imageIds.length,
        0
      );
      const dataUrl = await captureNode(captureRef.current, {
        format,
        scale,
        filename,
        expectedImageCount,
        onProgress: setProgress,
      });
      triggerDownload(dataUrl, filename);
      setProgress("Done");
      setTimeout(() => {
        setBusy(false);
        setProgress("");
      }, 600);
    } catch (err) {
      console.error("Capture failed:", err);
      setErrorMsg(describeError(err).slice(0, 280));
      setProgress("");
      setBusy(false);
    }
  }

  const sectionCount = feed.sections.length;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4"
        onClick={onClose}
      >
        <div
          className="panel p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[15px] font-bold text-white">Download feed</div>
              <div className="text-[12px] text-[#9ca3af] mt-0.5">
                Full-height image of all {sectionCount} section{sectionCount === 1 ? "" : "s"} in one shot.
              </div>
            </div>
            <button className="ghost" onClick={onClose} disabled={busy}>Close</button>
          </div>

          {/* Format */}
          <Row label="Format">
            <Pill active={format === "png"} onClick={() => setFormat("png")}>PNG</Pill>
            <Pill active={format === "jpg"} onClick={() => setFormat("jpg")}>JPG</Pill>
          </Row>

          {/* Resolution */}
          <Row label="Resolution">
            {([1, 2, 3] as DownloadScale[]).map((s) => (
              <Pill key={s} active={scale === s} onClick={() => setScale(s)}>
                {s}x
              </Pill>
            ))}
            <span className="text-[11px] text-[#7a8294] ml-2">
              {scale === 1 ? "Crisp" : scale === 2 ? "Sharp (recommended)" : "Print-grade"}
            </span>
          </Row>

          {/* Frame */}
          <Row label="Frame">
            <Pill active={frame === "feed"} onClick={() => setFrame("feed")}>Feed only</Pill>
            <Pill active={frame === "phone"} onClick={() => setFrame("phone")}>Phone frame</Pill>
          </Row>

          <button
            className="primary w-full mt-5"
            onClick={handleDownload}
            disabled={busy || sectionCount === 0}
          >
            {busy ? progress || "Working…" : `Download ${format.toUpperCase()} @ ${scale}x`}
          </button>

          {sectionCount === 0 && (
            <div className="mt-3 text-[12px] text-[#fb7185]">
              Add at least one section before downloading.
            </div>
          )}

          {errorMsg && (
            <div className="mt-3 panel-soft p-3 border-[#fb7185]/50">
              <div className="text-[11px] font-bold text-[#fb7185] mb-1">
                Download failed
              </div>
              <div className="text-[11px] text-[#cfd4e0] font-mono break-all">
                {errorMsg}
              </div>
              <div className="text-[10px] text-[#9ca3af] mt-2">
                Try a smaller resolution (1x), or open DevTools console for the full stack trace.
              </div>
            </div>
          )}

          <div className="mt-3 text-[10px] text-[#5a6173] leading-relaxed">
            Output is captured at native phone width (390px) × native source dimensions for each card,
            scaled by your chosen resolution. PNG keeps transparency, JPG is smaller.
          </div>
        </div>
      </div>

      {/* Hidden off-screen render — the actual source of the capture */}
      <CaptureSurface ref={captureRef} feed={feed} frame={frame} />
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-20 text-[11px] uppercase tracking-wider text-[#7a8294]">
        {label}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">{children}</div>
    </div>
  );
}

function Pill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
        active
          ? "bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white shadow-[0_4px_14px_rgba(236,72,153,0.3)]"
          : "bg-[#15182280] text-[#cfd4e0] border border-[#2a2f42] hover:border-klydo-pink"
      }`}
    >
      {children}
    </button>
  );
}
