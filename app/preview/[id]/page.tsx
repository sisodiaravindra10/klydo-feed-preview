"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { loadFeeds } from "@/lib/storage";
import { FeedDoc } from "@/lib/types";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FeedRenderer } from "@/components/FeedRenderer";

export default function PreviewPage() {
  const params = useParams<{ id: string }>();
  const [feed, setFeed] = useState<FeedDoc | null>(null);
  const [scale, setScale] = useState(1);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const all = loadFeeds();
    const found = all.find((f) => f.id === params.id);
    setFeed(found ?? null);
  }, [params.id]);

  useEffect(() => {
    function recompute() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const phoneish = w < 500;
      setIsPhone(phoneish);
      if (phoneish) {
        const targetW = Math.min(w - 16, 390);
        setScale(targetW / 390);
      } else {
        const target = Math.min(1, (h - 60) / 844);
        setScale(Math.max(0.6, target));
      }
    }
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  if (feed === null) {
    return (
      <div className="h-screen grid place-items-center bg-[#0a0b10] text-[#9ca3af] text-sm p-6 text-center">
        Loading… (if this stays, the feed is only saved on the original browser —
        deploy this app to share)
      </div>
    );
  }

  return (
    <div className={`min-h-screen grid place-items-center bg-[#0a0b10] ${isPhone ? "p-2" : "p-6"}`}>
      <PhoneFrame scale={scale}>
        <FeedRenderer feed={feed} />
      </PhoneFrame>
    </div>
  );
}
