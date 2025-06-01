#!/bin/bash

# 🚀 TeleTrack Backend Startup Script

echo "🚀 Starting TeleTrack Backend..."

# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate

# Clear any environment variables that might override .env file
unset OPENWEATHER_API_KEY
unset ALPHA_VANTAGE_API_KEY
unset COINGECKO_API_KEY
unset EXCHANGE_RATE_API_KEY

echo "✅ Environment variables cleared"
echo "📋 Reading configuration from .env file"

# Start Django server
echo "🌐 Starting Django server on http://localhost:8000"
python manage.py runserver 8000 