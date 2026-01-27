#!/bin/bash

# Script to run React Native app on physical iOS device
# This bypasses the React Native CLI Ruby/Bundler issues

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building and installing app on device...${NC}"

# Navigate to iOS directory
cd "$(dirname "$0")/ios"

# Device ID for "Damilola's iPhone"
DEVICE_ID="00008110-001A64221A47801E"

# Option 1: Build and install using xcodebuild
echo -e "${GREEN}Building app...${NC}"
xcodebuild -workspace blowpay_mobile.xcworkspace \
  -scheme blowpay_mobile \
  -configuration Debug \
  -destination "platform=iOS,id=${DEVICE_ID}" \
  build

# Install the app on device
echo -e "${GREEN}Installing app on device...${NC}"
xcodebuild -workspace blowpay_mobile.xcworkspace \
  -scheme blowpay_mobile \
  -configuration Debug \
  -destination "platform=iOS,id=${DEVICE_ID}" \
  install

echo -e "${GREEN}✓ App installed successfully!${NC}"
echo -e "${BLUE}Note: Start Metro bundler separately with: npm start${NC}"
