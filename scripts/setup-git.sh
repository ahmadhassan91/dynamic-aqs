#!/bin/bash
# Git Setup Script for Dynamic AQS CRM
# This script initializes Git and sets up the remote repository

set -e  # Exit on any error

echo "🚀 Dynamic AQS CRM - Git Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Repository URL
REMOTE_URL="https://github.com/ahmadhassan91/dynamic-aqs.git"
BRANCH="main"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed!${NC}"
    echo "Please install Git first: https://git-scm.com/downloads"
    exit 1
fi

echo -e "${BLUE}📦 Git is installed${NC}"
echo ""

# Check if .git directory exists
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git repository already exists${NC}"
    echo "Current remote:"
    git remote -v
    echo ""
    read -p "Do you want to update the remote? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Check if remote 'origin' exists
        if git remote get-url origin &> /dev/null; then
            echo "Updating remote origin..."
            git remote set-url origin $REMOTE_URL
        else
            echo "Adding remote origin..."
            git remote add origin $REMOTE_URL
        fi
        echo -e "${GREEN}✅ Remote updated!${NC}"
    fi
else
    # Initialize Git
    echo -e "${BLUE}📝 Initializing Git repository...${NC}"
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
    echo ""

    # Add remote
    echo -e "${BLUE}🔗 Adding remote repository...${NC}"
    git remote add origin $REMOTE_URL
    echo -e "${GREEN}✅ Remote added: $REMOTE_URL${NC}"
    echo ""
fi

# Configure Git user if not set
if [ -z "$(git config user.name)" ]; then
    echo -e "${YELLOW}⚠️  Git user.name not set${NC}"
    read -p "Enter your name: " git_name
    git config user.name "$git_name"
    echo -e "${GREEN}✅ Git user.name set${NC}"
fi

if [ -z "$(git config user.email)" ]; then
    echo -e "${YELLOW}⚠️  Git user.email not set${NC}"
    read -p "Enter your email: " git_email
    git config user.email "$git_email"
    echo -e "${GREEN}✅ Git user.email set${NC}"
fi

echo ""
echo -e "${BLUE}📊 Current Git Configuration:${NC}"
echo "Name:  $(git config user.name)"
echo "Email: $(git config user.email)"
echo ""

# Check if there are unstaged changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}📝 Uncommitted changes detected${NC}"
    echo ""
    read -p "Do you want to stage and commit all changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Add all files
        echo -e "${BLUE}📦 Staging files...${NC}"
        git add .
        echo -e "${GREEN}✅ All files staged${NC}"
        echo ""

        # Show what will be committed
        echo -e "${BLUE}📋 Files to be committed:${NC}"
        git status --short
        echo ""

        # Commit
        read -p "Enter commit message (or press Enter for default): " commit_msg
        if [ -z "$commit_msg" ]; then
            commit_msg="Initial commit: Dynamic AQS CRM with commercial pages fixes"
        fi
        
        echo -e "${BLUE}💾 Creating commit...${NC}"
        git commit -m "$commit_msg"
        echo -e "${GREEN}✅ Committed successfully${NC}"
        echo ""
    fi
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    echo -e "${BLUE}🌿 Creating main branch...${NC}"
    git checkout -b main
    echo -e "${GREEN}✅ Main branch created${NC}"
    echo ""
elif [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Current branch: $CURRENT_BRANCH${NC}"
    read -p "Switch to main branch? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Check if main branch exists
        if git show-ref --verify --quiet refs/heads/main; then
            git checkout main
        else
            git checkout -b main
        fi
        echo -e "${GREEN}✅ Switched to main branch${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Git setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Review your changes: git status"
echo "2. Push to GitHub: git push -u origin main"
echo "   (You may need to use: git push -u origin main --force on first push)"
echo "3. Go to Netlify: https://app.netlify.com/"
echo "4. Import from GitHub: $REMOTE_URL"
echo "5. Set environment variables in Netlify dashboard"
echo ""
echo -e "${BLUE}🔗 Remote repository:${NC}"
git remote -v
echo ""
echo -e "${BLUE}📊 Repository status:${NC}"
git status
echo ""
