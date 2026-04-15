import { describe, it, expect } from 'vitest';
import { buildNarrationPrompt, buildHistoryExplainerPrompt } from '../src/historyExplainerTools';

const BASE_TEXT = 'God created the heavens and the earth. This is the foundation of all history.';

describe('buildNarrationPrompt', () => {
  it('Band 0: enforces 35-word max, warm storyteller tone, blocked theology concepts', () => {
    const prompt = buildNarrationPrompt({
      baseText: BASE_TEXT,
      band: 0,
      beatIndex: 1,
      totalBeats: 5,
      isFirst: true,
      isLast: false,
      previousNarratedText: '',
    });

    expect(prompt).toContain('35');
    expect(prompt).toContain('Maximum');
    expect(prompt).toContain('3 sentences');
    expect(prompt).toContain('warm');
    expect(prompt).toContain('Storybook');
    // Theology gate blocks advanced concepts
    expect(prompt).toContain('Providence');
    expect(prompt).toContain('paraphrase around them');
    // No "STRONG, BOLD, AUTHORITATIVE"
    expect(prompt).not.toContain('STRONG, BOLD, AUTHORITATIVE');
  });

  it('Band 5: enforces 250-word max, professor tone, no blocked concepts', () => {
    const prompt = buildNarrationPrompt({
      baseText: BASE_TEXT,
      band: 5,
      beatIndex: 1,
      totalBeats: 5,
      isFirst: true,
      isLast: false,
      previousNarratedText: '',
    });

    expect(prompt).toContain('250');
    expect(prompt).toContain('Advanced Scholar');
    expect(prompt).toContain('STRONG, BOLD, AUTHORITATIVE');
    expect(prompt).toContain('distinguished professor');
    // No theology gate for band 5
    expect(prompt).not.toContain('paraphrase around them');
  });

  it('voice guard varies per band tier', () => {
    const p0 = buildNarrationPrompt({ baseText: BASE_TEXT, band: 0, beatIndex: 1, totalBeats: 3, isFirst: true, isLast: false, previousNarratedText: '' });
    const p2 = buildNarrationPrompt({ baseText: BASE_TEXT, band: 2, beatIndex: 1, totalBeats: 3, isFirst: true, isLast: false, previousNarratedText: '' });
    const p4 = buildNarrationPrompt({ baseText: BASE_TEXT, band: 4, beatIndex: 1, totalBeats: 3, isFirst: true, isLast: false, previousNarratedText: '' });

    // Band 0: warm/wonder, no "AUTHORITATIVE"
    expect(p0).toContain('warm');
    expect(p0).not.toContain('AUTHORITATIVE');

    // Band 2: confident/engaging
    expect(p2).toContain('confident');
    expect(p2).not.toContain('AUTHORITATIVE');

    // Band 4: AUTHORITATIVE
    expect(p4).toContain('AUTHORITATIVE');
  });
});

describe('buildHistoryExplainerPrompt', () => {
  it('produces distinct system instructions for all 6 bands', () => {
    const prompts = new Set<string>();
    for (let band = 0; band <= 5; band++) {
      const p = buildHistoryExplainerPrompt(BASE_TEXT, { name: 'Test', age: 10, band }, band);
      prompts.add(p);
      // Each prompt references its own band
      expect(p).toContain(`Band ${band}`);
    }
    // All 6 must be distinct
    expect(prompts.size).toBe(6);
  });

  it('Band 0: maps disabled, quotes blocked', () => {
    const p = buildHistoryExplainerPrompt(BASE_TEXT, { band: 0 }, 0);
    expect(p).toContain('Maps: DISABLED');
    expect(p).toContain('Quotes: NOT allowed');
    expect(p).toContain('Scripture: NOT allowed');
  });

  it('Band 5: full access, all theology concepts', () => {
    const p = buildHistoryExplainerPrompt(BASE_TEXT, { band: 5 }, 5);
    expect(p).toContain('Maps: enabled');
    expect(p).toContain('Quotes: allowed');
    expect(p).toContain('Full academic register');
  });
});
