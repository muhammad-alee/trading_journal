# API Endpoints Design

## Authentication Endpoints

```
POST /api/auth/register
- Register a new user
- Body: { email, password, firstName, lastName }
- Returns: { token, user }

POST /api/auth/login
- Login existing user
- Body: { email, password }
- Returns: { token, user }

POST /api/auth/logout
- Logout user
- Requires: Authentication
- Returns: { success }

GET /api/auth/me
- Get current user info
- Requires: Authentication
- Returns: { user }

PUT /api/auth/me
- Update user profile
- Requires: Authentication
- Body: { firstName, lastName, email, timezone, etc. }
- Returns: { user }

POST /api/auth/password
- Change password
- Requires: Authentication
- Body: { currentPassword, newPassword }
- Returns: { success }
```

## Account Endpoints

```
GET /api/accounts
- Get all user accounts
- Requires: Authentication
- Returns: [{ account }]

POST /api/accounts
- Create new account
- Requires: Authentication
- Body: { name, broker, accountType, currency, initialBalance }
- Returns: { account }

GET /api/accounts/:id
- Get specific account
- Requires: Authentication
- Returns: { account }

PUT /api/accounts/:id
- Update account
- Requires: Authentication
- Body: { name, broker, accountType, currency, initialBalance }
- Returns: { account }

DELETE /api/accounts/:id
- Delete account
- Requires: Authentication
- Returns: { success }
```

## Trade Endpoints

```
GET /api/trades
- Get all trades with optional filtering
- Requires: Authentication
- Query params: accountId, symbol, startDate, endDate, status, etc.
- Returns: [{ trade }]

POST /api/trades
- Create new trade
- Requires: Authentication
- Body: { accountId, symbol, direction, quantity, entryPrice, entryDate, etc. }
- Returns: { trade }

GET /api/trades/:id
- Get specific trade
- Requires: Authentication
- Returns: { trade }

PUT /api/trades/:id
- Update trade
- Requires: Authentication
- Body: { accountId, symbol, direction, quantity, entryPrice, entryDate, etc. }
- Returns: { trade }

DELETE /api/trades/:id
- Delete trade
- Requires: Authentication
- Returns: { success }

POST /api/trades/import
- Import trades from file or broker
- Requires: Authentication
- Body: { accountId, broker, file or apiCredentials }
- Returns: { success, tradesImported, tradesSkipped, errors }
```

## Journal Endpoints

```
GET /api/journal
- Get all journal entries with optional filtering
- Requires: Authentication
- Query params: startDate, endDate, type, tags, etc.
- Returns: [{ journalEntry }]

POST /api/journal
- Create new journal entry
- Requires: Authentication
- Body: { title, content, type, tags, relatedTrades }
- Returns: { journalEntry }

GET /api/journal/:id
- Get specific journal entry
- Requires: Authentication
- Returns: { journalEntry }

PUT /api/journal/:id
- Update journal entry
- Requires: Authentication
- Body: { title, content, type, tags, relatedTrades }
- Returns: { journalEntry }

DELETE /api/journal/:id
- Delete journal entry
- Requires: Authentication
- Returns: { success }
```

## Template Endpoints

```
GET /api/templates
- Get all templates
- Requires: Authentication
- Query params: type
- Returns: [{ template }]

POST /api/templates
- Create new template
- Requires: Authentication
- Body: { name, content, type }
- Returns: { template }

GET /api/templates/:id
- Get specific template
- Requires: Authentication
- Returns: { template }

PUT /api/templates/:id
- Update template
- Requires: Authentication
- Body: { name, content, type }
- Returns: { template }

DELETE /api/templates/:id
- Delete template
- Requires: Authentication
- Returns: { success }
```

## Setup Endpoints

```
GET /api/setups
- Get all setups
- Requires: Authentication
- Returns: [{ setup }]

POST /api/setups
- Create new setup
- Requires: Authentication
- Body: { name, description, rules }
- Returns: { setup }

GET /api/setups/:id
- Get specific setup
- Requires: Authentication
- Returns: { setup }

PUT /api/setups/:id
- Update setup
- Requires: Authentication
- Body: { name, description, rules }
- Returns: { setup }

DELETE /api/setups/:id
- Delete setup
- Requires: Authentication
- Returns: { success }
```

## Mistake Endpoints

```
GET /api/mistakes
- Get all mistakes
- Requires: Authentication
- Returns: [{ mistake }]

POST /api/mistakes
- Create new mistake
- Requires: Authentication
- Body: { name, description }
- Returns: { mistake }

GET /api/mistakes/:id
- Get specific mistake
- Requires: Authentication
- Returns: { mistake }

PUT /api/mistakes/:id
- Update mistake
- Requires: Authentication
- Body: { name, description }
- Returns: { mistake }

DELETE /api/mistakes/:id
- Delete mistake
- Requires: Authentication
- Returns: { success }
```

## Analytics Endpoints

```
GET /api/analytics/performance
- Get performance metrics
- Requires: Authentication
- Query params: accountId, startDate, endDate, groupBy
- Returns: { metrics }

GET /api/analytics/trades
- Get trade analysis
- Requires: Authentication
- Query params: accountId, startDate, endDate, groupBy
- Returns: { tradeAnalysis }

GET /api/analytics/setups
- Get setup performance
- Requires: Authentication
- Query params: accountId, startDate, endDate
- Returns: { setupPerformance }

GET /api/analytics/calendar
- Get calendar performance
- Requires: Authentication
- Query params: accountId, startDate, endDate, groupBy
- Returns: { calendarPerformance }

GET /api/analytics/risk
- Get risk metrics
- Requires: Authentication
- Query params: accountId, startDate, endDate
- Returns: { riskMetrics }
```

## Report Endpoints

```
GET /api/reports
- Get all saved reports
- Requires: Authentication
- Returns: [{ report }]

POST /api/reports/generate
- Generate new report
- Requires: Authentication
- Body: { type, startDate, endDate, accountId, format, options }
- Returns: { reportUrl or reportData }

GET /api/reports/:id
- Get specific report
- Requires: Authentication
- Returns: { report }

DELETE /api/reports/:id
- Delete report
- Requires: Authentication
- Returns: { success }

POST /api/reports/schedule
- Schedule recurring report
- Requires: Authentication
- Body: { type, frequency, recipients, format, options }
- Returns: { scheduledReport }
```

## Broker Integration Endpoints

```
GET /api/brokers
- Get all supported brokers
- Returns: [{ broker }]

GET /api/brokers/connected
- Get user's connected brokers
- Requires: Authentication
- Returns: [{ connectedBroker }]

POST /api/brokers/connect
- Connect to broker
- Requires: Authentication
- Body: { broker, credentials }
- Returns: { connection }

DELETE /api/brokers/connect/:id
- Disconnect broker
- Requires: Authentication
- Returns: { success }

POST /api/brokers/sync/:id
- Sync trades from broker
- Requires: Authentication
- Returns: { success, tradesImported }
```

## Backtesting Endpoints

```
GET /api/backtesting
- Get all backtesting sessions
- Requires: Authentication
- Returns: [{ backtestingSession }]

POST /api/backtesting
- Create new backtesting session
- Requires: Authentication
- Body: { name, description, symbol, timeframe, startDate, endDate, initialCapital, etc. }
- Returns: { backtestingSession }

GET /api/backtesting/:id
- Get specific backtesting session
- Requires: Authentication
- Returns: { backtestingSession }

PUT /api/backtesting/:id
- Update backtesting session
- Requires: Authentication
- Body: { name, description, etc. }
- Returns: { backtestingSession }

DELETE /api/backtesting/:id
- Delete backtesting session
- Requires: Authentication
- Returns: { success }
```

## File Upload Endpoints

```
POST /api/upload/image
- Upload image
- Requires: Authentication
- Body: multipart/form-data with image file
- Returns: { imageUrl }

POST /api/upload/csv
- Upload CSV file
- Requires: Authentication
- Body: multipart/form-data with CSV file
- Returns: { fileId }
```

## Settings Endpoints

```
GET /api/settings
- Get user settings
- Requires: Authentication
- Returns: { settings }

PUT /api/settings
- Update user settings
- Requires: Authentication
- Body: { defaultAccount, defaultTimeframe, theme, notifications, etc. }
- Returns: { settings }
```

## Security Considerations

- All endpoints except authentication require a valid JWT token
- Rate limiting should be implemented to prevent abuse
- Input validation should be performed on all requests
- Sensitive data should be encrypted in transit and at rest
- API responses should not include sensitive information
- Error responses should be standardized and not expose internal details
