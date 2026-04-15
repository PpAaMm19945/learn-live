# Jules Task: Generate Chapter 1 Band 2-5 Images and Upload to R2

## Overview
Generate 22 educational illustrations for Chapter 1 of the Learn Live African History curriculum.
- **14 images** in "DK Encyclopedia" style (for Bands 2-3, ages 8-13)
- **8 images** in "Documentary / Scholarly" style (for Bands 4-5, ages 14-18)

All images: **640×640 px square**, `.jpg` format.

## Prerequisites
- GCP project with **Imagen 3** API enabled (Vertex AI)
- `gcloud` CLI authenticated with billing-enabled project
- Cloudflare `wrangler` CLI with R2 write access (already configured)
- R2 bucket: `learnlive-assets-prod`

## IMPORTANT RULES
1. **Do NOT modify any source code files** — only generate images and upload to R2
2. **All work logs go in `.antigravity/jules_generation_log.md`** — not in the main docs
3. After upload, verify each image by doing a HEAD request on the R2 key
4. Report results in a table format

---

## Step-by-Step Instructions

### Step 1: Read the prompt data
Read the file `.antigravity/ch01_image_prompts.json` which contains all 22 image entries with prompts, negative prompts, and R2 keys.

### Step 2: Generate each image via Imagen 3

For each entry in the JSON, call the Vertex AI Imagen 3 API:

```bash
# Set your project
export PROJECT_ID="your-gcp-project-id"
export LOCATION="us-central1"

# For each image:
curl -X POST \
  "https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-3.0-generate-002:predict" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [
      {
        "prompt": "<PROMPT_FROM_JSON>"
      }
    ],
    "parameters": {
      "sampleCount": 1,
      "aspectRatio": "1:1",
      "sampleImageSize": 640,
      "negativePrompt": "<NEGATIVE_PROMPT_FROM_JSON>"
    }
  }'
```

### Step 3: Decode and save the image
The API returns base64-encoded image data in `predictions[0].bytesBase64Encoded`. Decode and save:

```bash
echo "<base64_data>" | base64 --decode > /tmp/band2_page01.jpg
```

### Step 4: Upload to R2
```bash
npx wrangler r2 object put "learnlive-assets-prod/<r2Key>" --file="/tmp/<filename>"
```

### Step 5: Verify upload
```bash
npx wrangler r2 object head "learnlive-assets-prod/<r2Key>"
```

### Step 6: Log results
Write results to `.antigravity/jules_generation_log.md` in this format:

```markdown
# Image Generation Log — Chapter 1 Bands 2-5
Date: <date>

| # | Filename | R2 Key | Status | File Size | Notes |
|---|----------|--------|--------|-----------|-------|
| 1 | band2_page01.jpg | assets/storybook/ch01/band2_page01.jpg | ✅ PASS | 245 KB | |
| 2 | band2_page02.jpg | assets/storybook/ch01/band2_page02.jpg | ✅ PASS | 312 KB | |
...
```

---

## Automation Script

You may use this bash script to automate the process:

```bash
#!/bin/bash
# generate-ch01-images.sh
# Run from project root

set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:?Set GCP_PROJECT_ID}"
LOCATION="us-central1"
R2_BUCKET="learnlive-assets-prod"
PROMPT_FILE=".antigravity/ch01_image_prompts.json"
LOG_FILE=".antigravity/jules_generation_log.md"
TMP_DIR="/tmp/learnlive-images"

mkdir -p "$TMP_DIR"

echo "# Image Generation Log — Chapter 1 Bands 2-5" > "$LOG_FILE"
echo "Date: $(date -u '+%Y-%m-%d %H:%M UTC')" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "| # | Filename | R2 Key | Status | File Size | Notes |" >> "$LOG_FILE"
echo "|---|----------|--------|--------|-----------|-------|" >> "$LOG_FILE"

# Read each entry from the JSON array
COUNT=$(jq length "$PROMPT_FILE")

for i in $(seq 0 $((COUNT - 1))); do
  FILENAME=$(jq -r ".[$i].filename" "$PROMPT_FILE")
  R2KEY=$(jq -r ".[$i].r2Key" "$PROMPT_FILE")
  PROMPT=$(jq -r ".[$i].prompt" "$PROMPT_FILE")
  NEG_PROMPT=$(jq -r ".[$i].negativePrompt" "$PROMPT_FILE")
  NUM=$((i + 1))

  echo "[$NUM/$COUNT] Generating $FILENAME..."

  # Call Imagen 3
  RESPONSE=$(curl -s -X POST \
    "https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-3.0-generate-002:predict" \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg p "$PROMPT" --arg np "$NEG_PROMPT" '{
      instances: [{prompt: $p}],
      parameters: {sampleCount: 1, aspectRatio: "1:1", sampleImageSize: 640, negativePrompt: $np}
    }')")

  # Check for errors
  if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
    ERROR=$(echo "$RESPONSE" | jq -r '.error.message')
    echo "| $NUM | $FILENAME | $R2KEY | ❌ FAIL | — | $ERROR |" >> "$LOG_FILE"
    echo "  ❌ FAILED: $ERROR"
    continue
  fi

  # Decode base64
  echo "$RESPONSE" | jq -r '.predictions[0].bytesBase64Encoded' | base64 --decode > "$TMP_DIR/$FILENAME"
  FILESIZE=$(du -h "$TMP_DIR/$FILENAME" | cut -f1)

  # Upload to R2
  if npx wrangler r2 object put "$R2_BUCKET/$R2KEY" --file="$TMP_DIR/$FILENAME" 2>/dev/null; then
    echo "| $NUM | $FILENAME | $R2KEY | ✅ PASS | $FILESIZE | |" >> "$LOG_FILE"
    echo "  ✅ Uploaded ($FILESIZE)"
  else
    echo "| $NUM | $FILENAME | $R2KEY | ❌ UPLOAD FAIL | $FILESIZE | R2 upload failed |" >> "$LOG_FILE"
    echo "  ❌ Upload failed"
  fi

  # Rate limit: 1 second between requests
  sleep 1
done

echo ""
echo "Done! See $LOG_FILE for results."
```

---

## Quality Checklist (for Jules)
After generation, spot-check at least 3 images from each tier:
- [ ] DK images have clean backgrounds and visible labels/annotations
- [ ] Documentary images have aged parchment texture and scholarly feel  
- [ ] All images are 640×640
- [ ] No text rendering errors (garbled labels are OK — the app overlays its own text)
- [ ] Dark-skinned figures depicted with warmth and dignity
- [ ] No anachronisms (no pyramids in pre-dynastic scenes, etc.)

If an image fails quality check, regenerate it with the same prompt (Imagen 3 is non-deterministic). Max 3 attempts per image before flagging for manual review.
