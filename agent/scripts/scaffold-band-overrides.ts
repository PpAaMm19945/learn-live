#!/usr/bin/env npx tsx

import fs from 'fs';
import path from 'path';
import { BAND_PROFILES } from '../src/bandConfig';

type Json = Record<string, any>;

type ToolCall = {
  tool: string;
  args: Record<string, any>;
  syncTrigger?: string;
};

interface Beat {
  beatId: string;
  sequence: number;
  contentText: string;
  sceneMode?: string;
  toolSequence: ToolCall[];
  bandOverrides?: Record<string, { contentText: string; toolSequence?: ToolCall[] }>;
}

interface Manifest {
  chapterId: string;
  sectionId: string;
  beats: Beat[];
}

function usageAndExit(): never {
  console.error('Usage: npx tsx scripts/scaffold-band-overrides.ts <manifest...> [--write]');
  process.exit(1);
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function truncateToMaxWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text.trim();
  let out = words.slice(0, maxWords).join(' ');
  out = out.replace(/[,:;\-–—]+$/g, '');
  if (!/[.!?]$/.test(out)) out += '.';
  return out;
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function trimToolArgs(tool: ToolCall, band: number): ToolCall {
  const limits = BAND_PROFILES[band].tools;
  const t = clone(tool);

  if (t.tool === 'show_timeline' && Array.isArray(t.args?.events)) {
    t.args.events = t.args.events.slice(0, limits.maxTimelineEvents);
  }

  if (t.tool === 'show_genealogy' && Array.isArray(t.args?.nodes)) {
    t.args.nodes = t.args.nodes.slice(0, limits.maxGenealogyNodes);
  }

  if (t.tool === 'show_comparison') {
    if (Array.isArray(t.args?.columnA?.points)) {
      t.args.columnA.points = t.args.columnA.points.slice(0, limits.maxComparisonPoints);
    }
    if (Array.isArray(t.args?.columnB?.points)) {
      t.args.columnB.points = t.args.columnB.points.slice(0, limits.maxComparisonPoints);
    }
  }

  if (t.tool === 'show_slide' && Array.isArray(t.args?.bullets)) {
    t.args.bullets = t.args.bullets.slice(0, limits.maxSlideBullets);
  }

  return t;
}

function getFallbackImage(chapterId: string, band: number, sequence: number): string {
  if (chapterId === 'ch01') {
    if (band === 0) {
      const page = ((sequence - 1) % 8) + 1;
      return `assets/storybook/ch01/band0_page${String(page).padStart(2, '0')}.jpg`;
    }
    if (band === 1) {
      const page = ((sequence - 1) % 15) + 1;
      return `assets/storybook/ch01/band1_page${String(page).padStart(2, '0')}.jpg`;
    }
  }
  return `assets/storybook/${chapterId}/band${band}_page01.jpg`;
}

function buildOverride(manifest: Manifest, beat: Beat, band: number): { contentText: string; toolSequence: ToolCall[] } {
  const profile = BAND_PROFILES[band];
  const blockedTools = new Set(profile.tools.blocked);

  const baseOverride = beat.bandOverrides?.[String(band)];
  const baseText = baseOverride?.contentText ?? beat.contentText;
  const baseTools = baseOverride?.toolSequence ?? beat.toolSequence;

  const text = truncateToMaxWords(baseText, profile.narration.targetWordsPerBeat[1]);

  let tools = baseTools
    .filter((t) => !blockedTools.has(t.tool))
    .filter((t) => profile.tools.mapToolsEnabled || !['zoom_to', 'highlight_region', 'draw_route', 'place_marker'].includes(t.tool))
    .map((t) => trimToolArgs(t, band));

  const mapDisabled = !profile.tools.mapToolsEnabled;
  if (mapDisabled) {
    const hasMapScene = tools.some((t) => t.tool === 'set_scene' && t.args?.mode === 'map');
    if (hasMapScene) {
      tools = tools.map((t) => {
        if (t.tool !== 'set_scene' || t.args?.mode !== 'map') return t;
        return {
          ...t,
          args: {
            ...t.args,
            mode: 'image',
            imageUrl: t.args?.imageUrl || getFallbackImage(manifest.chapterId, band, beat.sequence),
          },
        };
      });
    }

    const hasSetScene = tools.some((t) => t.tool === 'set_scene');
    if (!hasSetScene) {
      tools.unshift({
        tool: 'set_scene',
        args: {
          mode: 'image',
          imageUrl: getFallbackImage(manifest.chapterId, band, beat.sequence),
          caption: 'Story scene',
        },
        syncTrigger: 'start_of_beat',
      });
    }
  }

  if (!tools.length) {
    tools = [{
      tool: 'set_scene',
      args: {
        mode: 'image',
        imageUrl: getFallbackImage(manifest.chapterId, band, beat.sequence),
        caption: 'Story scene',
      },
      syncTrigger: 'start_of_beat',
    }];
  }

  return {
    contentText: text,
    toolSequence: tools,
  };
}

function processManifest(filePath: string, write: boolean) {
  const abs = path.resolve(filePath);
  const manifest = JSON.parse(fs.readFileSync(abs, 'utf8')) as Manifest;

  let overrideCount = 0;
  let shortenedCount = 0;

  for (const beat of manifest.beats) {
    beat.bandOverrides = beat.bandOverrides || {};

    for (const band of [0, 1, 2, 3]) {
      const next = buildOverride(manifest, beat, band);
      const originalWords = wordCount(beat.bandOverrides[String(band)]?.contentText ?? beat.contentText);
      const newWords = wordCount(next.contentText);
      if (newWords < originalWords) shortenedCount++;
      beat.bandOverrides[String(band)] = next;
      overrideCount++;
    }
  }

  if (write) {
    fs.writeFileSync(abs, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  }

  return { abs, overrideCount, shortenedCount };
}

const args = process.argv.slice(2);
if (!args.length) usageAndExit();
const write = args.includes('--write');
const files = args.filter((a) => a !== '--write');
if (!files.length) usageAndExit();

for (const file of files) {
  const result = processManifest(file, write);
  console.log(`${write ? 'Updated' : 'Scaffolded'} ${result.abs}: ${result.overrideCount} overrides, ${result.shortenedCount} shortened texts.`);
}
