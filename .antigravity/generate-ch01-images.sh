#!/bin/bash
# generate-ch01-images.sh
# Run from project root

set -euo pipefail

# Ensure gcloud and wrangler are accessible if needed
export PATH=$PATH:/tmp/google-cloud-sdk/bin

# Configuration
GEMINI_API_KEY=$(grep "GEMINI_API_KEY" agent/.env | cut -d'=' -f2)
R2_BUCKET="learnlive-assets-prod"
PROMPT_FILE=".antigravity/ch01_image_prompts.json"
LOG_FILE=".antigravity/jules_generation_log.md"
TMP_DIR="/tmp/learnlive-images"
export CLOUDFLARE_ACCOUNT_ID="4b9e1f0f3d5f50f35db086b8ae9431e1"

mkdir -p "$TMP_DIR"

# Truncate and start a fresh log
echo "# Image Generation Log — Chapter 1 Redesign" > "$LOG_FILE"
echo "Date: $(date -u '+%Y-%m-%d %H:%M UTC')" >> "$LOG_FILE"
echo "Notes: Regenerated with updated prompts focused on labels and photorealistic terrain." >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "| # | Filename | R2 Key | Status | File Size | Notes |" >> "$LOG_FILE"
echo "|---|----------|--------|--------|-----------|-------|" >> "$LOG_FILE"

# Read each entry from the JSON array
COUNT=$(jq length "$PROMPT_FILE")

for i in $(seq 0 $((COUNT - 1))); do
  FILENAME=$(jq -r ".[$i].filename" "$PROMPT_FILE")
  R2KEY=$(jq -r ".[$i].r2Key" "$PROMPT_FILE")
  PROMPT=$(jq -r ".[$i].prompt" "$PROMPT_FILE")
  NUM=$((i + 1))

  echo "[$NUM/$COUNT] Processing $FILENAME..."

  ATTEMPT=1
  MAX_ATTEMPTS=3
  SUCCESS=false

  while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "  Attempt $ATTEMPT/$MAX_ATTEMPTS..."

    # Prefer imagen-4.0-generate-001, fallback to imagen-4.0-fast-generate-001 on quota error
    MODEL="imagen-4.0-generate-001"
    RESPONSE=$(curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${GEMINI_API_KEY}" \
      -H "Content-Type: application/json" \
      -d "$(jq -n --arg p "$PROMPT" '{
        instances: [{prompt: $p}],
        parameters: {sampleCount: 1, aspectRatio: "1:1"}
      }')")

    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
      ERROR=$(echo "$RESPONSE" | jq -r '.error.message')
      if [[ "$ERROR" == *"Quota exceeded"* ]]; then
        echo "    ⚠️ Quota exceeded for $MODEL, falling back to fast model..."
        MODEL="imagen-4.0-fast-generate-001"
        RESPONSE=$(curl -s -X POST \
          "https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${GEMINI_API_KEY}" \
          -H "Content-Type: application/json" \
          -d "$(jq -n --arg p "$PROMPT" '{
            instances: [{prompt: $p}],
            parameters: {sampleCount: 1, aspectRatio: "1:1"}
          }')")
      fi
    fi

    # Check for errors again
    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
      ERROR=$(echo "$RESPONSE" | jq -r '.error.message')
      echo "    ❌ API Error: $ERROR"
      ((ATTEMPT++))
      sleep 5
      continue
    fi

    # Decode base64
    B64_DATA=$(echo "$RESPONSE" | jq -r '.predictions[0].bytesBase64Encoded // empty')
    if [ -z "$B64_DATA" ] || [ "$B64_DATA" == "null" ]; then
        echo "    ❌ Error: No image data in response"
        ((ATTEMPT++))
        sleep 5
        continue
    fi

    RAW_PNG="$TMP_DIR/${FILENAME%.*}.png"
    echo "$B64_DATA" | base64 --decode > "$RAW_PNG"

    # Process Image: Resize to 640x640 and convert to JPG
    python3 -c "from PIL import Image; Image.open('$RAW_PNG').resize((640, 640), Image.Resampling.LANCZOS).convert('RGB').save('$TMP_DIR/$FILENAME', 'JPEG', quality=90)"

    FILESIZE=$(du -h "$TMP_DIR/$FILENAME" | cut -f1)

    # Upload to R2
    if npx wrangler r2 object put "$R2_BUCKET/$R2KEY" --file="$TMP_DIR/$FILENAME" --remote > /dev/null 2>&1; then
      echo "| $NUM | $FILENAME | $R2KEY | ✅ PASS | $FILESIZE | Attempt $ATTEMPT ($MODEL) |" >> "$LOG_FILE"
      echo "    ✅ Uploaded ($FILESIZE) using $MODEL"
      SUCCESS=true
      rm "$RAW_PNG"
      break
    else
      echo "    ❌ R2 Upload failed"
    fi

    ((ATTEMPT++))
    sleep 5
  done

  if [ "$SUCCESS" = false ]; then
    echo "| $NUM | $FILENAME | $R2KEY | ❌ FAIL | — | Failed after $MAX_ATTEMPTS attempts |" >> "$LOG_FILE"
    echo "  ❌ FAILED permanently"
  fi

  # Rate limit
  sleep 2
done

echo ""
echo "Done! See $LOG_FILE for results."
