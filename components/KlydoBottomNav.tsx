"use client";

import { DiscoverIcon, ShopIcon, CategoriesIcon } from "./icons";

type Tab = "discover" | "shop" | "categories";

export function KlydoBottomNav({
  active = "shop",
  onChange,
}: {
  active?: Tab;
  onChange?: (t: Tab) => void;
}) {
  const item = (t: Tab, label: string, Icon: any, badge?: string) => {
    const isActive = active === t;
    return (
      <button
        type="button"
        onClick={() => onChange?.(t)}
        className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2"
      >
        <div className="relative">
          <Icon active={isActive} />
          {badge && (
            <span className="absolute -top-1 -right-3 text-[9px] font-bold px-1.5 py-[1px] rounded-full bg-[#EC2D7C] text-white">
              {badge}
            </span>
          )}
        </div>
        <span
          className="text-[11px] font-semibold"
          style={{ color: isActive ? "#EC2D7C" : "#0F1117" }}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-white border-t border-[#F1F2F6] px-4 pt-1 pb-3">
      <div className="flex items-stretch">
        {item("discover", "Discover", DiscoverIcon)}
        {item("shop", "Shop", ShopIcon)}
        {item("categories", "Categories", CategoriesIcon, "NEW")}
      </div>
    </div>
  );
}
