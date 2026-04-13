/**
 * SessionRuntimeStore — In-memory session cache for resume-in-place.
 * Keyed by `${canonicalLessonId}:${learnerId}:${band}`.
 * TTL: 20 minutes. GC every 5 minutes.
 */

import type { SectionManifest } from './content';

export interface SessionSnapshot {
  preparedManifest: SectionManifest;
  nextBeatIndex: number;
  previousNarratedText: string;
  completedBeatIds: string[];
  createdAt: number;
  expiresAt: number;
}

const STORE = new Map<string, SessionSnapshot>();
const TTL_MS = 20 * 60 * 1000; // 20 minutes
const GC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function sessionKey(canonicalLessonId: string, learnerId: string, band: number): string {
  return `${canonicalLessonId}:${learnerId}:${band}`;
}

export function getSession(key: string): SessionSnapshot | null {
  const snap = STORE.get(key);
  if (!snap) return null;
  if (Date.now() > snap.expiresAt) {
    STORE.delete(key);
    return null;
  }
  return snap;
}

export function setSession(key: string, manifest: SectionManifest): SessionSnapshot {
  const now = Date.now();
  const snap: SessionSnapshot = {
    preparedManifest: manifest,
    nextBeatIndex: 0,
    previousNarratedText: '',
    completedBeatIds: [],
    createdAt: now,
    expiresAt: now + TTL_MS,
  };
  STORE.set(key, snap);
  return snap;
}

export function checkpoint(key: string, beatIndex: number, narratedText: string, beatId: string): void {
  const snap = STORE.get(key);
  if (!snap) return;
  snap.nextBeatIndex = beatIndex + 1;
  snap.previousNarratedText = narratedText;
  if (!snap.completedBeatIds.includes(beatId)) {
    snap.completedBeatIds.push(beatId);
  }
  // Extend TTL on checkpoint
  snap.expiresAt = Date.now() + TTL_MS;
}

export function expireSession(key: string): void {
  STORE.delete(key);
}

// Garbage collect expired sessions
function gc() {
  const now = Date.now();
  for (const [key, snap] of STORE) {
    if (now > snap.expiresAt) {
      STORE.delete(key);
    }
  }
}

setInterval(gc, GC_INTERVAL_MS);
