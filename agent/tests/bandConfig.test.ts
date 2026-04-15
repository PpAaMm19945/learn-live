import { describe, it, expect } from 'vitest';
import { getBandProfile, BAND_PROFILES } from '../src/bandConfig';

// Re-implement applyBandToolPolicy here for isolated testing
// (mirrors agent/src/beatSequencer.ts logic exactly)
function applyBandToolPolicy(toolCalls: any[], band: number): any[] {
  const profile = getBandProfile(band);
  const blocked = new Set(profile.tools.blocked);
  let filtered = toolCalls.filter(t => !blocked.has(t.tool));

  if (!profile.tools.mapToolsEnabled) {
    filtered = filtered.map(t => {
      if (t.tool === 'set_scene' && t.args?.mode === 'map') {
        return { ...t, args: { ...t.args, mode: 'image' } };
      }
      return t;
    });
  }

  filtered = filtered.map(t => {
    if (t.tool === 'show_timeline' && t.args?.events) {
      return { ...t, args: { ...t.args, events: t.args.events.slice(0, profile.tools.maxTimelineEvents) } };
    }
    if (t.tool === 'show_genealogy' && t.args?.nodes) {
      return { ...t, args: { ...t.args, nodes: t.args.nodes.slice(0, profile.tools.maxGenealogyNodes) } };
    }
    if (t.tool === 'show_comparison') {
      const args = { ...t.args };
      if (args.columnA?.points) args.columnA = { ...args.columnA, points: args.columnA.points.slice(0, profile.tools.maxComparisonPoints) };
      if (args.columnB?.points) args.columnB = { ...args.columnB, points: args.columnB.points.slice(0, profile.tools.maxComparisonPoints) };
      return { ...t, args };
    }
    if (t.tool === 'show_slide' && t.args?.bullets) {
      return { ...t, args: { ...t.args, bullets: t.args.bullets.slice(0, profile.tools.maxSlideBullets) } };
    }
    if (t.tool === 'show_key_term' && profile.tools.simplifyKeyTerms) {
      const { etymology, pronunciation, ...rest } = t.args || {};
      return { ...t, args: rest };
    }
    return t;
  });

  return filtered;
}

// ── Rich input set ──────────────────────────────────────────────────
const RICH_TOOLS = [
  { tool: 'show_timeline', args: { events: Array.from({ length: 8 }, (_, i) => ({ year: -4004 + i * 100, label: `Event ${i + 1}` })) } },
  { tool: 'show_comparison', args: { columnA: { label: 'A', points: Array.from({ length: 6 }, (_, i) => `Point A${i + 1}`) }, columnB: { label: 'B', points: Array.from({ length: 6 }, (_, i) => `Point B${i + 1}`) } } },
  { tool: 'show_genealogy', args: { nodes: Array.from({ length: 12 }, (_, i) => ({ id: `n${i}`, label: `Person ${i + 1}` })) } },
  { tool: 'show_quote', args: { text: 'Test quote', attribution: 'Author' } },
  { tool: 'show_scripture', args: { reference: 'Gen 1:1', text: 'In the beginning...' } },
  { tool: 'zoom_to', args: { location: 'babel' } },
  { tool: 'draw_route', args: { from: 'babel', to: 'egypt', style: 'migration' } },
  { tool: 'set_scene', args: { mode: 'map' } },
  { tool: 'show_key_term', args: { term: 'Providence', definition: 'God governs all things', etymology: 'Latin providentia', pronunciation: 'PROV-ih-dence' } },
  { tool: 'show_slide', args: { title: 'Test', bullets: ['a', 'b', 'c', 'd', 'e', 'f'] } },
  { tool: 'highlight_region', args: { regionId: 'cush', color: '#fac775' } },
  { tool: 'place_marker', args: { location: 'babel', label: 'Babel' } },
];

describe('getBandProfile', () => {
  it('returns correct profile for valid bands', () => {
    expect(getBandProfile(0).label).toBe('Storybook');
    expect(getBandProfile(3).label).toBe('Investigator');
    expect(getBandProfile(5).label).toBe('Advanced Scholar');
  });

  it('clamps out-of-range bands', () => {
    expect(getBandProfile(-1).label).toBe('Storybook');
    expect(getBandProfile(99).label).toBe('Advanced Scholar');
    expect(getBandProfile(2.7).label).toBe('Investigator');
  });
});

describe('applyBandToolPolicy', () => {
  it('Band 0: strips maps, quotes, comparisons, genealogy; converts map scene to image; simplifies key terms', () => {
    const result = applyBandToolPolicy(RICH_TOOLS, 0);
    expect(result.find(t => t.tool === 'zoom_to')).toBeUndefined();
    expect(result.find(t => t.tool === 'draw_route')).toBeUndefined();
    expect(result.find(t => t.tool === 'highlight_region')).toBeUndefined();
    expect(result.find(t => t.tool === 'place_marker')).toBeUndefined();
    expect(result.find(t => t.tool === 'show_quote')).toBeUndefined();
    expect(result.find(t => t.tool === 'show_comparison')).toBeUndefined();
    expect(result.find(t => t.tool === 'show_genealogy')).toBeUndefined();
    expect(result.find(t => t.tool === 'show_timeline')).toBeUndefined();

    // set_scene(map) → set_scene(image)
    const scene = result.find(t => t.tool === 'set_scene');
    expect(scene?.args.mode).toBe('image');

    // key term simplified
    const keyTerm = result.find(t => t.tool === 'show_key_term');
    expect(keyTerm?.args.etymology).toBeUndefined();
    expect(keyTerm?.args.pronunciation).toBeUndefined();
    expect(keyTerm?.args.term).toBe('Providence');
  });

  it('Band 2: no quotes, timeline truncated to 3, comparison to 2', () => {
    const result = applyBandToolPolicy(RICH_TOOLS, 2);
    expect(result.find(t => t.tool === 'show_quote')).toBeUndefined();

    const timeline = result.find(t => t.tool === 'show_timeline');
    expect(timeline?.args.events).toHaveLength(3);

    const comparison = result.find(t => t.tool === 'show_comparison');
    expect(comparison?.args.columnA.points).toHaveLength(2);
    expect(comparison?.args.columnB.points).toHaveLength(2);

    // Maps ARE enabled for band 2
    expect(result.find(t => t.tool === 'zoom_to')).toBeDefined();
  });

  it('Band 5: all tools pass through with full counts', () => {
    const result = applyBandToolPolicy(RICH_TOOLS, 5);
    expect(result).toHaveLength(RICH_TOOLS.length);

    const timeline = result.find(t => t.tool === 'show_timeline');
    expect(timeline?.args.events).toHaveLength(8);

    const genealogy = result.find(t => t.tool === 'show_genealogy');
    expect(genealogy?.args.nodes).toHaveLength(12);

    const comparison = result.find(t => t.tool === 'show_comparison');
    expect(comparison?.args.columnA.points).toHaveLength(5);

    // key term NOT simplified
    const keyTerm = result.find(t => t.tool === 'show_key_term');
    expect(keyTerm?.args.etymology).toBe('Latin providentia');
  });

  it('snapshots all 6 bands', () => {
    for (let band = 0; band <= 5; band++) {
      const result = applyBandToolPolicy(RICH_TOOLS, band);
      expect(result).toMatchSnapshot(`band-${band}-filtered-tools`);
    }
  });
});
