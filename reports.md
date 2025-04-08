# Reports Interface Wireframe

## Header
```
+----------------------------------------------------------------------+
| Logo                                       User Profile | Notifications |
+----------------------------------------------------------------------+
| Dashboard | Journal | Trades | Analytics | Reports | Settings         |
+----------------------------------------------------------------------+
```

## Reports Navigation
```
+----------------------------------------------------------------------+
| Performance | Trade Analysis | Journal Summary | Custom Reports       |
+----------------------------------------------------------------------+
```

## Report Generator
```
+----------------------------------------------------------------------+
| Generate New Report                                                  |
+----------------------------------------------------------------------+
| Report Type: [Dropdown]                                              |
+----------------------------------------------------------------------+
| Date Range: [Start Date] to [End Date]                               |
+----------------------------------------------------------------------+
| Account: [Dropdown]     | Symbols: [Multi-select]                    |
+----------------------------------------------------------------------+
| Include:                                                             |
| [ ] Performance Metrics [ ] Trade List [ ] Charts [ ] Journal Entries|
+----------------------------------------------------------------------+
| Format: [PDF] [Excel] [CSV] | Generate Report                        |
+----------------------------------------------------------------------+
```

## Saved Reports
```
+----------------------------------------------------------------------+
| Saved Reports                                                        |
+----------------------------------------------------------------------+
| Monthly Performance - March 2025                                     |
| Generated: Apr 2, 2025 | Type: Performance | Format: PDF | View | Delete |
+----------------------------------------------------------------------+
| Q1 2025 Trading Analysis                                             |
| Generated: Apr 1, 2025 | Type: Trade Analysis | Format: Excel | View | Delete |
+----------------------------------------------------------------------+
| Weekly Review - Week 13                                              |
| Generated: Mar 28, 2025 | Type: Performance | Format: PDF | View | Delete |
+----------------------------------------------------------------------+
```

## Performance Report Template
```
+----------------------------------------------------------------------+
| Performance Report                                                   |
+----------------------------------------------------------------------+
| Summary                                                              |
+----------------------+---------------------+------------------------+
| Period               | Total Trades        | Net P&L                |
| Mar 1-31, 2025       | 87                  | $4,567.89              |
+----------------------+---------------------+------------------------+
| Win Rate             | Profit Factor       | Avg Trade              |
| 68.2%                | 2.45                | $52.50                 |
+----------------------+---------------------+------------------------+
```

## Performance Charts
```
+----------------------------------------------------------------------+
| Daily P&L                                                            |
| [Bar chart showing daily profit/loss]                                |
+----------------------------------------------------------------------+

+-------------------------------+--------------------------------------+
| P&L by Asset Class            | Win Rate by Setup                    |
| [Pie chart]                   | [Bar chart]                          |
+-------------------------------+--------------------------------------+
```

## Trade List
```
+----------------------------------------------------------------------+
| Trade List                                                           |
+--------+----------+--------+--------+--------+--------+-------------+
| Date   | Symbol   | Side   | Qty    | P&L    | R-Mult | Setup       |
+--------+----------+--------+--------+--------+--------+-------------+
| Mar 31 | AAPL     | Long   | 100    | $345.67| 2.3    | Breakout    |
| Mar 30 | MSFT     | Short  | 50     | -$123.45| -0.8   | Reversal    |
| Mar 29 | AMZN     | Long   | 25     | $432.10| 2.8    | Pullback    |
| ...    | ...      | ...    | ...    | ...    | ...    | ...         |
+--------+----------+--------+--------+--------+--------+-------------+
```

## Comparison Section
```
+----------------------------------------------------------------------+
| Period Comparison                                                    |
+----------------------+---------------------+------------------------+
| Metric               | Current Period      | Previous Period        |
+----------------------+---------------------+------------------------+
| Net P&L              | $4,567.89           | $3,245.67              |
| Win Rate             | 68.2%               | 62.5%                  |
| Profit Factor        | 2.45                | 2.12                   |
| Avg Trade            | $52.50              | $43.28                 |
| Max Drawdown         | -$1,234.56          | -$1,876.54             |
+----------------------+---------------------+------------------------+
```

## Scheduled Reports
```
+----------------------------------------------------------------------+
| Scheduled Reports                                                    |
+----------------------------------------------------------------------+
| Daily Performance Summary                                            |
| Frequency: Daily | Recipients: [email list] | Format: PDF | Edit | Delete |
+----------------------------------------------------------------------+
| Weekly Trading Review                                                |
| Frequency: Weekly (Fri) | Recipients: [email list] | Format: PDF | Edit | Delete |
+----------------------------------------------------------------------+
| Monthly Performance Report                                           |
| Frequency: Monthly | Recipients: [email list] | Format: Excel | Edit | Delete |
+----------------------------------------------------------------------+
```

## Responsive Design Notes
- Report generator will use a single column layout on mobile devices
- Charts will be responsive and maintain aspect ratio
- Tables will become scrollable horizontally on mobile devices
- Reports navigation will use tabs on mobile
- Saved reports will stack vertically on all devices
