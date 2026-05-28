"use client";

import { toPng, toJpeg } from "html-to-image";

export type DownloadFormat = "png" | "jpg";
export type DownloadScale = 1 | 2 | 3;

export interface DownloadOptions {
  format: DownloadFormat;
  scale: DownloadScale;
  filename: string;
}

export async function captureNode(
  node: HTMLElement,
  opts: DownloadOptions
): Promise<string> {
  const common = {
    pixelRatio: opts.scale,
    cacheBust: true,
    // Skip elements that fail (rare with local blobs)
    skipFonts: false,
    // Wait extra for images to settle
    fetchRequestInit: { cache: "no-cache" as RequestCache },
  };

  if (opts.format === "png") {
    return toPng(node, { ...common, backgroundColor: "#ffffff" });
  }
  return toJpeg(node, { ...common, backgroundColor: "#ffffff", quality: 0.95 });
}

export function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
