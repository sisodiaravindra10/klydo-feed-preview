"use client";

import { useRef } from "react";
import { FeedSection, SectionType, SECTION_LABELS, SECTION_SLOTS, SECTION_DEFAULT_RADIUS } from "@/lib/types";
import { saveImage, deleteImage } from "@/lib/storage";
import { SectionThumb } from "./SectionThumb";

interface Props {
  section: FeedSection;
  onChange: (next: FeedSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  index: number;
  total: number;
}

export function SectionEditor({
  section,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  index,
  total,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const slotsConfig = SECTION_SLOTS[section.type];
  const maxSlots = slotsConfig === "many" ? Infinity : (slotsConfig as number);

  async function handleFiles(files: FileList | null, slot?: number) {
    if (!files || files.length === 0) return;
    const fileArr = Array.from(files);
    const newIds: string[] = [];
    for (const f of fileArr) {
      const id = await saveImage(f);
      newIds.push(id);
    }
    let next = [...section.imageIds];
    if (typeof slot === "number") {
      // Replace specific slot — delete old image if exists
      const old = next[slot];
      if (old) deleteImage(old).catch(() => {});
      next[slot] = newIds[0];
    } else {
      // Append
      if (slotsConfig === "many") {
        next = [...next, ...newIds];
      } else {
        // Single-image section: replace first
        if (next[0]) deleteImage(next[0]).catch(() => {});
        next = [newIds[0]];
      }
    }
    onChange({ ...section, imageIds: next.filter(Boolean) });
  }

  function removeSlot(slot: number) {
    const next = [...section.imageIds];
    const removedId = next[slot];
    next.splice(slot, 1);
    if (removedId) deleteImage(removedId).catch(() => {});
    onChange({ ...section, imageIds: next });
  }

  function changeType(t: SectionType) {
    let next = { ...section, type: t };
    const newSlots = SECTION_SLOTS[t];
    if (typeof newSlots === "number" && section.imageIds.length > newSlots) {
      // Trim extras
      const trimmed = section.imageIds.slice(0, newSlots);
      // Cleanup the leftover blobs
      section.imageIds.slice(newSlots).forEach((id) => deleteImage(id).catch(() => {}));
      next.imageIds = trimmed;
    }
    if (newSlots === 0) {
      // Promo-text — drop images
      section.imageIds.forEach((id) => deleteImage(id).catch(() => {}));
      next.imageIds = [];
    }
    onChange(next);
  }

  const renderSlots = () => {
    if (slotsConfig === 0) {
      return (
        <div className="mt-2 grid grid-cols-1 gap-2">
          <input
            type="text"
            placeholder="Line 1 — e.g. EID MUBARAK"
            value={section.promoLine1 ?? ""}
            onChange={(e) => onChange({ ...section, promoLine1: e.target.value })}
          />
          <input
            type="text"
            placeholder="Line 2 — e.g. 50-80% OFF"
            value={section.promoLine2 ?? ""}
            onChange={(e) => onChange({ ...section, promoLine2: e.target.value })}
          />
        </div>
      );
    }

    const displaySlots: (string | undefined)[] = slotsConfig === "many"
      ? section.imageIds.length
        ? section.imageIds
        : [undefined]
      : Array.from({ length: slotsConfig as number }, (_, i) => section.imageIds[i]);

    const cols = section.type === "grid-3" ? 4 : section.type === "mixed" ? 4 : 3;

    return (
      <div className={`mt-2 grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {displaySlots.map((id, i) => (
          <div key={i} className="relative aspect-square group">
            <label className="absolute inset-0 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files, i)}
              />
              <SectionThumb id={id} />
            </label>
            {id && (
              <button
                type="button"
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-[10px] grid place-items-center opacity-0 group-hover:opacity-100"
                onClick={() => removeSlot(i)}
                title="Remove"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {slotsConfig === "many" && (
          <button
            type="button"
            className="aspect-square rounded-md border border-dashed border-[#2a2f42] text-[#9ca3af] grid place-items-center text-xl hover:border-klydo-pink hover:text-klydo-pink"
            onClick={() => fileRef.current?.click()}
            title="Add image(s)"
          >
            +
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  };

  return (
    <div
      className="panel-soft p-3"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/section-id", section.id);
        (e.currentTarget as HTMLElement).classList.add("dragging");
      }}
      onDragEnd={(e) => {
        (e.currentTarget as HTMLElement).classList.remove("dragging");
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add("drag-over");
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove("drag-over");
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("drag-over");
        const draggedId = e.dataTransfer.getData("text/section-id");
        if (draggedId && draggedId !== section.id) {
          const ev = new CustomEvent("section-drop", {
            detail: { dragged: draggedId, target: section.id },
          });
          window.dispatchEvent(ev);
        }
      }}
    >
      <div className="flex items-center gap-2">
        <div className="cursor-grab text-[#5a6173] select-none" title="Drag to reorder">⋮⋮</div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5a6173]">
          #{index + 1}
        </span>
        <select
          value={section.type}
          onChange={(e) => changeType(e.target.value as SectionType)}
          className="!w-auto"
          style={{ flex: 1 }}
        >
          {Object.entries(SECTION_LABELS).map(([k, label]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          <button
            className="ghost !px-2 !py-1 !text-[11px]"
            onClick={onMoveUp}
            disabled={index === 0}
            title="Move up"
          >↑</button>
          <button
            className="ghost !px-2 !py-1 !text-[11px]"
            onClick={onMoveDown}
            disabled={index === total - 1}
            title="Move down"
          >↓</button>
          <button
            className="ghost danger !px-2 !py-1 !text-[11px]"
            onClick={onDelete}
            title="Delete section"
          >×</button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Section title (optional) — e.g. PRICE DROP PICKS"
        className="mt-2"
        value={section.title ?? ""}
        onChange={(e) => onChange({ ...section, title: e.target.value })}
      />

      {section.type !== "promo-text" && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[#7a8294] w-16 shrink-0">
            Corner
          </span>
          <input
            type="range"
            min={0}
            max={40}
            step={1}
            value={section.cornerRadius ?? SECTION_DEFAULT_RADIUS[section.type]}
            onChange={(e) =>
              onChange({ ...section, cornerRadius: parseInt(e.target.value, 10) })
            }
            className="flex-1 accent-[#EC2D7C]"
          />
          <span className="text-[11px] text-[#cfd4e0] font-mono w-10 text-right">
            {section.cornerRadius ?? SECTION_DEFAULT_RADIUS[section.type]}px
          </span>
          {typeof section.cornerRadius === "number" &&
            section.cornerRadius !== SECTION_DEFAULT_RADIUS[section.type] && (
              <button
                className="ghost !px-2 !py-1 !text-[10px]"
                onClick={() => onChange({ ...section, cornerRadius: undefined })}
                title="Reset to default"
              >
                ↺
              </button>
            )}
        </div>
      )}

      {section.type === "custom" && (
        <div className="mt-2 panel-soft p-2 grid grid-cols-12 gap-2 items-center">
          <span className="col-span-12 text-[10px] uppercase tracking-wider text-[#7a8294]">
            Card dimensions
          </span>
          <div className="col-span-4">
            <label className="text-[10px] text-[#9ca3af]">Width</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="800"
              value={section.customWidth ?? ""}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10);
                onChange({ ...section, customWidth: isNaN(n) ? undefined : n });
              }}
            />
          </div>
          <div className="col-span-4">
            <label className="text-[10px] text-[#9ca3af]">Height</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="600"
              value={section.customHeight ?? ""}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10);
                onChange({ ...section, customHeight: isNaN(n) ? undefined : n });
              }}
            />
          </div>
          <div className="col-span-4">
            <label className="text-[10px] text-[#9ca3af]">Columns</label>
            <select
              value={section.customCols ?? 1}
              onChange={(e) =>
                onChange({
                  ...section,
                  customCols: parseInt(e.target.value, 10) as 1 | 2 | 3 | 4,
                })
              }
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
        </div>
      )}

      {renderSlots()}
    </div>
  );
}
