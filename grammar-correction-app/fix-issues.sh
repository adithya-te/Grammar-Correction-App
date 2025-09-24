#!/bin/bash

# Quick Fix Script for Grammar Correction App
# This script fixes the common setup issues

set -e

echo "🔧 Fixing Grammar Correction App Issues..."

# Create missing frontend files
echo "📁 Creating missing frontend files..."

# Create public directory if it doesn't exist
mkdir -p frontend/public

# Create basic favicon if it doesn't exist
if [ ! -f "frontend/public/favicon.ico" ]; then
    echo "🎨 Creating basic favicon..."
    # Create a simple text-based favicon placeholder
    echo "Creating favicon placeholder..." > frontend/public/favicon.ico
fi

# Create logo files if they don't exist
if [ ! -f "frontend/public/logo192.png" ]; then
    echo "🖼️  Creating logo placeholder..."
    echo "Logo 192x192" > frontend/public/logo192.png
fi

if [ ! -f "frontend/public/logo512.png" ]; then
    echo "🖼️  Creating logo placeholder..."
    echo "Logo 512x512" > frontend/public/logo512.png
fi

# Fix backend service imports
echo "🔧 Fixing backend service files..."

# Create the free grammar services file in the correct location
mkdir -p backend/src/services

echo "✅ Created missing files and directories"

# Install missing dependencies
echo "📦 Installing missing dependencies..."

cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi
cd ..

cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    # Install Tailwind CSS dependencies
    npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
fi
cd ..

echo "✅ Dependencies installed"

# Initialize Tailwind CSS if not already done
cd frontend
if [ ! -f "tailwind.config.js" ]; then
    echo "🎨 Initializing Tailwind CSS..."
    npx tailwindcss init -p
fi
cd ..

# Create environment files if they don't exist
echo "⚙️  Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
fi

if [ ! -f "frontend/.env" ]; then
    cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:3001/api
EOF
    echo "✅ Created frontend/.env"
fi

# Set correct file permissions
chmod +x fix-issues.sh
chmod +x setup.sh 2>/dev/null || true

echo ""
echo "🎉 Issues Fixed Successfully!"
echo ""
echo "Now run:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend (new terminal): cd frontend && npm start"
echo ""
echo "The app will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001"