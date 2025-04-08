# Analytics View Wireframe

## Header
```
+----------------------------------------------------------------------+
| Logo                                       User Profile | Notifications |
+----------------------------------------------------------------------+
| Dashboard | Journal | Trades | Analytics | Reports | Settings         |
+----------------------------------------------------------------------+
```

## Analytics Navigation
```
+----------------------------------------------------------------------+
| Overview | Performance | Patterns | Risk Analysis | Comparison        |
+----------------------------------------------------------------------+
```

## Filters Bar
```
+----------------------------------------------------------------------+
| Date Range: [Dropdown] | Account: [Dropdown] | Symbol: [Input]       |
+----------------------------------------------------------------------+
| Setup: [Dropdown] | Tags: [Multi-select] | Apply Filters | Reset     |
+----------------------------------------------------------------------+
```

## Performance Metrics
```
+----------------------------------------------------------------------+
| Key Metrics                                                          |
+----------------------+---------------------+------------------------+
| Total Trades         | Win Rate            | Profit Factor          |
| 124                  | 65.4%               | 2.3                    |
+----------------------+---------------------+------------------------+
| Net P&L              | Avg Win             | Avg Loss               |
| $12,456.78           | $320.45             | $175.23                |
+----------------------+---------------------+------------------------+
| Largest Win          | Largest Loss        | Expectancy             |
| $1,245.67            | -$876.54            | $0.87 per $1 risked    |
+----------------------+---------------------+------------------------+
```

## Performance Charts
```
+----------------------------------------------------------------------+
| Equity Curve                                                         |
| [Line chart showing cumulative P&L over time]                        |
+----------------------------------------------------------------------+

+-------------------------------+--------------------------------------+
| Monthly Performance           | Win Rate by Day of Week              |
| [Bar chart]                   | [Bar chart]                          |
+-------------------------------+--------------------------------------+

+-------------------------------+--------------------------------------+
| P&L Distribution              | Trade Duration vs. P&L               |
| [Histogram]                   | [Scatter plot]                       |
+-------------------------------+--------------------------------------+
```

## Trade Analysis
```
+----------------------------------------------------------------------+
| Performance by Setup                                                 |
+--------+----------+--------+--------+--------+--------+-------------+
| Setup  | # Trades | Win %  | Avg P&L| Profit | Loss   | Expectancy  |
+--------+----------+--------+--------+--------+--------+-------------+
| Breakout| 45      | 71.2%  | $245.32| $15,432| $4,321 | $1.23       |
| Pullback| 38      | 63.1%  | $187.45| $10,876| $3,765 | $0.98       |
| Reversal| 27      | 55.6%  | $132.76| $6,543 | $2,987 | $0.76       |
| Gap Fill| 14      | 78.6%  | $312.54| $5,432 | $1,056 | $1.45       |
+--------+----------+--------+--------+--------+--------+-------------+
```

## Time Analysis
```
+----------------------------------------------------------------------+
| Performance by Time of Day                                           |
| [Heat map showing win rate and P&L by hour of day]                   |
+----------------------------------------------------------------------+

+----------------------------------------------------------------------+
| Performance by Day of Week                                           |
| [Bar chart showing P&L and number of trades by day of week]          |
+----------------------------------------------------------------------+
```

## Risk Analysis
```
+----------------------------------------------------------------------+
| Risk Metrics                                                         |
+----------------------+---------------------+------------------------+
| Avg R Multiple       | Max Drawdown        | Sharpe Ratio           |
| 1.45                 | -$3,245.67 (8.2%)   | 1.87                   |
+----------------------+---------------------+------------------------+
| Win/Loss Ratio       | Profit Factor       | Kelly Percentage       |
| 1.83                 | 2.3                 | 12.4%                  |
+----------------------+---------------------+------------------------+
```

## Advanced Analytics
```
+----------------------------------------------------------------------+
| Consecutive Wins/Losses                                              |
| [Bar chart showing frequency of consecutive wins and losses]         |
+----------------------------------------------------------------------+

+----------------------------------------------------------------------+
| Correlation Analysis                                                 |
| [Heat map showing correlation between different metrics]             |
+----------------------------------------------------------------------+
```

## Export Options
```
+----------------------------------------------------------------------+
| Export: [PDF] [CSV] [Excel] | Save as Template | Schedule Report     |
+----------------------------------------------------------------------+
```

## Responsive Design Notes
- Charts will be responsive and maintain aspect ratio
- Tables will become scrollable horizontally on mobile devices
- Filters will collapse into a dropdown menu on smaller screens
- Analytics navigation will use tabs on mobile
- Export options will be accessible via a menu button on mobile
