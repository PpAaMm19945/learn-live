/**
 * Strips tool-call-like patterns from narrated text.
 * The Gemini narrator sometimes includes tool call syntax in its output
 * when tool names are mentioned in the system prompt.
 * 
 * Patterns removed:
 *   set_scene("transcript")
 *   dismiss_overlay()
 *   show_scripture(...)
 *   zoom_to(...)
 *   highlight_region(...)
 *   draw_route(...)
 *   place_marker(...)
 *   clear_canvas()
 *   show_figure(...)
 *   show_genealogy(...)
 *   show_timeline(...)
 */

const TOOL_CALL_PATTERN = /\b(set_scene|dismiss_overlay|show_scripture|zoom_to|highlight_region|draw_route|place_marker|clear_canvas|show_figure|show_genealogy|show_timeline)\s*\([^)]*\)\s*/g;

/** Remove tool call text that leaked into narration */
export function stripToolCallText(text: string): string {
  return text
    .replace(TOOL_CALL_PATTERN, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
