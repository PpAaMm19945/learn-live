# Content Pipeline: Uploading Lesson Beats to R2

This document describes how to upload the beat JSON files to Cloudflare R2 so they can be served by the Worker API.

## Directory Structure in R2
The worker expects files in the `ASSETS_BUCKET` at the following path:
`beats/{chapterId}/{sectionId}.json`

Example:
`beats/ch01/s01.json`

## Uploading via Wrangler
You can use the `wrangler r2 object put` command to upload files.

```bash
# Example: Uploading Chapter 1 Section 1.1
npx wrangler r2 object put learnlive-assets/beats/ch01/s01.json --file=docs/curriculum/history/ch01_s01.json
```

## Local Development Fallback
If the `WORKER_API_URL` environment variable in the agent is set to `local`, the agent will skip the worker and load directly from the `docs/curriculum/history/` directory on the local filesystem.

## JSON Schema Validation
Ensure your beat JSON follows the `SectionManifest` and `Beat` interfaces defined in `agent/src/content.ts`.
- `toolSequence` must have `syncTrigger: "start_of_beat"`.
- `sceneMode` must be one of `transcript`, `map`, `image`, or `overlay`.
