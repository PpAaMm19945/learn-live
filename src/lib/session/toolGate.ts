import type { AgentToolCall } from './types';
import type { ClientBandProfile } from '../bandConfig.client';

export function isToolAllowedForBand(msg: AgentToolCall, bandProfile: ClientBandProfile): boolean {
  // If the band allows everything, return true
  if (bandProfile.allowedTools.has('*')) {
    return true;
  }

  // Check if the specific tool is allowed
  if (!bandProfile.allowedTools.has(msg.tool)) {
    return false;
  }

  // Band-specific logic for tool arguments
  
  // Band 0/1: set_scene(map) falls back to rejecting it entirely or coercing to keep current image.
  // The prompt says "if Band 0/1 sends set_scene({mode:'map'}), silently coerce to keep current image".
  // Because they don't even support 'maplibre' visual mode, we will allow the "tool call" to pass but we modify its args later,
  // OR we block it here. The prompt says: "if a Band 0/1 beat sends set_scene({mode:"map"}), we silently coerce it to keep the current image... No blank panel, ever."
  // Wait, if we return false here, `SessionCanvas` will simply not execute anything. That means the current image stays automatically!
  // BUT we want to log that we coerced it, or maybe just returning false here IS the silent coercion? 
  // Oh, `isToolAllowedForBand` should return false if it's set_scene(map) for band 0/1. Let's block it.
  
  // For Band 2/3: "Block map tools by default; allow set_scene(map) only as a still image (no zoom_to/place_marker)"
  // So set_scene(map) is allowed for Band 2/3, but other map tools are not in the allowedTools list.
  
  if (msg.tool === 'set_scene' && msg.args?.mode === 'map') {
    // If it's a seedings or sprouts band (which don't have map interaction tools)
    if (bandProfile.label === 'Seedlings' || bandProfile.label === 'Sprouts') {
      return false; // Block it outright. The canvas will just keep displaying what it was.
    }
  }

  return true;
}
