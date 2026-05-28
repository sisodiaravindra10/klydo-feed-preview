"use client";

import { FeedSection, SECTION_DIMS } from "@/lib/types";
import { FeedImage } from "./FeedImage";
import { Carousel } from "./Carousel";

function aspect(dims: [number, number]): React.CSSProperties {
  return { aspectRatio: `${dims[0]} / ${dims[1]}` };
}

function SectionTitle({ title }: { title?: string }) {
  if (!title) return null;
  return (
    <h2 className="px-4 pt-5 pb-3 text-[18px] font-bold tracking-wide text-[#0F1117] uppercase">
      {title}
    </h2>
  );
}

function PromoText({ section }: { section: FeedSection }) {
  return (
    <div className="text-center py-5 px-4">
      <div className="text-[26px] font-extrabold klydo-grad-text leading-tight">
        {section.promoLine1 || "EID MUBARAK"}
        <span className="ml-1">🌙</span>
      </div>
      <div className="text-[24px] font-extrabold klydo-grad-text leading-tight">
        {section.promoLine2 || "50-80% OFF"}
      </div>
    </div>
  );
}

/** Single-image-or-carousel card with a fixed aspect derived from SECTION_DIMS. */
function CardOrCarousel({
  ids,
  dims,
  rounded,
  bg = "#FFF7EC",
  label,
}: {
  ids: (string | undefined)[];
  dims: [number, number];
  rounded: string;
  bg?: string;
  label: string;
}) {
  if (ids.length <= 1) {
    return (
      <div
        className={`overflow-hidden ${rounded}`}
        style={{ background: bg, ...aspect(dims) }}
      >
        <FeedImage id={ids[0]} placeholderLabel={label} />
      </div>
    );
  }
  return (
    <Carousel count={ids.length}>
      {ids.map((id, i) => (
        <div
          key={i}
          className={`overflow-hidden ${rounded}`}
          style={{ background: bg, ...aspect(dims) }}
        >
          <FeedImage id={id} placeholderLabel={`${label} ${i + 1}`} />
        </div>
      ))}
    </Carousel>
  );
}

function BannerSection({ section }: { section: FeedSection }) {
  const ids = section.imageIds.length ? section.imageIds : [undefined];
  return (
    <div className="px-4 pb-3">
      <SectionTitle title={section.title} />
      <CardOrCarousel ids={ids} dims={SECTION_DIMS.banner!} rounded="rounded-2xl" label="Banner" />
    </div>
  );
}

function HeroSection({ section }: { section: FeedSection }) {
  const ids = section.imageIds.length ? section.imageIds : [undefined];
  return (
    <div className="pb-3 px-4">
      <SectionTitle title={section.title} />
      <CardOrCarousel ids={ids} dims={SECTION_DIMS.hero!} rounded="rounded-3xl" label="Hero" />
    </div>
  );
}

function TrendsBannerSection({ section }: { section: FeedSection }) {
  const ids = section.imageIds.length ? section.imageIds : [undefined];
  return (
    <div className="pb-3 px-4">
      <SectionTitle title={section.title} />
      <CardOrCarousel
        ids={ids}
        dims={SECTION_DIMS["trends-banner"]!}
        rounded="rounded-2xl"
        label="Trends"
      />
    </div>
  );
}

function LooksBannerSection({ section }: { section: FeedSection }) {
  const ids = section.imageIds.length ? section.imageIds : [undefined];
  return (
    <div className="pb-3 px-4">
      <SectionTitle title={section.title} />
      <CardOrCarousel
        ids={ids}
        dims={SECTION_DIMS["looks-banner"]!}
        rounded="rounded-2xl"
        label="Looks"
      />
    </div>
  );
}

function GridSection({
  section,
  cols,
  dims,
  rounded,
  gap,
  defaultSlots,
}: {
  section: FeedSection;
  cols: 2 | 3 | 4;
  dims: [number, number];
  rounded: string;
  gap: string;
  defaultSlots: number;
}) {
  const ids = section.imageIds.length
    ? section.imageIds
    : Array.from({ length: defaultSlots }, () => undefined as undefined);
  const colsClass =
    cols === 2 ? "grid-cols-2" : cols === 3 ? "grid-cols-3" : "grid-cols-4";
  return (
    <div className="pb-4">
      <SectionTitle title={section.title} />
      <div className={`px-4 grid ${colsClass} ${gap}`}>
        {ids.map((id, i) => (
          <div
            key={i}
            className={`overflow-hidden bg-[#FFF7EC] shadow-card ${rounded}`}
            style={aspect(dims)}
          >
            <FeedImage id={id} placeholderLabel={`${i + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Grid2BigSection({ section }: { section: FeedSection }) {
  return (
    <GridSection
      section={section}
      cols={2}
      dims={SECTION_DIMS["grid-2-big"]!}
      rounded="rounded-2xl"
      gap="gap-3"
      defaultSlots={2}
    />
  );
}

function Grid2Section({ section }: { section: FeedSection }) {
  return (
    <GridSection
      section={section}
      cols={2}
      dims={SECTION_DIMS["grid-2"]!}
      rounded="rounded-2xl"
      gap="gap-3"
      defaultSlots={4}
    />
  );
}

function Grid3Section({ section }: { section: FeedSection }) {
  return (
    <GridSection
      section={section}
      cols={3}
      dims={SECTION_DIMS["grid-3"]!}
      rounded="rounded-xl"
      gap="gap-2.5"
      defaultSlots={3}
    />
  );
}

function Grid4Section({ section }: { section: FeedSection }) {
  return (
    <GridSection
      section={section}
      cols={4}
      dims={SECTION_DIMS["grid-4"]!}
      rounded="rounded-lg"
      gap="gap-2"
      defaultSlots={4}
    />
  );
}

function MixedSection({ section }: { section: FeedSection }) {
  // First 2 images = top row at 520x750 (big 2-grid)
  // Remaining = 3-column at 387x492
  const top = section.imageIds.slice(0, 2);
  const bottom = section.imageIds.slice(2);
  const topFilled: (string | undefined)[] =
    top.length === 2 ? top : [top[0], undefined];
  const bottomFilled: (string | undefined)[] =
    bottom.length > 0 ? bottom : [undefined, undefined, undefined];

  return (
    <div className="pb-4">
      <SectionTitle title={section.title} />
      <div className="px-4 grid grid-cols-2 gap-3">
        {topFilled.map((id, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden bg-[#FFF7EC] shadow-card"
            style={aspect(SECTION_DIMS["grid-2-big"]!)}
          >
            <FeedImage id={id} placeholderLabel={`Hero ${i + 1}`} />
          </div>
        ))}
      </div>
      <div className="mt-3 px-4 grid grid-cols-3 gap-2.5">
        {bottomFilled.map((id, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden bg-[#FFF7EC] shadow-card"
            style={aspect(SECTION_DIMS["grid-3"]!)}
          >
            <FeedImage id={id} placeholderLabel={`${i + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomSection({ section }: { section: FeedSection }) {
  const w = section.customWidth && section.customWidth > 0 ? section.customWidth : 800;
  const h = section.customHeight && section.customHeight > 0 ? section.customHeight : 600;
  const cols = section.customCols ?? 1;
  const ids = section.imageIds.length
    ? section.imageIds
    : Array.from({ length: cols }, () => undefined as undefined);
  const colsClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
      ? "grid-cols-2"
      : cols === 3
      ? "grid-cols-3"
      : "grid-cols-4";
  const gap = cols === 1 ? "gap-0" : cols === 2 ? "gap-3" : cols === 3 ? "gap-2.5" : "gap-2";
  const rounded =
    cols === 1
      ? "rounded-2xl"
      : cols === 2
      ? "rounded-2xl"
      : cols === 3
      ? "rounded-xl"
      : "rounded-lg";
  return (
    <div className="pb-4">
      <SectionTitle title={section.title} />
      <div className={`px-4 grid ${colsClass} ${gap}`}>
        {ids.map((id, i) => (
          <div
            key={i}
            className={`overflow-hidden bg-[#FFF7EC] shadow-card ${rounded}`}
            style={aspect([w, h])}
          >
            <FeedImage id={id} placeholderLabel={`${w}×${h}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StripSection({ section }: { section: FeedSection }) {
  const hasImage = !!section.imageIds[0];
  return (
    <div className="pb-2">
      <SectionTitle title={section.title} />
      <div className="w-full">
        {hasImage ? (
          <FeedImage id={section.imageIds[0]} fit="natural" />
        ) : (
          <div className="mx-4 rounded-2xl bg-gradient-to-br from-[#FFE4F0] to-[#F5EAFE] grid place-items-center h-[300px] text-[11px] font-semibold text-[#9CA3AF] uppercase">
            Strip image (full feed export)
          </div>
        )}
      </div>
    </div>
  );
}

export function SectionRenderer({ section }: { section: FeedSection }) {
  switch (section.type) {
    case "promo-text":
      return <PromoText section={section} />;
    case "banner":
      return <BannerSection section={section} />;
    case "hero":
      return <HeroSection section={section} />;
    case "trends-banner":
      return <TrendsBannerSection section={section} />;
    case "looks-banner":
      return <LooksBannerSection section={section} />;
    case "grid-2-big":
      return <Grid2BigSection section={section} />;
    case "grid-2":
      return <Grid2Section section={section} />;
    case "grid-3":
      return <Grid3Section section={section} />;
    case "grid-4":
      return <Grid4Section section={section} />;
    case "mixed":
      return <MixedSection section={section} />;
    case "strip":
      return <StripSection section={section} />;
    case "custom":
      return <CustomSection section={section} />;
  }
}
