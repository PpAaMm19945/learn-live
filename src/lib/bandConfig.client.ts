/**
 * Client-side band configuration for UI adaptation.
 * Lightweight subset of agent/src/bandConfig.ts — no server imports.
 */

export interface ClientBandProfile {
  /** Display label */
  label: string;
  /** Age range description */
  ageRange: string;

  /** Visual panel behavior */
  visuals: {
    /** Auto-scroll speed for chapter map (px/sec) */
    mapScrollSpeed: number;
    /** Max zoom level for AutoScrollMap */
    maxZoom: number;
    /** Image thumbnail size class */
    imageSizeClass: string;
    /** Whether image is centered (true) or top-right corner (false) */
    imageCentered: boolean;
    /** Whether to hide the auto-scrolling background map (for young learners) */
    hideBackgroundMap: boolean;
  };

  /** Overlay card rendering */
  overlays: {
    /** Base font size class for overlay text */
    fontSize: string;
    /** Queue transition delay in ms */
    queueDelayMs: number;
    /** Last-item auto-dismiss in ms */
    lastItemDismissMs: number;
    /** Show etymology on key terms */
    showEtymology: boolean;
    /** Show pronunciation on key terms */
    showPronunciation: boolean;
  };

  /** Transcript card rendering */
  transcript: {
    /** Font size class for card text */
    fontSize: string;
    /** Line height class */
    lineHeight: string;
    /** Font weight */
    fontWeight: string;
  };

  /** Interaction controls */
  interactivity: {
    /** Show mic button */
    showMic: boolean;
    /** Show raise-hand button */
    showRaiseHand: boolean;
    /** Cooldown after raise-hand in ms (0 = no cooldown) */
    raiseHandCooldownMs: number;
  };

  /** Tools this band is allowed to execute from the agent */
  allowedTools: Set<string>;
}

export const CLIENT_BAND_PROFILES: Record<number, ClientBandProfile> = {
  0: {
    label: 'Seedlings',
    ageRange: '4-5',
    visuals: {
      mapScrollSpeed: 6,
      maxZoom: 2,
      imageSizeClass: 'w-full h-full',
      imageCentered: true,
      hideBackgroundMap: true,
    },
    overlays: {
      fontSize: 'text-lg',
      queueDelayMs: 20000,
      lastItemDismissMs: 15000,
      showEtymology: false,
      showPronunciation: false,
    },
    transcript: {
      fontSize: 'text-2xl md:text-3xl',
      lineHeight: 'leading-relaxed',
      fontWeight: 'font-semibold',
    },
    interactivity: {
      showMic: false,
      showRaiseHand: false,
      raiseHandCooldownMs: 0,
    },
    allowedTools: new Set([
      'set_scene',
      'show_scripture',
      'show_key_term',
      'show_timeline',
      'show_question',
      'dismiss_overlay'
    ]),
  },
  1: {
    label: 'Sprouts',
    ageRange: '5-6',
    visuals: {
      mapScrollSpeed: 6,
      maxZoom: 2,
      imageSizeClass: 'w-full h-full',
      imageCentered: true,
      hideBackgroundMap: true,
    },
    overlays: {
      fontSize: 'text-lg',
      queueDelayMs: 20000,
      lastItemDismissMs: 15000,
      showEtymology: false,
      showPronunciation: false,
    },
    transcript: {
      fontSize: 'text-2xl md:text-3xl',
      lineHeight: 'leading-relaxed',
      fontWeight: 'font-semibold',
    },
    interactivity: {
      showMic: false,
      showRaiseHand: false,
      raiseHandCooldownMs: 0,
    },
    allowedTools: new Set([
      'set_scene',
      'show_scripture',
      'show_key_term',
      'show_timeline',
      'show_question',
      'dismiss_overlay'
    ]),
  },
  2: {
    label: 'Explorers',
    ageRange: '7-8',
    visuals: {
      mapScrollSpeed: 8,
      maxZoom: 2.5,
      imageSizeClass: 'w-64 md:w-80',
      imageCentered: true,
      hideBackgroundMap: false,
    },
    overlays: {
      fontSize: 'text-base',
      queueDelayMs: 20000,
      lastItemDismissMs: 15000,
      showEtymology: false,
      showPronunciation: false,
    },
    transcript: {
      fontSize: 'text-xl md:text-2xl',
      lineHeight: 'leading-relaxed',
      fontWeight: 'font-medium',
    },
    interactivity: {
      showMic: false,
      showRaiseHand: false,
      raiseHandCooldownMs: 0,
    },
    allowedTools: new Set([
      'set_scene',
      'show_scripture',
      'show_key_term',
      'show_timeline',
      'show_question',
      'dismiss_overlay',
      'show_slide',
      'show_figure',
      'show_comparison',
      'show_genealogy',
      'show_quote'
    ]),
  },
  3: {
    label: 'Navigators',
    ageRange: '9-11',
    visuals: {
      mapScrollSpeed: 10,
      maxZoom: 3,
      imageSizeClass: 'w-64 md:w-80',
      imageCentered: true,
      hideBackgroundMap: false,
    },
    overlays: {
      fontSize: 'text-base',
      queueDelayMs: 18000,
      lastItemDismissMs: 12000,
      showEtymology: false,
      showPronunciation: true,
    },
    transcript: {
      fontSize: 'text-lg md:text-xl',
      lineHeight: 'leading-relaxed',
      fontWeight: 'font-medium',
    },
    interactivity: {
      showMic: true,
      showRaiseHand: true,
      raiseHandCooldownMs: 90000,
    },
    allowedTools: new Set([
      'set_scene',
      'show_scripture',
      'show_key_term',
      'show_timeline',
      'show_question',
      'dismiss_overlay',
      'show_slide',
      'show_figure',
      'show_comparison',
      'show_genealogy',
      'show_quote'
    ]),
  },
  4: {
    label: 'Scholars',
    ageRange: '12-14',
    visuals: {
      mapScrollSpeed: 15,
      maxZoom: 4,
      imageSizeClass: 'w-44 md:w-52',
      imageCentered: false,
      hideBackgroundMap: false,
    },
    overlays: {
      fontSize: 'text-sm',
      queueDelayMs: 15000,
      lastItemDismissMs: 12000,
      showEtymology: true,
      showPronunciation: true,
    },
    transcript: {
      fontSize: 'text-lg md:text-xl',
      lineHeight: 'leading-normal',
      fontWeight: 'font-medium',
    },
    interactivity: {
      showMic: true,
      showRaiseHand: true,
      raiseHandCooldownMs: 0,
    },
    allowedTools: new Set([
      '*' // all tools allowed
    ]),
  },
  5: {
    label: 'Sages',
    ageRange: '15+',
    visuals: {
      mapScrollSpeed: 15,
      maxZoom: 4,
      imageSizeClass: 'w-44 md:w-52',
      imageCentered: false,
      hideBackgroundMap: false,
    },
    overlays: {
      fontSize: 'text-sm',
      queueDelayMs: 15000,
      lastItemDismissMs: 12000,
      showEtymology: true,
      showPronunciation: true,
    },
    transcript: {
      fontSize: 'text-lg md:text-xl',
      lineHeight: 'leading-normal',
      fontWeight: 'font-medium',
    },
    interactivity: {
      showMic: true,
      showRaiseHand: true,
      raiseHandCooldownMs: 0,
    },
    allowedTools: new Set([
      '*' // all tools allowed
    ]),
  },
};

export function getClientBandProfile(band: number): ClientBandProfile {
  return CLIENT_BAND_PROFILES[band] || CLIENT_BAND_PROFILES[3];
}
