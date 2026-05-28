import React from "react";

export const KlydoStar = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <defs>
      <linearGradient id="kstar" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path
      d="M12 1.5l2.2 6.1L20.5 9l-4.9 4.2 1.6 6.4L12 16.4 6.8 19.6l1.6-6.4L3.5 9l6.3-1.4L12 1.5z"
      fill="url(#kstar)"
    />
    <circle cx="18" cy="5" r="1.2" fill="#F0AB00" />
    <circle cx="6.5" cy="3.5" r="0.8" fill="#F472B6" />
    <circle cx="4" cy="13" r="0.8" fill="#EC4899" />
  </svg>
);

export const PinIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <path
      d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z"
      stroke="#EC2D7C"
      strokeWidth="2"
    />
    <circle cx="12" cy="9" r="2.4" fill="#EC2D7C" />
  </svg>
);

export const BagIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <path
      d="M5 8h14l-1.2 11.2A2 2 0 0115.8 21H8.2a2 2 0 01-2-1.8L5 8z"
      stroke="#0F1117"
      strokeWidth="1.8"
    />
    <path d="M9 8V6a3 3 0 016 0v2" stroke="#0F1117" strokeWidth="1.8" />
  </svg>
);

export const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <circle cx="11" cy="11" r="6.5" stroke="#EC2D7C" strokeWidth="2" />
    <path d="M20 20l-3.5-3.5" stroke="#EC2D7C" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ProfileAvatar = ({ className = "w-9 h-9" }: { className?: string }) => (
  <div
    className={`${className} rounded-full grid place-items-center`}
    style={{
      background: "linear-gradient(135deg, #F472B6 0%, #EC4899 50%, #A855F7 100%)",
    }}
  >
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#fff">
      <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2z" />
    </svg>
  </div>
);

export const DiscoverIcon = ({ active = false }: { active?: boolean }) => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none" aria-hidden>
    <path
      d="M14 4l9 9-9 9-9-9 9-9z"
      stroke={active ? "#EC2D7C" : "#1F2937"}
      strokeWidth="1.8"
    />
    <path
      d="M11 13l3-3 3 3-3 5-3-5z"
      fill={active ? "#EC2D7C" : "#1F2937"}
    />
  </svg>
);

export const ShopIcon = ({ active = false }: { active?: boolean }) => (
  <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" aria-hidden>
    <defs>
      <linearGradient id="shopg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#E11D74" />
      </linearGradient>
    </defs>
    <path
      d="M6 12l1.5-4h17L26 12v2a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-2-2.6V12z"
      fill={active ? "url(#shopg)" : "none"}
      stroke={active ? "none" : "#1F2937"}
      strokeWidth="1.6"
    />
    <path
      d="M8 14v10h16V14"
      stroke={active ? "url(#shopg)" : "#1F2937"}
      strokeWidth="1.6"
    />
    <path d="M14 24v-5h4v5" stroke="#fff" strokeWidth="1.4" opacity={active ? 1 : 0} />
  </svg>
);

export const CategoriesIcon = ({ active = false }: { active?: boolean }) => (
  <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none" aria-hidden>
    {[0, 1, 2].map((row) =>
      [0, 1, 2].map((col) => (
        <circle
          key={`${row}-${col}`}
          cx={7 + col * 7}
          cy={7 + row * 7}
          r={1.6}
          fill={active ? "#EC2D7C" : "#1F2937"}
        />
      ))
    )}
  </svg>
);
