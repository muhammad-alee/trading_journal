# Trade Entry Form Wireframe

## Header
```
+----------------------------------------------------------------------+
| Logo                                       User Profile | Notifications |
+----------------------------------------------------------------------+
| Dashboard | Journal | Trades | Analytics | Reports | Settings         |
+----------------------------------------------------------------------+
```

## Form Header
```
+----------------------------------------------------------------------+
| Add New Trade                                                        |
+----------------------------------------------------------------------+
| Manual Entry | Import from Broker | Upload CSV                        |
+----------------------------------------------------------------------+
```

## Trade Details Section
```
+----------------------------------------------------------------------+
| Trade Details                                                        |
+----------------------------------------------------------------------+
| Symbol:        [Text input]        | Asset Class: [Dropdown]          |
+----------------------------------+----------------------------------+
| Direction:     [Long/Short]       | Account:    [Dropdown]           |
+----------------------------------+----------------------------------+
| Quantity:      [Number input]     | Setup:      [Dropdown]           |
+----------------------------------+----------------------------------+
```

## Entry Details
```
+----------------------------------------------------------------------+
| Entry Details                                                        |
+----------------------------------------------------------------------+
| Entry Date:    [Date picker]      | Entry Time:  [Time picker]       |
+----------------------------------+----------------------------------+
| Entry Price:   [Number input]     | Entry Notes: [Text area]         |
+----------------------------------+----------------------------------+
| Entry Screenshot: [File upload]                                      |
+----------------------------------------------------------------------+
```

## Exit Details
```
+----------------------------------------------------------------------+
| Exit Details                                                         |
+----------------------------------------------------------------------+
| Exit Date:     [Date picker]      | Exit Time:   [Time picker]       |
+----------------------------------+----------------------------------+
| Exit Price:    [Number input]     | Exit Notes:  [Text area]         |
+----------------------------------+----------------------------------+
| Exit Screenshot: [File upload]                                       |
+----------------------------------------------------------------------+
```

## Risk Management
```
+----------------------------------------------------------------------+
| Risk Management                                                      |
+----------------------------------------------------------------------+
| Stop Loss:     [Number input]     | Take Profit: [Number input]      |
+----------------------------------+----------------------------------+
| Risk Amount:   [Number input]     | Risk %:      [Number input]      |
+----------------------------------+----------------------------------+
| R-Multiple:    [Calculated]       | Fees:        [Number input]      |
+----------------------------------------------------------------------+
```

## Trade Performance (Auto-calculated)
```
+----------------------------------------------------------------------+
| Trade Performance                                                    |
+----------------------------------------------------------------------+
| P&L:           [Calculated]       | P&L %:       [Calculated]        |
+----------------------------------+----------------------------------+
| Duration:      [Calculated]       | MAE:         [Number input]      |
+----------------------------------+----------------------------------+
| MFE:           [Number input]     | Trade Rating: [1-5 stars]        |
+----------------------------------------------------------------------+
```

## Trade Analysis
```
+----------------------------------------------------------------------+
| Trade Analysis                                                       |
+----------------------------------------------------------------------+
| Tags:          [Multi-select with custom tags]                       |
+----------------------------------------------------------------------+
| Mistakes Made: [Multi-select with custom mistakes]                   |
+----------------------------------------------------------------------+
| Trade Notes:   [Rich text editor]                                    |
+----------------------------------------------------------------------+
```

## Chart/Screenshot
```
+----------------------------------------------------------------------+
| Trade Chart                                                          |
+----------------------------------------------------------------------+
| [Area for chart upload or screenshot]                                |
|                                                                      |
|                                                                      |
+----------------------------------------------------------------------+
```

## Action Buttons
```
+----------------------------------------------------------------------+
|                                         | Cancel | Save as Draft | Save |
+----------------------------------------------------------------------+
```

## Responsive Design Notes
- Form will use a single column layout on mobile devices
- Date and time pickers will be optimized for touch input on mobile
- Rich text editor will have simplified controls on smaller screens
- File uploads will be fully functional on mobile with camera integration
- Calculated fields will update in real-time as user inputs values
