# Klydo Feed Preview

A live mobile mockup that mirrors the real Klydo Shop feed so your designer can see her cards in context the moment she drops them in — no waiting for backend pushes.

## Why

Designer makes feed images → currently waits for dev to push to staging to see them in the app → slow feedback loop. This tool removes the dev from that loop: drop images on the left, watch them render inside a pixel-replica phone on the right.

## What's in the box

- **Pixel-replica Klydo chrome** — exact header (01:30 delivery, search, bag, profile) and bottom nav (Discover · Shop · Categories) that stay fixed while the feed scrolls.
- **11 section layouts** with **exact production aspect ratios** matching Klydo's source-asset dimensions:
  - Banner — 1290×250 (thin top strip)
  - Hero — 1290×1614 (tall hero card)
  - Trends banner — 1200×864 (wide landscape carousel)
  - Looks banner — 720×864 (portrait composition for CELEBRITY LOOKS DROP)
  - 2-col big — 520×750
  - 2-col — 520×492
  - 3-col — 387×492
  - 4-col chips — for SHOP UNDER YOUR BUDGET
  - Mixed (2-col big + 3-col below)
  - Strip (one tall exported image)
  - Promo text
- **Swipeable carousels** — drop multiple images into a banner/hero/trends/looks section and it becomes a swipeable carousel with pagination dots (just like KLYDO'S NEWEST SALE DROP / TRENDS UNDER SALE / CELEBRITY LOOKS DROP in the real app).
- **Layout presets** — 4 pre-arranged feed templates that match real Klydo campaigns: Eid Sale Drop, Brand Drop Campaign, Celebrity Looks, Trends & Deals. One click loads the section arrangement; just drop images into the placeholders.
- **Custom card type** — pick your own width, height, and column count for one-off layouts the presets don't cover.
- **Download the whole feed as one image** — PNG or JPG, at 1x / 2x / 3x resolution, with or without phone frame. Captures the full feed top-to-bottom in a single tall image — perfect for design reviews, decks, and stakeholder presentations.
- **Raleway** — Klydo's brand font is loaded across the editor and the preview phone, so on-screen text matches what the real app looks like.
- **Drag-and-drop reorder** between sections, ↑↓ buttons for fine control, type-swap on the fly.
- **Multi-feed workspace** — save named drafts, switch between them, compare versions.
- **Live shareable URL** at `/preview/<feed-id>` for sending to devs/PMs.
- **Open on phone** — scan a QR to see the same feed on a real phone (same Wi-Fi for local; works anywhere once deployed).
- **Auto-saves** to your browser. No backend required.

## Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

To open the preview on a real phone over your local Wi-Fi:

```bash
npm run dev:lan
# Then on your phone, scan the QR from the "Open on phone" button.
# The URL will look like http://192.168.x.x:3000/preview/<id>
```

## Push to GitHub

```bash
cd "klydo feed generator"
git init
git add .
git commit -m "Initial Klydo feed preview"
gh repo create klydo-feed-preview --public --source=. --remote=origin --push
# or manually:
# git remote add origin https://github.com/<you>/klydo-feed-preview.git
# git push -u origin main
```

## Deploy to Vercel

The repo is Vercel-ready — `vercel.json` and `engines.node` are set, no env vars needed.

**Easiest:** go to [vercel.com/new](https://vercel.com/new), import the GitHub repo, click Deploy. Done.

**CLI:**

```bash
npm i -g vercel
vercel        # first time: link to project
vercel --prod # production deploy
```

Free tier is fine. Once deployed, the editor URL plus any `/preview/<id>` URL is shareable to anyone.

> ⚠️ Saved feeds currently live in **your browser** (IndexedDB for images, localStorage for layout). If you deploy and want shared cloud feeds across users, the next step is wiring in Supabase or Vercel KV. The data layer is isolated in `lib/storage.ts` so swapping is a small change.

## How your designer uses it

1. Click **+ Add section** → pick a layout (matches one of the real feed layouts).
2. Optionally type a section title (`PRICE DROP PICKS`, `LAST CALL BRAND STEALS`, etc.).
3. Drop one or many images into the slots. Each card image is the full design (text/prices baked in — the way it really works).
4. Drag sections to reorder. Use ↑↓ for nudges.
5. Click **Open on phone** → scan QR on her phone, or copy the URL and send it to a dev.
6. Auto-saves continuously. Click **+ New** for a fresh draft, **Saved** to switch between drafts.

## Mixing card-mode and strip-mode

The UX designer's full feed export goes in a **Strip** section (one tall image, renders at natural height). Individual cards go in **Grid / Hero / Banner / Mixed** sections. Mix freely — strip on top, individual cards below, etc.

## Project layout

```
app/
  page.tsx              # Editor + phone preview, side by side
  preview/[id]/page.tsx # Preview-only route (no editor)
  layout.tsx
  globals.css
components/
  PhoneFrame.tsx        # iPhone shell
  KlydoHeader.tsx       # Top of phone (replica)
  KlydoBottomNav.tsx    # Bottom of phone (replica)
  FeedRenderer.tsx      # Header + scrollable sections + nav
  SectionRenderer.tsx   # Renders one section by type
  SectionEditor.tsx     # Edits one section (left panel)
  EditorPanel.tsx       # Whole left side
  QRDialog.tsx          # "Open on phone" QR popup
  FeedImage.tsx         # Image-from-IDB with placeholder
  SectionThumb.tsx      # Small thumbnail (inside editor)
  icons.tsx             # All inline SVG icons
lib/
  types.ts              # Section / feed types
  storage.ts            # IndexedDB blobs + localStorage feeds
```

## Roadmap (easy wins next)

- Cloud storage so two people see the same feed → Supabase (~30 min).
- Export the phone preview as a single tall image (html2canvas).
- Snap-to-section navigation (jump to a section by clicking its editor card).
- Light/dark phone status bar toggle.
- More Klydo screens (Discover, Categories) under the bottom-nav tabs.
