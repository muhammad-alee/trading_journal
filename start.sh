#!/bin/bash

# Start MongoDB service
echo "Starting MongoDB service..."
sudo systemctl start mongod
sleep 2
sudo systemctl status mongod

# Create MongoDB database for the trading journal
echo "Creating MongoDB database..."
mongosh --eval "use trading_journal"

# Navigate to backend directory and install dependencies
echo "Setting up backend..."
cd /home/ubuntu/trading_journal/backend
npm install

# Start backend server in the background
echo "Starting backend server..."
node server.js &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 5

# Navigate to frontend directory and start development server
echo "Starting frontend development server..."
cd /home/ubuntu/trading_journal/frontend
npm start
