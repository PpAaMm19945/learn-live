#!/bin/bash

# Ensure the script stops on first error
set -e

echo "========================================="
echo " Deploying Learn Live Agent to Cloud Run "
echo "========================================="

echo "Step 1: Submitting build to Google Cloud Build..."
gcloud builds submit --config=agent/cloudbuild.yaml

echo "========================================="
echo " Deployment Complete!"
echo " Check your Google Cloud Run dashboard for the resulting service URL."
echo "========================================="
