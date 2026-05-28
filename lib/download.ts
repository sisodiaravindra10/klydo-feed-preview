"use client";

import { toPng, toJpeg } from "html-to-image";

export type DownloadFormat = "png" | "jpg";
export type DownloadScale = 1 | 2 | 3;

export interface DownloadOptions {
  format: DownloadFormat;
  scale: DownloadScale;
  filename: string;
  /** Expected total number of images in the capture node (so we can wait for them to mount). */
  expectedImageCount: number;
  /** Optional progress callback ("loading images", "rendering", etc.) */
  onProgress?: (msg: string) => void;
}

/** 1×1 transparent PNG, used as a fallback when an image fails to embed. */
const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

/**
 * html-to-image rejects with Event objects (e.g. img onerror) — these
 * stringify to "[object Event]" which is useless. Extract something useful.
 */
export function describeError(err: unknown): string {
  if (err instanceof Error) return err.message || err.toString();
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "type" in err) {
    const e = err as Event & { target?: any };
    const t = e.target;
    const src = t?.src ?? t?.currentSrc ?? t?.href ?? "";
    const tag = t?.tagName ?? "node";
    return `${tag} ${e.type}: ${String(src).slice(0, 120)}`;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Wait for every <img> in the subtree to either finish loading or fail
 * (we don't want one broken image to deadlock the capture). Also waits
 * for the expected number of images to be mounted in the first place —
 * React + the useImageURL hook may not have inserted them yet when this
 * is called immediately after the dialog opens.
 */
async function waitForImages(root: HTMLElement, expected: number): Promise<void> {
  // Wait for the expected number of <img> tags to be in the DOM
  const t0 = Date.now();
  while (root.querySelectorAll("img").length < expected) {
    if (Date.now() - t0 > 3000) break; // give up after 3s, capture with whatever loaded
    await new Promise((r) => setTimeout(r, 80));
  }

  const imgs = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const done = () => {
          img.removeEventListener("load", done);
          img.removeEventListener("error", done);
          resolve();
        };
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
        // Safety timeout — never block forever
        setTimeout(done, 6000);
      });
    })
  );
}

/**
 * Wait for web fonts to be ready (Raleway via next/font/google).
 * Without this, the capture can render with a fallback font.
 */
async function waitForFonts(): Promise<void> {
  if (typeof document !== "undefined" && (document as any).fonts && (document as any).fonts.ready) {
    try {
      await (document as any).fonts.ready;
    } catch {
      /* noop */
    }
  }
}

export async function captureNode(
  node: HTMLElement,
  opts: DownloadOptions
): Promise<string> {
  opts.onProgress?.("Loading fonts…");
  await waitForFonts();

  opts.onProgress?.("Loading images…");
  await waitForImages(node, opts.expectedImageCount);

  // One more animation frame so layout settles after the images decode
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  // Tiny extra delay for safety in production builds
  await new Promise((r) => setTimeout(r, 100));

  opts.onProgress?.("Rendering…");

  // Use the node's actual rendered size. Without explicit width/height,
  // html-to-image sometimes captures with 0 dimensions when the node is
  // positioned off-screen or hidden via opacity.
  const rect = node.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width || node.scrollWidth));
  const height = Math.max(1, Math.round(rect.height || node.scrollHeight));

  const common = {
    pixelRatio: opts.scale,
    // IMPORTANT: cacheBust appends ?<ts> to URLs. Blob URLs don't support
    // query strings — appending one makes them invalid and every blob image
    // fails to embed, producing a blank-white capture. Keep this OFF.
    cacheBust: false,
    skipFonts: false,
    width,
    height,
    fetchRequestInit: { cache: "no-cache" as RequestCache },
    // If one image fails to embed, swap it for a transparent pixel
    // and keep going instead of rejecting the entire capture.
    imagePlaceholder: TRANSPARENT_PIXEL,
    // Cancel any inherited transforms/opacity from the offscreen wrapper.
    style: {
      transform: "none",
      opacity: "1",
      visibility: "visible",
    },
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
