#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BAND_PROFILES = {
  0: { narrationMax: 35, blocked: ['show_comparison', 'show_quote', 'show_genealogy', 'show_timeline', 'zoom_to', 'highlight_region', 'draw_route', 'place_marker'], maxTimelineEvents: 0, maxComparisonPoints: 0, maxGenealogyNodes: 0, maxSlideBullets: 1, mapToolsEnabled: false },
  1: { narrationMax: 55, blocked: ['show_comparison', 'show_quote', 'show_genealogy', 'highlight_region', 'draw_route'], maxTimelineEvents: 2, maxComparisonPoints: 0, maxGenealogyNodes: 0, maxSlideBullets: 2, mapToolsEnabled: false },
  2: { narrationMax: 85, blocked: ['show_quote'], maxTimelineEvents: 3, maxComparisonPoints: 2, maxGenealogyNodes: 4, maxSlideBullets: 3, mapToolsEnabled: true },
  3: { narrationMax: 120, blocked: [], maxTimelineEvents: 4, maxComparisonPoints: 3, maxGenealogyNodes: 6, maxSlideBullets: 4, mapToolsEnabled: true },
};

function truncateToMaxWords(text, maxWords) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return (text || '').trim();
  let out = words.slice(0, maxWords).join(' ');
  out = out.replace(/[,:;\-–—]+$/g, '');
  if (!/[.!?]$/.test(out)) out += '.';
  return out;
}

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function trimToolArgs(tool, limits) {
  const t = clone(tool);
  if (t.tool === 'show_timeline' && Array.isArray(t.args && t.args.events)) {
    t.args.events = t.args.events.slice(0, limits.maxTimelineEvents);
  }
  if (t.tool === 'show_genealogy' && Array.isArray(t.args && t.args.nodes)) {
    t.args.nodes = t.args.nodes.slice(0, limits.maxGenealogyNodes);
  }
  if (t.tool === 'show_comparison') {
    if (Array.isArray(t.args && t.args.columnA && t.args.columnA.points)) {
      t.args.columnA.points = t.args.columnA.points.slice(0, limits.maxComparisonPoints);
    }
    if (Array.isArray(t.args && t.args.columnB && t.args.columnB.points)) {
      t.args.columnB.points = t.args.columnB.points.slice(0, limits.maxComparisonPoints);
    }
  }
  if (t.tool === 'show_slide' && Array.isArray(t.args && t.args.bullets)) {
    t.args.bullets = t.args.bullets.slice(0, limits.maxSlideBullets);
  }
  return t;
}

function fallbackImage(chapterId, band, sequence) {
  if (chapterId === 'ch01') {
    if (band === 0) return `assets/storybook/ch01/band0_page${String(((sequence - 1) % 8) + 1).padStart(2, '0')}.jpg`;
    if (band === 1) return `assets/storybook/ch01/band1_page${String(((sequence - 1) % 15) + 1).padStart(2, '0')}.jpg`;
  }
  return `assets/storybook/${chapterId}/band${band}_page01.jpg`;
}

function buildOverride(manifest, beat, band) {
  const limits = BAND_PROFILES[band];
  const override = (beat.bandOverrides || {})[String(band)] || {};
  const baseText = override.contentText || beat.contentText;
  const baseTools = override.toolSequence || beat.toolSequence || [];

  const text = truncateToMaxWords(baseText, limits.narrationMax);
  let tools = baseTools
    .filter((t) => !limits.blocked.includes(t.tool))
    .filter((t) => limits.mapToolsEnabled || !['zoom_to', 'highlight_region', 'draw_route', 'place_marker'].includes(t.tool))
    .map((t) => trimToolArgs(t, limits));

  if (!limits.mapToolsEnabled) {
    const hasMapScene = tools.some((t) => t.tool === 'set_scene' && t.args && t.args.mode === 'map');
    if (hasMapScene) {
      tools = tools.map((t) => {
        if (t.tool !== 'set_scene' || !t.args || t.args.mode !== 'map') return t;
        return {
          ...t,
          args: {
            ...t.args,
            mode: 'image',
            imageUrl: t.args.imageUrl || fallbackImage(manifest.chapterId, band, beat.sequence),
          },
        };
      });
    }

    if (!tools.some((t) => t.tool === 'set_scene')) {
      tools.unshift({
        tool: 'set_scene',
        args: { mode: 'image', imageUrl: fallbackImage(manifest.chapterId, band, beat.sequence), caption: 'Story scene' },
        syncTrigger: 'start_of_beat',
      });
    }
  }

  if (!tools.length) {
    tools = [{
      tool: 'set_scene',
      args: { mode: 'image', imageUrl: fallbackImage(manifest.chapterId, band, beat.sequence), caption: 'Story scene' },
      syncTrigger: 'start_of_beat',
    }];
  }

  return { contentText: text, toolSequence: tools };
}

const args = process.argv.slice(2);
const write = args.includes('--write');
const files = args.filter((a) => a !== '--write');
if (!files.length) {
  console.error('Usage: node scripts/scaffold-band-overrides.js <manifest...> [--write]');
  process.exit(1);
}

for (const file of files) {
  const abs = path.resolve(file);
  const manifest = JSON.parse(fs.readFileSync(abs, 'utf8'));
  for (const beat of manifest.beats) {
    beat.bandOverrides = beat.bandOverrides || {};
    [0, 1, 2, 3].forEach((band) => {
      beat.bandOverrides[String(band)] = buildOverride(manifest, beat, band);
    });
  }
  if (write) fs.writeFileSync(abs, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`${write ? 'updated' : 'scaffolded'} ${abs}`);
}
