#!/bin/bash

# Test script for Trading Journal application

echo "Running tests for Trading Journal application..."

# Check if MongoDB is installed
echo "Checking MongoDB installation..."
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

# Check if Node.js is installed
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if backend directory exists
echo "Checking backend directory..."
if [ ! -d "/home/ubuntu/trading_journal/backend" ]; then
    echo "Backend directory not found."
    exit 1
fi

# Check if frontend directory exists
echo "Checking frontend directory..."
if [ ! -d "/home/ubuntu/trading_journal/frontend" ]; then
    echo "Frontend directory not found."
    exit 1
fi

# Check if backend dependencies are installed
echo "Checking backend dependencies..."
if [ ! -d "/home/ubuntu/trading_journal/backend/node_modules" ]; then
    echo "Backend dependencies not installed. Installing now..."
    cd /home/ubuntu/trading_journal/backend
    npm install
fi

# Check if frontend dependencies are installed
echo "Checking frontend dependencies..."
if [ ! -d "/home/ubuntu/trading_journal/frontend/node_modules" ]; then
    echo "Frontend dependencies not installed. Installing now..."
    cd /home/ubuntu/trading_journal/frontend
    npm install
fi

# Test MongoDB connection
echo "Testing MongoDB connection..."
mongo --eval "db.version()" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Failed to connect to MongoDB. Make sure MongoDB service is running."
    exit 1
fi

# Test backend server
echo "Testing backend server..."
cd /home/ubuntu/trading_journal/backend
node -e "try { require('./server.js'); console.log('Backend server loaded successfully.'); } catch(e) { console.error('Error loading backend server:', e); process.exit(1); }"
if [ $? -ne 0 ]; then
    echo "Backend server test failed."
    exit 1
fi

# Test frontend build
echo "Testing frontend build..."
cd /home/ubuntu/trading_journal/frontend
npm run build --if-present
if [ $? -ne 0 ]; then
    echo "Frontend build test failed."
    exit 1
fi

echo "All tests passed successfully!"
echo "You can start the application using ./start.sh"
