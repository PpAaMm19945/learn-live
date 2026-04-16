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
echo "# Image Generation Log — Chapter 1 Redesign (Nano Banana 2)" > "$LOG_FILE"
echo "Date: $(date -u '+%Y-%m-%d %H:%M UTC')" >> "$LOG_FILE"
echo "Notes: Regenerated using Gemini 3.1 Flash Image Preview (Nano Banana 2)." >> "$LOG_FILE"
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

    MODEL="gemini-3.1-flash-image-preview"
    RESPONSE=$(curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}" \
      -H "Content-Type: application/json" \
      -d "$(jq -n --arg p "$PROMPT" '{
        contents: [{
          parts: [{
            text: $p
          }]
        }]
      }')")

    # Check for errors
    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
      ERROR=$(echo "$RESPONSE" | jq -r '.error.message')
      echo "    ❌ API Error: $ERROR"
      ((ATTEMPT++))
      sleep 5
      continue
    fi

    # Extract base64
    B64_DATA=$(echo "$RESPONSE" | jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data // empty')
    if [ -z "$B64_DATA" ] || [ "$B64_DATA" == "null" ]; then
        echo "    ❌ Error: No image data in response"
        ((ATTEMPT++))
        sleep 5
        continue
    fi

    RAW_FILE="$TMP_DIR/${FILENAME%.*}.raw"
    echo "$B64_DATA" | base64 --decode > "$RAW_FILE"

    # Process Image: Resize to 640x640 and save as JPG
    # We use quality=85 to reduce file size as requested
    if python3 -c "from PIL import Image; img = Image.open('$RAW_FILE'); img.resize((640, 640), Image.Resampling.LANCZOS).convert('RGB').save('$TMP_DIR/$FILENAME', 'JPEG', quality=85)"; then
        FILESIZE=$(du -h "$TMP_DIR/$FILENAME" | cut -f1)

        # Upload to R2
        if npx wrangler r2 object put "$R2_BUCKET/$R2KEY" --file="$TMP_DIR/$FILENAME" --remote > /dev/null 2>&1; then
          # Mandatory verification step
          if npx wrangler r2 object head "$R2_BUCKET/$R2KEY" --remote > /dev/null 2>&1; then
            echo "| $NUM | $FILENAME | $R2KEY | ✅ PASS | $FILESIZE | Attempt $ATTEMPT ($MODEL) |" >> "$LOG_FILE"
            echo "    ✅ Uploaded and Verified ($FILESIZE) using $MODEL"
            SUCCESS=true
            rm "$RAW_FILE"
            break
          else
            echo "    ❌ R2 Upload verification (head) failed"
          fi
        else
          echo "    ❌ R2 Upload failed"
        fi
    else
        echo "    ❌ Image processing failed"
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
