"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export function QRDialog({
  open,
  onClose,
  feedId,
}: {
  open: boolean;
  onClose: () => void;
  feedId?: string;
}) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    const path = feedId ? `/preview/${feedId}` : "/";
    setUrl(`${window.location.origin}${path}`);
  }, [open, feedId]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <div
        className="panel p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[15px] font-bold text-white">Open on your phone</div>
            <div className="text-[12px] text-[#9ca3af] mt-0.5">
              Scan with your phone camera (same Wi-Fi for localhost)
            </div>
          </div>
          <button className="ghost" onClick={onClose}>Close</button>
        </div>

        <div className="bg-white p-5 rounded-xl grid place-items-center">
          {url && <QRCodeSVG value={url} size={220} level="M" />}
        </div>

        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-wider text-[#5a6173] mb-1">
            URL
          </div>
          <div className="panel-soft px-3 py-2 text-[12px] font-mono text-[#cfd4e0] break-all">
            {url}
          </div>
        </div>

        <div className="mt-4 text-[11px] text-[#9ca3af] leading-relaxed">
          <strong className="text-white">Note:</strong> images are stored in your browser
          only. To share the preview to a coworker or your phone over the internet,
          deploy to Vercel — saved feeds will sync to whoever opens the link.
        </div>
      </div>
    </div>
  );
}
