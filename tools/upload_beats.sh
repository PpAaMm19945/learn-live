#!/bin/bash
# tools/upload_beats.sh
# Automates uploading beat manifests to Cloudflare R2 with hierarchical mapping.
#
# Investigated mapping:
# - Local: docs/curriculum/history/chXX_sYY.json (flat for dev efficiency)
# - Worker: Expects beats/:chapterId/:sectionId.json (via worker/src/routes/content.ts)
# - R2: Hierarchical storage (e.g., beats/ch01/s01.json) for long-term organization.

if [ -z "$1" ]; then
  echo "Usage: $0 <file_path_or_glob>"
  echo "Example: $0 docs/curriculum/history/ch01_s*.json"
  exit 1
fi

# Ensure account ID is set for non-interactive mode
if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
  echo "❌ Error: CLOUDFLARE_ACCOUNT_ID is not set."
  exit 1
fi

BUCKET="learnlive-assets-prod"

for filepath in "$@"; do
  filename=$(basename "$filepath")

  # Expected format: chXX_sYY.json
  if [[ $filename =~ ^(ch[0-9]{2})_(s[0-9]{2})\.json$ ]]; then
    chapterId="${BASH_REMATCH[1]}"
    sectionId="${BASH_REMATCH[2]}"
    destKey="beats/${chapterId}/${sectionId}.json"

    echo "---"
    echo "File: $filepath"
    echo "Dest: $BUCKET/$destKey"

    npx wrangler r2 object put "$BUCKET/$destKey" --file "$filepath" --remote

    if [ $? -eq 0 ]; then
      echo "✅ Successfully uploaded $filename"
    else
      echo "❌ Failed to upload $filename"
    fi
  else
    echo "⚠️  Skipping $filename: does not match pattern chXX_sYY.json"
  fi
done
