#!/usr/bin/env npx tsx
/**
 * lint-manifest.ts — Validates beat JSON manifests against band policy.
 *
 * Usage:
 *   cd agent && npx tsx scripts/lint-manifest.ts ../docs/curriculum/history/ch01_s01.json
 */

import fs from 'fs';
import path from 'path';
import { BAND_PROFILES, getBandProfile } from '../src/bandConfig';

interface ToolCall {
  tool: string;
  args: Record<string, any>;
  syncTrigger?: string;
}

interface Beat {
  beatId: string;
  sequence: number;
  title: string;
  contentText: string;
  sceneMode?: string;
  toolSequence: ToolCall[];
  bandOverrides?: Record<string, { contentText: string; toolSequence?: ToolCall[] }>;
}

interface Manifest {
  sectionId: string;
  chapterId: string;
  heading: string;
  totalBeats: number;
  beats: Beat[];
}

// ── Helpers ─────────────────────────────────────────────────────────
function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const VALID_SCENE_MODES = new Set(['transcript', 'map', 'image', 'overlay']);

interface Warning {
  beatId: string;
  band: number | 'all';
  severity: 'warn' | 'error';
  message: string;
}

// ── Main Lint ───────────────────────────────────────────────────────
function lintManifest(manifest: Manifest): Warning[] {
  const warnings: Warning[] = [];

  for (const beat of manifest.beats) {
    // 1. Validate sceneMode
    if (beat.sceneMode && !VALID_SCENE_MODES.has(beat.sceneMode)) {
      warnings.push({
        beatId: beat.beatId,
        band: 'all',
        severity: 'error',
        message: `Invalid sceneMode "${beat.sceneMode}". Valid: ${[...VALID_SCENE_MODES].join(', ')}`,
      });
    }

    // 2. Check each band
    for (let band = 0; band <= 5; band++) {
      const profile = getBandProfile(band);
      const blocked = new Set(profile.tools.blocked);

      // Resolve tool sequence for this band
      const tools = beat.bandOverrides?.[band.toString()]?.toolSequence ?? beat.toolSequence;
      const contentText = beat.bandOverrides?.[band.toString()]?.contentText ?? beat.contentText;

      // 2a. Blocked tool warnings
      for (const t of tools) {
        if (blocked.has(t.tool)) {
          warnings.push({
            beatId: beat.beatId,
            band,
            severity: 'warn',
            message: `Tool "${t.tool}" is blocked for Band ${band} (${profile.label}). Add a bandOverride or remove.`,
          });
        }

        // Map tools when maps disabled
        if (!profile.tools.mapToolsEnabled && ['zoom_to', 'highlight_region', 'draw_route', 'place_marker'].includes(t.tool)) {
          warnings.push({
            beatId: beat.beatId,
            band,
            severity: 'warn',
            message: `Map tool "${t.tool}" used but maps are disabled for Band ${band}.`,
          });
        }
      }

      // 2b. Array count checks
      for (const t of tools) {
        if (t.tool === 'show_timeline' && t.args?.events?.length > profile.tools.maxTimelineEvents) {
          warnings.push({
            beatId: beat.beatId,
            band,
            severity: 'warn',
            message: `show_timeline has ${t.args.events.length} events, Band ${band} max is ${profile.tools.maxTimelineEvents}.`,
          });
        }
        if (t.tool === 'show_genealogy' && t.args?.nodes?.length > profile.tools.maxGenealogyNodes) {
          warnings.push({
            beatId: beat.beatId,
            band,
            severity: 'warn',
            message: `show_genealogy has ${t.args.nodes.length} nodes, Band ${band} max is ${profile.tools.maxGenealogyNodes}.`,
          });
        }
        if (t.tool === 'show_comparison') {
          const countA = t.args?.columnA?.points?.length ?? 0;
          const countB = t.args?.columnB?.points?.length ?? 0;
          const max = Math.max(countA, countB);
          if (max > profile.tools.maxComparisonPoints) {
            warnings.push({
              beatId: beat.beatId,
              band,
              severity: 'warn',
              message: `show_comparison has ${max} points, Band ${band} max is ${profile.tools.maxComparisonPoints}.`,
            });
          }
        }
        if (t.tool === 'show_slide' && t.args?.bullets?.length > profile.tools.maxSlideBullets) {
          warnings.push({
            beatId: beat.beatId,
            band,
            severity: 'warn',
            message: `show_slide has ${t.args.bullets.length} bullets, Band ${band} max is ${profile.tools.maxSlideBullets}.`,
          });
        }
      }

      // 2c. Word count check
      const wc = wordCount(contentText);
      const maxWords = profile.narration.targetWordsPerBeat[1];
      if (wc > maxWords) {
        warnings.push({
          beatId: beat.beatId,
          band,
          severity: 'warn',
          message: `Content has ${wc} words, Band ${band} max is ${maxWords}. Add a bandOverride.`,
        });
      }
    }

    // 3. Complex tool sequences without young-band overrides
    if (beat.toolSequence.length >= 3) {
      for (let band = 0; band <= 2; band++) {
        if (!beat.bandOverrides?.[band.toString()]) {
          warnings.push({
            beatId: beat.beatId,
            band,
            severity: 'warn',
            message: `Beat has ${beat.toolSequence.length} tools but no bandOverride for Band ${band}.`,
          });
        }
      }
    }
  }

  return warnings;
}

// ── CLI Entry ───────────────────────────────────────────────────────
const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: npx tsx scripts/lint-manifest.ts <manifest.json>');
  process.exit(1);
}

const resolved = path.resolve(filePath);
if (!fs.existsSync(resolved)) {
  console.error(`File not found: ${resolved}`);
  process.exit(1);
}

const manifest: Manifest = JSON.parse(fs.readFileSync(resolved, 'utf-8'));
const warnings = lintManifest(manifest);

if (warnings.length === 0) {
  console.log('✅ No issues found.');
  process.exit(0);
}

// Group by beat
const byBeat = new Map<string, Warning[]>();
for (const w of warnings) {
  const arr = byBeat.get(w.beatId) || [];
  arr.push(w);
  byBeat.set(w.beatId, arr);
}

let errors = 0;
for (const [beatId, ws] of byBeat) {
  console.log(`\n── ${beatId} ──`);
  for (const w of ws) {
    const icon = w.severity === 'error' ? '❌' : '⚠️';
    const bandLabel = w.band === 'all' ? 'ALL' : `Band ${w.band}`;
    console.log(`  ${icon} [${bandLabel}] ${w.message}`);
    if (w.severity === 'error') errors++;
  }
}

console.log(`\n${warnings.length} issue(s) found (${errors} error(s), ${warnings.length - errors} warning(s)).`);
process.exit(errors > 0 ? 1 : 0);
