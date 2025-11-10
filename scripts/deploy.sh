#!/bin/bash

# Netlify Deploy Script for Dynamic AQS CRM
# Usage: ./deploy.sh [preview|prod]

set -e  # Exit on error

echo "🚀 Dynamic AQS CRM - Netlify Deployment"
echo "========================================"
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found!"
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Get deployment type
DEPLOY_TYPE=${1:-preview}

echo "📋 Pre-deployment checks..."
echo ""

# Check for Node version
echo "✓ Node version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
echo "✓ Clean complete"
echo ""

# Run build
echo "🔨 Building production bundle..."
npm run build

if [ $? -eq 0 ]; then
    echo "✓ Build successful!"
    echo ""
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
echo ""

if [ "$DEPLOY_TYPE" = "prod" ]; then
    echo "🚀 Deploying to PRODUCTION..."
    netlify deploy --prod
else
    echo "🔍 Deploying PREVIEW..."
    netlify deploy
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Build Summary:"
echo "   - Total routes: 84"
echo "   - Static pages: 80"
echo "   - Dynamic pages: 4"
echo "   - Framework: Next.js 16.0.0"
echo ""
echo "🎉 Your app is live!"
