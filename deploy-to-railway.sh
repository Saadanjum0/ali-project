#!/bin/bash

echo "🚀 Deploying Movie Streaming Platform to Railway"
echo "================================================"

# Check if user is logged in
echo "📋 Step 1: Checking Railway login status..."
if ! npx @railway/cli status > /dev/null 2>&1; then
    echo "❌ Not logged in to Railway. Please run: npx @railway/cli login"
    exit 1
fi

echo "✅ Logged in to Railway"

# Initialize project if needed
echo "📋 Step 2: Initializing Railway project..."
if [ ! -f "railway.json" ]; then
    npx @railway/cli init
fi

# Set environment variables
echo "📋 Step 3: Setting environment variables..."
npx @railway/cli variables set MONGODB_URI="mongodb+srv://xaadanjum36:DLMrhMKx3CbGXYv5@cluster0.rwhnrwv.mongodb.net/movie-streaming-platform?retryWrites=true&w=majority"

# Deploy the application
echo "📋 Step 4: Deploying application..."
npx @railway/cli up

# Get the deployment URL
echo "📋 Step 5: Getting deployment URL..."
DEPLOY_URL=$(npx @railway/cli domain)

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo "Your app is live at: https://$DEPLOY_URL"
echo ""
echo "📋 Step 6: Seeding database..."
echo "Run this command to seed your database:"
echo "npx @railway/cli run npm run seed"
echo ""
echo "✅ Your movie streaming platform is now live!"
echo "🔗 URL: https://$DEPLOY_URL"
