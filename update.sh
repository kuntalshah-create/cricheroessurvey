#!/bin/bash

# CricHeroes Survey - Auto Update & Deploy Script
# This script automates the build, commit, and deploy process

echo "🚀 CricHeroes Survey - Auto Update & Deploy"
echo "==========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build
echo -e "${BLUE}Step 1: Building the project...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Build failed! Please fix errors and try again.${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Step 2: Commit
echo -e "${BLUE}Step 2: Committing changes...${NC}"
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
  echo -e "${YELLOW}⚠️  No changes to commit${NC}"
else
  # Prompt for commit message
  echo "Enter commit message (or press Enter for default):"
  read -p "> " COMMIT_MSG

  # Use default message if empty
  if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Update: Code changes and improvements"
  fi

  git commit -m "$COMMIT_MSG"

  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Commit failed!${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ Commit successful!${NC}"
  echo ""

  # Step 3: Push
  echo -e "${BLUE}Step 3: Pushing to GitHub...${NC}"
  git push origin main

  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Push failed!${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ Push successful!${NC}"
  echo ""

  echo -e "${GREEN}==========================================="
  echo "🎉 Deployment Complete!"
  echo "==========================================="
  echo "Vercel will auto-redeploy within 2-3 minutes."
  echo "Check your live survey at:"
  echo "https://cricheroes-survey.vercel.app"
  echo -e "${NC}"
fi
