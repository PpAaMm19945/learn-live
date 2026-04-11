/**
 * Strips tool-call-like patterns and JSON command blocks from narrated text.
 * The Gemini narrator sometimes includes tool call syntax or full JSON
 * command arrays in its output.
 *
 * Patterns removed:
 *   - ```json ... ``` fenced code blocks
 *   - Bare JSON arrays/objects containing "command" keys
 *   - Inline function calls: set_scene("transcript"), show_scripture(...), etc.
 */

const TOOL_CALL_PATTERN = /\b(set_scene|dismiss_overlay|show_scripture|zoom_to|highlight_region|draw_route|place_marker|clear_canvas|show_figure|show_genealogy|show_timeline)\s*\([^)]*\)\s*/g;

/** Matches ```json ... ``` fenced blocks (with or without language tag) */
const FENCED_JSON_BLOCK = /```(?:json)?\s*\[[\s\S]*?\]\s*```/gi;

/** Matches bare JSON arrays that contain "command" keys (unfenced) */
const BARE_JSON_COMMAND_BLOCK = /\[\s*\{\s*"command"\s*:[\s\S]*?\}\s*\]/g;

/** Matches standalone JSON objects with "command" key */
const BARE_JSON_COMMAND_OBJ = /\{\s*"(?:command|actions)"\s*:[\s\S]*?\}\s*(?=\.|,|\s|$)/g;

/** Remove tool call text and JSON command blocks that leaked into narration */
export function stripToolCallText(text: string): string {
  return text
    .replace(FENCED_JSON_BLOCK, '')
    .replace(BARE_JSON_COMMAND_BLOCK, '')
    .replace(BARE_JSON_COMMAND_OBJ, '')
    .replace(TOOL_CALL_PATTERN, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
