#!/bin/bash
# Script to verify that all required secrets are set for the Cloudflare Worker

REQUIRED_SECRETS=(
    "JWT_SECRET"
    "Google_Client_ID"
    "Google_Client_Secret"
    "Resend_API_Key"
    "GEMINI_API_KEY"
    "PILOT_INVITE_CODE"
)

echo "Fetching currently configured secrets via Wrangler..."
# Capture output of secret list. Using grep to filter lines that might just be formatting
SECRETS_JSON=$(npx wrangler secret list --json 2>/dev/null || echo "[]")

MISSING_SECRETS=0

for SECRET in "${REQUIRED_SECRETS[@]}"; do
    # Check if the secret name appears in the JSON output
    if echo "$SECRETS_JSON" | grep -q "\"name\":\"$SECRET\"" || echo "$SECRETS_JSON" | grep -q "\"name\": \"$SECRET\""; then
        echo "✅ $SECRET is configured."
    else
        echo "❌ $SECRET is missing!"
        MISSING_SECRETS=1
    fi
done

if [ "$MISSING_SECRETS" -eq 1 ]; then
    echo "⚠️  Some required secrets are missing. Please configure them before deploying:"
    echo "    npx wrangler secret put <SECRET_NAME>"
    exit 1
else
    echo "🎉 All required secrets are verified."
    exit 0
fi
