#!/bin/bash
# Quick deployment script for Netlify

echo "🚀 Dynamic AQS CRM - Netlify Deployment"
echo "========================================"
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found!"
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed!"
    echo ""
fi

# Check if user is logged in
echo "🔐 Checking Netlify authentication..."
if ! netlify status &> /dev/null; then
    echo "Please log in to Netlify:"
    netlify login
fi

echo ""
echo "🏗️  Building your Next.js application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📤 Deploying to Netlify..."
    echo ""
    netlify deploy --prod
    
    echo ""
    echo "🎉 Deployment complete!"
    echo "📝 Don't forget to:"
    echo "   1. Set environment variables in Netlify dashboard"
    echo "   2. Configure your database connection"
    echo "   3. Test the live site"
else
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi
