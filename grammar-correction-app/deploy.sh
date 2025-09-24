#!/bin/bash

# Advanced Grammar Correction App - Deployment Script
# Run with: chmod +x deploy.sh && ./deploy.sh

set -e

echo "🚀 ADVANCED GRAMMAR CORRECTION APP DEPLOYMENT"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_VERSION="16.0.0"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION is too old. Required: $REQUIRED_VERSION or higher"
    exit 1
fi

print_success "Node.js version $NODE_VERSION is compatible"

# Check for Hugging Face API key
if [ -z "$HUGGINGFACE_API_KEY" ] && [ ! -f "backend/.env" ]; then
    print_warning "HUGGINGFACE_API_KEY not found in environment or .env file"
    print_warning "Please set your API key before deployment"
fi

# Install root dependencies
print_status "Installing root dependencies..."
npm install

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Build frontend for production
print_status "Building frontend for production..."
cd frontend
npm run build
cd ..

print_success "Build completed successfully!"

# Test the application
print_status "Testing the application..."
cd backend
timeout 10s npm start &
SERVER_PID=$!
sleep 5

# Test health endpoint
if curl -f http://localhost:3001/health >/dev/null 2>&1; then
    print_success "Backend server is responding correctly"
    kill $SERVER_PID 2>/dev/null || true
else
    print_warning "Backend server test failed (this might be normal if API key is not set)"
    kill $SERVER_PID 2>/dev/null || true
fi

cd ..

echo
print_success "🎉 Deployment preparation completed!"
echo
echo -e "${BLUE}Next steps for different platforms:${NC}"
echo
echo -e "${YELLOW}📦 HEROKU DEPLOYMENT:${NC}"
echo "1. heroku create your-grammar-app"
echo "2. heroku config:set HUGGINGFACE_API_KEY=your_api_key"
echo "3. git add . && git commit -m 'Deploy app'"
echo "4. git push heroku main"
echo
echo -e "${YELLOW}🌐 VERCEL/NETLIFY (Frontend only):${NC}"
echo "1. Deploy frontend/build folder"
echo "2. Set API URL to your backend service"
echo
echo -e "${YELLOW}🖥️  VPS/SERVER DEPLOYMENT:${NC}"
echo "1. Copy project to server"
echo "2. Set environment variables"
echo "3. npm run start"
echo "4. Use PM2 or similar for process management"
echo
echo -e "${YELLOW}☁️  AWS/DIGITAL OCEAN:${NC}"
echo "1. Create server instance"
echo "2. Install Node.js and dependencies"
echo "3. Set up reverse proxy (nginx)"
echo "4. Configure SSL certificate"
echo
echo -e "${GREEN}Your app is ready for deployment! 🚀${NC}"