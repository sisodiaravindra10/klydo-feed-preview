"use client";

import { useEffect, useState } from "react";
import { getImage } from "@/lib/storage";

export function useImageURL(id?: string): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setUrl(null);
      return;
    }
    let active = true;
    let created: string | null = null;
    getImage(id).then((blob) => {
      if (!active || !blob) return;
      created = URL.createObjectURL(blob);
      setUrl(created);
    });
    return () => {
      active = false;
      if (created) URL.revokeObjectURL(created);
    };
  }, [id]);

  return url;
}
