"use client";

import { useImageURL } from "./useImageURL";

export function FeedImage({
  id,
  className = "",
  alt = "",
  placeholderLabel,
  fit = "cover",
}: {
  id?: string;
  className?: string;
  alt?: string;
  placeholderLabel?: string;
  fit?: "cover" | "natural";
}) {
  const url = useImageURL(id);

  if (!url) {
    return (
      <div
        className={`relative bg-gradient-to-br from-[#FFE4F0] to-[#F5EAFE] grid place-items-center text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide ${className}`}
      >
        <span>{placeholderLabel ?? "Add image"}</span>
      </div>
    );
  }
  if (fit === "natural") {
    return (
      <img
        src={url}
        alt={alt}
        className={`w-full h-auto block ${className}`}
        draggable={false}
      />
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      className={`object-cover w-full h-full ${className}`}
      draggable={false}
    />
  );
}
