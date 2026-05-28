"use client";

import { get, set, del, keys, createStore, type UseStore } from "idb-keyval";
import type { FeedDoc } from "./types";

let _imgStore: UseStore | null = null;
function imgStore(): UseStore {
  // Lazy: only create when actually called (client-only)
  if (!_imgStore) _imgStore = createStore("klydo-feed-images", "blobs");
  return _imgStore;
}

const FEEDS_KEY = "klydo-feeds-v1";
const ACTIVE_KEY = "klydo-active-feed-v1";

// ---------- IndexedDB: image blobs ----------
export async function saveImage(file: File | Blob): Promise<string> {
  const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await set(id, file, imgStore());
  return id;
}

export async function getImage(id: string): Promise<Blob | undefined> {
  return get<Blob>(id, imgStore());
}

export async function getImageURL(id: string): Promise<string | null> {
  const blob = await getImage(id);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export async function deleteImage(id: string): Promise<void> {
  await del(id, imgStore());
}

export async function listImageIds(): Promise<string[]> {
  return (await keys(imgStore())).map(String);
}

// ---------- localStorage: feed structure ----------
export function loadFeeds(): FeedDoc[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FEEDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveFeeds(feeds: FeedDoc[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FEEDS_KEY, JSON.stringify(feeds));
}

export function upsertFeed(feed: FeedDoc) {
  const feeds = loadFeeds();
  const idx = feeds.findIndex((f) => f.id === feed.id);
  if (idx >= 0) feeds[idx] = feed;
  else feeds.unshift(feed);
  saveFeeds(feeds);
}

export function deleteFeed(id: string) {
  const feeds = loadFeeds().filter((f) => f.id !== id);
  saveFeeds(feeds);
}

export function getActiveFeedId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_KEY);
}

export function setActiveFeedId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(ACTIVE_KEY, id);
  else window.localStorage.removeItem(ACTIVE_KEY);
}

export function newFeed(name = "Untitled feed"): FeedDoc {
  return {
    id: `feed_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    updatedAt: Date.now(),
    sections: [],
  };
}
