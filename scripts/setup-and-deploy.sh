#!/bin/bash
# Complete setup and deployment script for Dynamic AQS CRM

set -e  # Exit on any error

echo "🚀 Dynamic AQS CRM - Complete Setup & Deployment"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: Git Setup
echo -e "${BLUE}Step 1: Git Setup${NC}"
echo "=================="
bash scripts/setup-git.sh

# Step 2: Build Test
echo ""
echo -e "${BLUE}Step 2: Testing Build${NC}"
echo "====================="
echo "Running production build to check for errors..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed! Please fix errors before deploying.${NC}"
    exit 1
fi

# Step 3: Push to GitHub
echo ""
echo -e "${BLUE}Step 3: Push to GitHub${NC}"
echo "======================"
read -p "Push to GitHub now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Check if there are commits
    if git log &> /dev/null; then
        echo "Pushing to GitHub..."
        # Try normal push first
        if git push -u origin main 2>&1 | grep -q "rejected"; then
            echo -e "${YELLOW}⚠️  Push rejected. This might be the first push.${NC}"
            read -p "Force push? (y/n) " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git push -u origin main --force
            fi
        else
            git push -u origin main
        fi
        echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
    else
        echo -e "${YELLOW}⚠️  No commits yet. Please commit your changes first.${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps for Netlify Deployment:${NC}"
echo ""
echo "1. Go to https://app.netlify.com/"
echo "2. Click 'Add new site' > 'Import an existing project'"
echo "3. Choose 'GitHub' as your Git provider"
echo "4. Select repository: ahmadhassan91/dynamic-aqs"
echo "5. Configure build settings:"
echo "   - Base directory: (leave empty)"
echo "   - Build command: npm run build"
echo "   - Publish directory: .next"
echo "6. Add environment variables (from .env.example)"
echo "7. Click 'Deploy site'"
echo ""
echo -e "${BLUE}🔗 Repository URL:${NC}"
echo "https://github.com/ahmadhassan91/dynamic-aqs"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "- Deployment Guide: docs/NETLIFY_DEPLOYMENT_GUIDE.md"
echo "- Project Structure: docs/PROJECT_STRUCTURE.md"
echo ""
