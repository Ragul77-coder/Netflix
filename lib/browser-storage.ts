"use client";

import { useEffect, useState } from "react";
import { SEED_VIDEOS } from "@/lib/seed-videos";
import type { CurrentUser, UserRecord, VideoItem } from "@/lib/types";

const USERS_KEY = "dummyflix_users";
const USER_KEY = "dummyflix_current_user";
const VIDEOS_KEY = "dummyflix_videos";
const VIDEO_EVENT = "dummyflix:videos:changed";
const AUTH_EVENT = "dummyflix:auth:changed";

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

const DEMO_USER: UserRecord = {
  name: "Demo User",
  email: "demo@dummyflix.com",
  password: "demo1234",
};

function ensureDemoUser() {
  if (!canUseStorage()) return;
  const users = readJson<UserRecord[]>(USERS_KEY, []);
  const exists = users.some((u) => u.email.toLowerCase() === DEMO_USER.email);
  if (!exists) {
    writeJson(USERS_KEY, [DEMO_USER, ...users]);
  }
}

export function ensureVideosInitialized() {
  if (!canUseStorage()) {
    return;
  }

  const existing = readJson<VideoItem[]>(VIDEOS_KEY, []);
  if (existing.length === 0) {
    writeJson(VIDEOS_KEY, SEED_VIDEOS);
  }

  ensureDemoUser();
}

export function getVideos() {
  ensureVideosInitialized();
  return readJson<VideoItem[]>(VIDEOS_KEY, SEED_VIDEOS);
}

export function useVideoCatalog() {
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    const updateVideos = () => {
      setVideos(getVideos());
    };

    updateVideos();
    window.addEventListener(VIDEO_EVENT, updateVideos);

    return () => {
      window.removeEventListener(VIDEO_EVENT, updateVideos);
    };
  }, []);

  return videos;
}

export function addVideo(video: Omit<VideoItem, "id">) {
  const next: VideoItem = {
    ...video,
    id: `video-${Date.now()}`,
  };

  const videos = getVideos();
  writeJson(VIDEOS_KEY, [next, ...videos]);
  window.dispatchEvent(new Event(VIDEO_EVENT));

  return next;
}

function getUsers() {
  return readJson<UserRecord[]>(USERS_KEY, []);
}

function setUsers(users: UserRecord[]) {
  writeJson(USERS_KEY, users);
}

export function getCurrentUser() {
  return readJson<CurrentUser | null>(USER_KEY, null);
}

function setCurrentUser(user: CurrentUser | null) {
  if (!canUseStorage()) {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(USER_KEY);
  } else {
    writeJson(USER_KEY, user);
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function signupUser(input: UserRecord) {
  const users = getUsers();
  const existing = users.find((user) => user.email.toLowerCase() === input.email.toLowerCase());

  if (existing) {
    return { ok: false, message: "Email is already registered." };
  }

  const nextUsers = [...users, input];
  setUsers(nextUsers);
  setCurrentUser({ name: input.name, email: input.email });

  return { ok: true, message: "Account created." };
}

export function loginUser(email: string, password: string) {
  ensureDemoUser();
  const users = getUsers();
  const user = users.find(
    (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password,
  );

  if (!user) {
    return { ok: false, message: "Invalid email or password." };
  }

  setCurrentUser({ name: user.name, email: user.email });
  return { ok: true, message: "Welcome back." };
}

export function deleteVideo(id: string) {
  const videos = getVideos();
  const filtered = videos.filter((v) => v.id !== id);
  writeJson(VIDEOS_KEY, filtered);
  window.dispatchEvent(new Event(VIDEO_EVENT));
}

export function logoutUser() {
  setCurrentUser(null);
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const updateUser = () => {
      setUser(getCurrentUser());
    };

    updateUser();
    window.addEventListener(AUTH_EVENT, updateUser);

    return () => {
      window.removeEventListener(AUTH_EVENT, updateUser);
    };
  }, []);

  return user;
}
