# Database Schema Design for Trading Journal

## User Collection
```json
{
  "_id": "ObjectId",
  "email": "String",
  "password": "String (hashed)",
  "firstName": "String",
  "lastName": "String",
  "createdAt": "Date",
  "updatedAt": "Date",
  "settings": {
    "defaultAccount": "String",
    "defaultTimeframe": "String",
    "theme": "String",
    "notifications": "Boolean"
  }
}
```

## Account Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "name": "String",
  "broker": "String",
  "accountType": "String (cash, margin, etc.)",
  "currency": "String",
  "initialBalance": "Number",
  "currentBalance": "Number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Trade Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "accountId": "ObjectId (ref: Account)",
  "symbol": "String",
  "assetClass": "String (stock, option, future, forex, crypto)",
  "direction": "String (long, short)",
  "quantity": "Number",
  "entryPrice": "Number",
  "entryDate": "Date",
  "exitPrice": "Number",
  "exitDate": "Date",
  "stopLoss": "Number",
  "takeProfit": "Number",
  "fees": "Number",
  "pnl": "Number",
  "pnlPercentage": "Number",
  "rMultiple": "Number",
  "status": "String (open, closed)",
  "setupId": "ObjectId (ref: Setup)",
  "tags": ["String"],
  "mistakes": ["ObjectId (ref: Mistake)"],
  "notes": "String",
  "rating": "Number (1-5)",
  "images": ["String (URLs)"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Setup Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "name": "String",
  "description": "String",
  "rules": ["String"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Mistake Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "name": "String",
  "description": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Journal Entry Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "title": "String",
  "content": "String (rich text)",
  "type": "String (daily, weekly, monthly, pre-market, post-session)",
  "tags": ["String"],
  "relatedTrades": ["ObjectId (ref: Trade)"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Template Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "name": "String",
  "content": "String (rich text with placeholders)",
  "type": "String (journal, trade, etc.)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Performance Metrics Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "accountId": "ObjectId (ref: Account)",
  "date": "Date",
  "period": "String (daily, weekly, monthly, yearly)",
  "totalTrades": "Number",
  "winningTrades": "Number",
  "losingTrades": "Number",
  "winRate": "Number",
  "profitFactor": "Number",
  "averageWin": "Number",
  "averageLoss": "Number",
  "largestWin": "Number",
  "largestLoss": "Number",
  "netProfit": "Number",
  "grossProfit": "Number",
  "grossLoss": "Number",
  "expectancy": "Number",
  "sharpeRatio": "Number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Import History Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "accountId": "ObjectId (ref: Account)",
  "fileName": "String",
  "broker": "String",
  "importType": "String (csv, api)",
  "status": "String (success, failed, partial)",
  "tradesImported": "Number",
  "tradesSkipped": "Number",
  "errorLog": "String",
  "createdAt": "Date"
}
```

## Backtesting Session Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "name": "String",
  "description": "String",
  "symbol": "String",
  "timeframe": "String",
  "startDate": "Date",
  "endDate": "Date",
  "initialCapital": "Number",
  "positionSize": "String (fixed, percentage)",
  "positionSizeValue": "Number",
  "trades": [{
    "entryDate": "Date",
    "entryPrice": "Number",
    "exitDate": "Date",
    "exitPrice": "Number",
    "direction": "String (long, short)",
    "quantity": "Number",
    "pnl": "Number",
    "pnlPercentage": "Number"
  }],
  "metrics": {
    "totalTrades": "Number",
    "winRate": "Number",
    "profitFactor": "Number",
    "netProfit": "Number",
    "maxDrawdown": "Number",
    "sharpeRatio": "Number"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Relationships

1. User has many Accounts
2. User has many Trades
3. User has many Setups
4. User has many Mistakes
5. User has many Journal Entries
6. User has many Templates
7. User has many Performance Metrics
8. User has many Import Histories
9. User has many Backtesting Sessions
10. Account has many Trades
11. Trade belongs to a Setup (optional)
12. Trade has many Mistakes (optional)
13. Journal Entry has many related Trades (optional)
14. Performance Metrics are calculated from Trades

## Indexes

1. User: email (unique)
2. Trade: userId, accountId, symbol, entryDate, status
3. Journal Entry: userId, createdAt, type
4. Performance Metrics: userId, accountId, date, period
5. Import History: userId, accountId, createdAt

## Data Validation Rules

1. Trade pnl must be calculated as (exitPrice - entryPrice) * quantity for long positions and (entryPrice - exitPrice) * quantity for short positions
2. Trade pnlPercentage must be calculated as pnl / (entryPrice * quantity) * 100
3. Trade rMultiple must be calculated as pnl / (entryPrice - stopLoss) for long positions and pnl / (stopLoss - entryPrice) for short positions
4. Performance metrics must be recalculated whenever trades are added, modified, or deleted
5. User email must be unique and valid
6. Trade quantity must be positive
7. Trade entryDate must be before exitDate for closed trades
