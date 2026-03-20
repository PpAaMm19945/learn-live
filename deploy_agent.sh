#!/bin/bash

# Ensure the script stops on first error
set -e

echo "========================================="
echo " Deploying Learn Live Agent to Cloud Run "
echo "========================================="

echo "Step 1: Submitting build to Google Cloud Build..."
gcloud builds submit --config=agent/cloudbuild.yaml

# Added for documentation as requested by Phase 15 Instance D instructions:
# The deploy script in agent/cloudbuild.yaml now includes:
# --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest

echo "========================================="
echo " Deployment Complete!"
echo " Check your Google Cloud Run dashboard for the resulting service URL."
echo "========================================="
