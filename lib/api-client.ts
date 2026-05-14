"use client";

import { useCallback, useEffect, useState } from "react";
import type { CurrentUser, VideoItem } from "./types";

// ── Auth ────────────────────────────────────────────────────

export async function signupUser(input: { name: string; email: string; password: string }) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json() as Promise<{ ok: boolean; message: string; user?: CurrentUser }>;
}

export async function loginUser(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json() as Promise<{ ok: boolean; message: string; user?: CurrentUser }>;
}

export async function logoutUser() {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

// ── Videos ──────────────────────────────────────────────────

export async function fetchVideos(): Promise<VideoItem[]> {
  try {
    const res = await fetch("/api/videos");
    const data = await res.json();
    return data.videos || [];
  } catch {
    return [];
  }
}

export async function addVideo(video: Omit<VideoItem, "id">) {
  const res = await fetch("/api/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(video),
  });
  return res.json() as Promise<{ ok: boolean; video?: VideoItem }>;
}

export async function deleteVideo(id: string) {
  await fetch(`/api/videos/${id}`, { method: "DELETE" });
}

// ── Hooks ───────────────────────────────────────────────────

export function useVideoCatalog() {
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const refresh = useCallback(() => {
    fetchVideos().then(setVideos);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { videos, refresh };
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, loading, refresh };
}

// backward compat no-op
export function ensureVideosInitialized() {}
