#!/bin/bash

# CustodyX.AI Netlify Deployment Setup Script
echo "🚀 Setting up CustodyX.AI for Netlify deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from your project root."
    exit 1
fi

echo "✅ Found package.json"

# Check if required files exist
echo "📋 Checking deployment files..."

if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml found"
else
    echo "❌ netlify.toml missing"
fi

if [ -f "public/_redirects" ]; then
    echo "✅ _redirects found"
else
    echo "❌ public/_redirects missing"
fi

if [ -f ".env.example" ]; then
    echo "✅ .env.example found"
else
    echo "❌ .env.example missing"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test build
echo "🔨 Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Built files are in the 'dist' directory"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Check for environment variables
echo "🔐 Environment variable checklist:"
echo "Make sure to set these in Netlify dashboard:"
echo "  - VITE_SUPABASE_URL"
echo "  - VITE_SUPABASE_ANON_KEY"
echo "  - GEMINI_API_KEY"
echo "  - API_KEY"

echo ""
echo "🎉 Setup complete! Your project is ready for Netlify deployment."
echo "📖 Read NETLIFY_DEPLOYMENT.md for detailed deployment instructions."
echo ""
echo "Quick deploy options:"
echo "1. Connect GitHub repo to Netlify (recommended)"
echo "2. Manual deploy: drag 'dist' folder to netlify.com"