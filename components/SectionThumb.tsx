"use client";

import { useImageURL } from "./useImageURL";

export function SectionThumb({ id }: { id?: string }) {
  const url = useImageURL(id);
  if (!url) {
    return (
      <div className="w-full h-full rounded-md bg-[#1a1d28] grid place-items-center text-[10px] text-[#5a6173]">
        empty
      </div>
    );
  }
  return (
    <img
      src={url}
      alt=""
      className="w-full h-full object-cover rounded-md"
      draggable={false}
    />
  );
}
