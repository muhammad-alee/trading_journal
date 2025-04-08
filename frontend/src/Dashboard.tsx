import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAccounts } from '../api/api';
import { getTrades } from '../api/api';
import { getJournalEntries } from '../api/api';
import { getPerformanceMetrics } from '../api/api';
import { Account, Trade, JournalEntry, PerformanceMetrics } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch accounts
        const accountsRes = await getAccounts();
        setAccounts(accountsRes.data.data);
        
        // If there's at least one account, fetch other data
        if (accountsRes.data.data.length > 0) {
          const accountId = accountsRes.data.data[0]._id;
          
          // Fetch recent trades
          const tradesRes = await getTrades({ 
            limit: 5, 
            sort: '-entryDate',
            accountId
          });
          setRecentTrades(tradesRes.data.data);
          
          // Fetch recent journal entries
          const journalRes = await getJournalEntries({ limit: 3 });
          setJournalEntries(journalRes.data.data);
          
          // Fetch performance metrics
          const metricsRes = await getPerformanceMetrics({ accountId });
          setMetrics(metricsRes.data.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Placeholder data for charts when no real data is available
  const placeholderPnlData = [
    { date: 'Mon', pnl: 0 },
    { date: 'Tue', pnl: 0 },
    { date: 'Wed', pnl: 0 },
    { date: 'Thu', pnl: 0 },
    { date: 'Fri', pnl: 0 }
  ];

  const placeholderPieData = [
    { name: 'No Data', value: 1 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {accounts.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Welcome to Your Trading Journal
            </Typography>
            <Typography variant="body1" paragraph>
              To get started, please create your first trading account.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/settings')}
            >
              Create Account
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Performance Overview */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Trading Performance Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Net P&L
                        </Typography>
                        <Typography variant="h4">
                          ${metrics?.netProfit.toFixed(2) || '0.00'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Win Rate
                        </Typography>
                        <Typography variant="h4">
                          {metrics?.winRate.toFixed(1) || '0.0'}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Profit Factor
                        </Typography>
                        <Typography variant="h4">
                          {metrics?.profitFactor.toFixed(2) || '0.00'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Charts */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Daily P&L
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={placeholderPnlData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pnl" fill="#8884d8" name="P&L ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Win/Loss Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={placeholderPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {placeholderPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Recent Trades */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography component="h2" variant="h6" color="primary">
                    Recent Trades
                  </Typography>
                  <Button size="small" onClick={() => navigate('/trades')}>
                    View All
                  </Button>
                </Box>
                {recentTrades.length > 0 ? (
                  <List>
                    {recentTrades.map((trade) => (
                      <React.Fragment key={trade._id}>
                        <ListItem button onClick={() => navigate(`/trades/${trade._id}`)}>
                          <ListItemText
                            primary={`${trade.symbol} - ${trade.direction.toUpperCase()}`}
                            secondary={`Entry: $${trade.entryPrice} | ${trade.status === 'closed' ? `Exit: $${trade.exitPrice}` : 'Open'}`}
                          />
                          <Typography 
                            variant="body2" 
                            color={trade.pnl && trade.pnl > 0 ? 'success.main' : 'error.main'}
                          >
                            {trade.pnl ? `$${trade.pnl.toFixed(2)}` : 'Open'}
                          </Typography>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary" align="center">
                    No trades yet. Add your first trade to get started.
                  </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/trades/add')}
                  >
                    Add Trade
                  </Button>
                </Box>
              </Paper>
            </Grid>
            
            {/* Journal Entries */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography component="h2" variant="h6" color="primary">
                    Journal Entries
                  </Typography>
                  <Button size="small" onClick={() => navigate('/journal')}>
                    View All
                  </Button>
                </Box>
                {journalEntries.length > 0 ? (
                  <List>
                    {journalEntries.map((entry) => (
                      <React.Fragment key={entry._id}>
                        <ListItem button onClick={() => navigate(`/journal/${entry._id}`)}>
                          <ListItemText
                            primary={entry.title}
                            secondary={new Date(entry.createdAt).toLocaleDateString()}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary" align="center">
                    No journal entries yet. Start journaling to improve your trading.
                  </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/journal/add')}
                  >
                    Add Journal Entry
                  </Button>
                </Box>
              </Paper>
            </Grid>
            
            {/* Quick Actions */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={2}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      onClick={() => navigate('/trades/add')}
                    >
                      Add Trade
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      onClick={() => navigate('/journal/add')}
                    >
                      Journal Entry
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      onClick={() => navigate('/analytics')}
                    >
                      Analytics
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      onClick={() => navigate('/settings')}
                    >
                      Settings
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default Dashboard;
