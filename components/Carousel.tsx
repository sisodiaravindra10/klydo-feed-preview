"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  count: number;
  /**
   * If true, dots are rendered overlapping the image at the bottom-center.
   * If false, dots render below the carousel.
   */
  dotsOverlay?: boolean;
  /**
   * Class name applied to each slide wrapper. Should size the slide to one screen-width.
   */
  slideClassName?: string;
  /**
   * Class name on the carousel container.
   */
  containerClassName?: string;
  children: ReactNode;
}

/**
 * Horizontal scroll-snap carousel with pagination dots. Designer can tap-drag
 * to flip through frames just like the real app.
 */
export function Carousel({
  count,
  dotsOverlay = true,
  slideClassName = "snap-start shrink-0 w-full",
  containerClassName = "",
  children,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!el) return;
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setActive(idx);
      });
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`relative ${containerClassName}`}>
      <div
        ref={scrollerRef}
        className="overflow-x-auto snap-x snap-mandatory flex phone-scroll"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Children are expected to be N slide elements */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={slideClassName}>
            {/* Slot: render the i-th child if children is an array, else render same children N times */}
            <SlotRenderer index={i}>{children}</SlotRenderer>
          </div>
        ))}
      </div>

      {count > 1 && (
        <div
          className={`flex items-center justify-center gap-1.5 ${
            dotsOverlay ? "absolute left-0 right-0 bottom-2" : "mt-2"
          }`}
          aria-hidden
        >
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all ${
                i === active
                  ? "bg-[#0F1117] w-2 h-2"
                  : "bg-[#0F1117]/30 w-1.5 h-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SlotRenderer({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  const arr = Array.isArray(children) ? children : [children];
  return <>{arr[index] ?? null}</>;
}
