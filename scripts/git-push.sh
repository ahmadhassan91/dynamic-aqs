#!/bin/bash
# Quick Git setup and push script

echo "🚀 Dynamic AQS CRM - Git Setup & Push"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized!"
else
    echo "✅ Git already initialized"
fi

# Add remote if not exists
if ! git remote | grep -q "origin"; then
    echo "🔗 Adding remote origin..."
    git remote add origin https://github.com/ahmadhassan91/dynamic-aqs.git
    echo "✅ Remote added!"
else
    echo "✅ Remote already exists"
    echo "📝 Current remote:"
    git remote -v
fi

# Add all files
echo ""
echo "📝 Adding all files..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "Initial commit: Dynamic AQS CRM - Complete application with commercial pages, mobile app, and documentation"

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "🎉 Successfully pushed to GitHub!"
echo "📍 Repository: https://github.com/ahmadhassan91/dynamic-aqs"
echo ""
echo "Next steps:"
echo "1. Go to https://app.netlify.com"
echo "2. Click 'Add new site' → 'Import an existing project'"
echo "3. Choose GitHub and select 'ahmadhassan91/dynamic-aqs'"
echo "4. Netlify will auto-detect settings from netlify.toml"
echo "5. Add environment variables in Netlify dashboard"
echo "6. Deploy!"
