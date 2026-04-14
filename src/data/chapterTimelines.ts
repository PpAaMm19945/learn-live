/**
 * Pre-populated chapter timelines.
 * Each chapter has a full set of key events. The agent's show_timeline call
 * highlights the currently-discussed event by matching year/label.
 */

export interface TimelineEvent {
  year: number;
  label: string;
  color?: string;
}

const CH01_TIMELINE: TimelineEvent[] = [
  { year: -4004, label: 'Creation (Ussher Chronology)' },
  { year: -3800, label: 'The Fall of Man' },
  { year: -3500, label: 'Cain & Abel' },
  { year: -2348, label: 'The Great Flood' },
  { year: -2242, label: 'Tower of Babel' },
  { year: -2200, label: 'Dispersion of Nations' },
  { year: -2100, label: 'Mizraim settles Egypt' },
  { year: -2000, label: 'Cush settles Nubia' },
];

const CH02_TIMELINE: TimelineEvent[] = [
  { year: -3100, label: 'Unification of Egypt (Narmer)' },
  { year: -2686, label: 'Old Kingdom begins' },
  { year: -2560, label: 'Great Pyramid at Giza' },
  { year: -2055, label: 'Middle Kingdom begins' },
  { year: -1876, label: 'Joseph in Egypt' },
  { year: -1550, label: 'New Kingdom begins' },
  { year: -1446, label: 'The Exodus' },
  { year: -1070, label: 'Third Intermediate Period' },
];

const CHAPTER_TIMELINES: Record<string, TimelineEvent[]> = {
  ch01: CH01_TIMELINE,
  ch02: CH02_TIMELINE,
};

/**
 * Get the full timeline for a chapter.
 * Merges agent-provided events (highlighted) with the pre-populated base.
 */
export function getChapterTimeline(chapterId: string): TimelineEvent[] {
  return CHAPTER_TIMELINES[chapterId] || [];
}

/**
 * Merge agent-highlighted events with the full chapter timeline.
 * Agent events get their specified color; base events get a muted color.
 */
export function mergeTimeline(
  chapterId: string,
  agentEvents: TimelineEvent[]
): TimelineEvent[] {
  const base = getChapterTimeline(chapterId);
  if (base.length === 0) return agentEvents;

  // Build a set of agent-highlighted years
  const highlightedYears = new Set(agentEvents.map(e => e.year));

  return base.map(evt => {
    const agentMatch = agentEvents.find(a => a.year === evt.year);
    if (agentMatch) {
      return { ...evt, ...agentMatch, color: agentMatch.color || '#fac775' };
    }
    return {
      ...evt,
      color: highlightedYears.size > 0 ? '#8a8a8a55' : '#5dcaa5',
    };
  });
}
