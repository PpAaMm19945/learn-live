

## Fix Map and WebSocket Connection

Two code changes needed to get testing working:

### 1. Add MapTiler API key to `.env.production`
Add `VITE_MAPTILER_KEY=ANd0GQwsnsg4NcFJKuZS` so the map tiles load. This is a publishable key (used client-side in browsers), so it is safe to store in the codebase.

### 2. Fix WebSocket path in `useWebSocketCanvas.ts`
Line 73: change `/ws/history-explainer` to `/v1/agent/history-explainer` to match what the deployed agent server expects.

### 3. MapTiler allowed origins
Your MapTiler key settings show two allowed origins. You should also add:
- `*.lovable.app` (for Lovable preview testing)
- Your production domain when you have one

Without these, MapTiler will reject tile requests from the Lovable preview.

### Technical details

**File: `.env.production`** — add line:
```
VITE_MAPTILER_KEY=ANd0GQwsnsg4NcFJKuZS
```

**File: `src/lib/canvas/useWebSocketCanvas.ts`** — line 73, change path from:
```
/ws/history-explainer?lesson=...
```
to:
```
/v1/agent/history-explainer?lesson=...
```

After these changes, redeploy to Cloudflare Pages so the new env vars are baked into the build.

