# Dashboard Wireframe

## Header
```
+----------------------------------------------------------------------+
| Logo                                       User Profile | Notifications |
+----------------------------------------------------------------------+
| Dashboard | Journal | Trades | Analytics | Reports | Settings         |
+----------------------------------------------------------------------+
```

## Main Dashboard
```
+----------------------------------------------------------------------+
| Trading Performance Overview                                         |
+----------------------+---------------------+------------------------+
| Net P&L              | Win Rate            | Profit Factor          |
| $1,245.67            | 65.4%               | 2.3                    |
+----------------------+---------------------+------------------------+
| Avg Win              | Avg Loss            | Expectancy             |
| $320.45              | $175.23             | $0.87 per $1 risked    |
+----------------------+---------------------+------------------------+
```

## Performance Charts
```
+----------------------------------------------------------------------+
| Daily P&L                                                            |
| [Bar chart showing daily profit/loss for the last 30 days]           |
+----------------------------------------------------------------------+

+-------------------------------+--------------------------------------+
| P&L by Asset Class            | P&L by Setup                         |
| [Pie chart]                   | [Bar chart]                          |
+-------------------------------+--------------------------------------+

+-------------------------------+--------------------------------------+
| Win Rate by Day of Week       | Trade Volume by Time of Day          |
| [Bar chart]                   | [Line chart]                         |
+-------------------------------+--------------------------------------+
```

## Recent Trades
```
+----------------------------------------------------------------------+
| Recent Trades                                          View All >     |
+--------+----------+--------+--------+--------+--------+-------------+
| Symbol | Direction| Entry  | Exit   | P&L    | Win/Loss| Date        |
+--------+----------+--------+--------+--------+--------+-------------+
| AAPL   | Long     | $145.32| $152.67| $732.50| Win     | Apr 5, 2025 |
| MSFT   | Short    | $287.45| $290.30| -$285.00| Loss   | Apr 4, 2025 |
| TSLA   | Long     | $198.76| $205.43| $667.00| Win     | Apr 3, 2025 |
| AMZN   | Long     | $132.54| $130.21| -$233.00| Loss   | Apr 2, 2025 |
+--------+----------+--------+--------+--------+--------+-------------+
```

## Journal Entries
```
+----------------------------------------------------------------------+
| Recent Journal Entries                                 View All >     |
+-------------+--------------------------------------------------+-----+
| Date        | Title                                            | Tags|
+-------------+--------------------------------------------------+-----+
| Apr 5, 2025 | Pre-market analysis: Tech sector looking strong  | #plan|
| Apr 4, 2025 | Trading reflection: Overtraded during volatility | #mistake|
| Apr 3, 2025 | Weekly review: Improved win rate                 | #review|
+-------------+--------------------------------------------------+-----+
```

## Trading Mistakes
```
+----------------------------------------------------------------------+
| Common Mistakes                                                       |
+------------------------------------+--------------------------------+
| [Pie chart showing mistake types]  | Top 3 Mistakes:                |
|                                    | 1. Chasing entries             |
|                                    | 2. Moving stop loss            |
|                                    | 3. Overtrading                 |
+------------------------------------+--------------------------------+
```

## Quick Actions
```
+----------------------------------------------------------------------+
| Quick Actions                                                         |
+----------------------+---------------------+------------------------+
| + Add Trade          | + Journal Entry     | Import Trades          |
+----------------------+---------------------+------------------------+
| Run Report           | Backtest Strategy   | Account Settings       |
+----------------------+---------------------+------------------------+
```

## Responsive Design Notes
- Dashboard will use a card-based layout that reflows on smaller screens
- Charts will be responsive and maintain aspect ratio
- Tables will become scrollable horizontally on mobile devices
- Navigation will collapse to a hamburger menu on mobile
- Quick actions will stack vertically on smaller screens
