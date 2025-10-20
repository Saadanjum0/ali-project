#!/bin/bash

if [ -z "$1" ]; then
    echo "❌ Please provide the Atlas connection string"
    echo "Usage: ./update-atlas-connection.sh 'mongodb+srv://...'"
    exit 1
fi

CONNECTION_STRING="$1"

# Update .env file with the connection string
sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=$CONNECTION_STRING|" .env

echo "✅ Updated .env file with Atlas connection string"
echo ""
echo "Now run:"
echo "  npm run seed"
echo "  npm run dev"
