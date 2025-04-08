# Settings Interface Wireframe

## Header
```
+----------------------------------------------------------------------+
| Logo                                       User Profile | Notifications |
+----------------------------------------------------------------------+
| Dashboard | Journal | Trades | Analytics | Reports | Settings         |
+----------------------------------------------------------------------+
```

## Settings Navigation
```
+----------------------------------------------------------------------+
| Profile | Accounts | Preferences | Broker Connections | Notifications |
+----------------------------------------------------------------------+
```

## Profile Settings
```
+----------------------------------------------------------------------+
| Profile Settings                                                     |
+----------------------------------------------------------------------+
| Profile Picture: [Current picture] [Change]                          |
+----------------------------------------------------------------------+
| First Name: [Text input]                                             |
+----------------------------------------------------------------------+
| Last Name: [Text input]                                              |
+----------------------------------------------------------------------+
| Email: [Email input]                                                 |
+----------------------------------------------------------------------+
| Password: [Password input] [Change Password]                         |
+----------------------------------------------------------------------+
| Time Zone: [Dropdown]                                                |
+----------------------------------------------------------------------+
| Save Changes                                                         |
+----------------------------------------------------------------------+
```

## Account Settings
```
+----------------------------------------------------------------------+
| Trading Accounts                                                     |
+----------------------------------------------------------------------+
| + Add New Account                                                    |
+----------------------------------------------------------------------+
| Account: Interactive Brokers Main                                    |
| Type: Margin | Currency: USD | Balance: $25,432.67 | Edit | Delete   |
+----------------------------------------------------------------------+
| Account: TD Ameritrade IRA                                           |
| Type: Cash | Currency: USD | Balance: $45,876.32 | Edit | Delete     |
+----------------------------------------------------------------------+
| Account: Coinbase Pro                                                |
| Type: Crypto | Currency: USD | Balance: $5,432.10 | Edit | Delete    |
+----------------------------------------------------------------------+
```

## Preferences
```
+----------------------------------------------------------------------+
| Application Preferences                                              |
+----------------------------------------------------------------------+
| Theme: [Light/Dark/System]                                           |
+----------------------------------------------------------------------+
| Default Dashboard View: [Dropdown]                                   |
+----------------------------------------------------------------------+
| Default Date Range: [Dropdown]                                       |
+----------------------------------------------------------------------+
| Default Account: [Dropdown]                                          |
+----------------------------------------------------------------------+
| Chart Type: [Candlestick/Bar/Line]                                   |
+----------------------------------------------------------------------+
| Currency Display: [Dropdown]                                         |
+----------------------------------------------------------------------+
| Save Changes                                                         |
+----------------------------------------------------------------------+
```

## Broker Connections
```
+----------------------------------------------------------------------+
| Broker Connections                                                   |
+----------------------------------------------------------------------+
| + Connect New Broker                                                 |
+----------------------------------------------------------------------+
| Interactive Brokers                                                  |
| Status: Connected | Last Sync: Apr 7, 2025 09:15 | Disconnect | Sync Now |
+----------------------------------------------------------------------+
| TD Ameritrade                                                        |
| Status: Connected | Last Sync: Apr 7, 2025 08:30 | Disconnect | Sync Now |
+----------------------------------------------------------------------+
| Coinbase Pro                                                         |
| Status: Connection Error | Reconnect                                 |
+----------------------------------------------------------------------+
```

## Data Import/Export
```
+----------------------------------------------------------------------+
| Data Management                                                      |
+----------------------------------------------------------------------+
| Import Data                                                          |
| [Select Broker] [Select File] [Upload]                               |
+----------------------------------------------------------------------+
| Export All Data                                                      |
| Format: [CSV/Excel/JSON] [Export]                                    |
+----------------------------------------------------------------------+
| Backup & Restore                                                     |
| [Create Backup] [Restore from Backup]                                |
+----------------------------------------------------------------------+
```

## Notification Settings
```
+----------------------------------------------------------------------+
| Notification Settings                                                |
+----------------------------------------------------------------------+
| Email Notifications:                                                 |
| [ ] Daily Summary                                                    |
| [ ] Weekly Report                                                    |
| [ ] Trade Import Completed                                           |
| [ ] Account Connection Issues                                        |
+----------------------------------------------------------------------+
| In-App Notifications:                                                |
| [ ] Trade Import Completed                                           |
| [ ] Performance Milestones                                           |
| [ ] Account Connection Issues                                        |
| [ ] Journal Reminders                                                |
+----------------------------------------------------------------------+
| Save Changes                                                         |
+----------------------------------------------------------------------+
```

## Responsive Design Notes
- Settings navigation will use tabs on mobile devices
- Form fields will stack vertically on smaller screens
- Account cards will maintain their layout but stack vertically
- Broker connection cards will simplify on mobile with action buttons in a dropdown
- All forms will be fully functional on mobile with appropriate input types
