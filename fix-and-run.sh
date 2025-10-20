#!/bin/bash

echo "🔧 Movie Streaming Platform - Setup Script"
echo "=========================================="

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running"
    echo ""
    echo "Please choose an option:"
    echo "1. Install MongoDB locally: brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community"
    echo "2. Use MongoDB Atlas (cloud) - Update .env with Atlas connection string"
    echo "3. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    echo ""
    echo "After MongoDB is running, run this script again."
    exit 1
fi

echo "✅ MongoDB is running"

# Check if data is processed
if [ ! -f "data/processed/movies.json" ]; then
    echo "📊 Processing dataset..."
    npm run process-data
else
    echo "✅ Dataset already processed"
fi

# Seed database
echo "🌱 Seeding database..."
npm run seed

# Start server
echo "🚀 Starting server..."
npm run dev
