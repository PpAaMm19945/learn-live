#!/bin/bash
echo "Checking required secrets..."
npx wrangler secret list | grep -q "JWT_SECRET" && echo "✅ JWT_SECRET" || echo "❌ JWT_SECRET missing"
npx wrangler secret list | grep -q "Google_Client_ID" && echo "✅ Google_Client_ID" || echo "❌ Google_Client_ID missing"
npx wrangler secret list | grep -q "Google_Client_Secret" && echo "✅ Google_Client_Secret" || echo "❌ Google_Client_Secret missing"
npx wrangler secret list | grep -q "Resend_API_Key" && echo "✅ Resend_API_Key" || echo "❌ Resend_API_Key missing"
npx wrangler secret list | grep -q "GEMINI_API_KEY" && echo "✅ GEMINI_API_KEY" || echo "❌ GEMINI_API_KEY missing"
