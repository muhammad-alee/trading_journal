# Trading Journal Application - README

## Overview
This is a comprehensive trading journal application inspired by TradeZella, designed to help traders track their trades, analyze performance, and improve their trading strategies. The application includes features for trade tracking, journaling, performance analytics, and more.

## Features
- **User Authentication**: Secure login and registration system
- **Dashboard**: Overview of trading performance with key metrics
- **Trade Management**: Add, edit, view, and delete trades
- **Journal Entries**: Document trading thoughts, strategies, and reflections
- **Performance Analytics**: Analyze trading performance with charts and statistics
- **Multiple Account Support**: Track trades across different brokers and accounts
- **Trading Setups**: Define and track different trading strategies
- **Responsive Design**: Works on both desktop and mobile devices

## Technology Stack
- **Frontend**: React with TypeScript, Material UI, Recharts
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4 or higher)

### Setup Instructions

1. Clone the repository:
```
git clone <repository-url>
cd trading-journal
```

2. Install backend dependencies:
```
cd backend
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trading_journal
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Install frontend dependencies:
```
cd ../frontend
npm install
```

5. Run the application:
Use the provided start script:
```
cd ..
chmod +x start.sh
./start.sh
```

This will start both the backend server and the frontend development server.

## Usage

1. Register a new account
2. Create a trading account (Settings page)
3. Add trades to your journal
4. Create journal entries to document your trading thoughts
5. View analytics to track your performance

## Testing

Run the test script to verify that all components are working correctly:
```
chmod +x test.sh
./test.sh
```

## Deployment

For production deployment:

1. Build the frontend:
```
cd frontend
npm run build
```

2. Set up a production MongoDB database
3. Configure environment variables for production
4. Use a process manager like PM2 to run the backend server
5. Serve the frontend build using a web server like Nginx

## License
This project is licensed under the MIT License.
