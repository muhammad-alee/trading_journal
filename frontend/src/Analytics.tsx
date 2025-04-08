import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getPerformanceMetrics, getTradeAnalysis, getAccounts } from '../api/api';
import { Account } from '../types';
import Layout from '../components/Layout';

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [metrics, setMetrics] = useState<any>(null);
  const [tradeAnalysis, setTradeAnalysis] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await getAccounts();
        setAccounts(res.data.data);
        
        if (res.data.data.length > 0) {
          setSelectedAccount(res.data.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts');
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAccount) return;
      
      try {
        setLoading(true);
        
        // Fetch performance metrics
        const metricsRes = await getPerformanceMetrics({ accountId: selectedAccount });
        setMetrics(metricsRes.data.data);
        
        // Fetch trade analysis
        const analysisRes = await getTradeAnalysis({ 
          accountId: selectedAccount,
          groupBy: 'symbol'
        });
        setTradeAnalysis(analysisRes.data.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedAccount]);

  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

  // Prepare data for symbol performance chart
  const prepareSymbolPerformanceData = () => {
    if (!tradeAnalysis) return [];
    
    return Object.keys(tradeAnalysis).map(symbol => ({
      symbol,
      netProfit: tradeAnalysis[symbol].netProfit,
      winRate: tradeAnalysis[symbol].winRate,
      trades: tradeAnalysis[symbol].totalTrades
    }));
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Trading Analytics
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {accounts.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No Trading Accounts Found
            </Typography>
            <Typography variant="body1" paragraph>
              You need to create at least one trading account and add some trades to view analytics.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/settings')}
            >
              Create Account
            </Button>
          </Paper>
        ) : (
          <>
            {/* Account Selection */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Select Account
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {accounts.map(account => (
                  <Button
                    key={account._id}
                    variant={selectedAccount === account._id ? 'contained' : 'outlined'}
                    onClick={() => handleAccountChange(account._id)}
                    sx={{ mb: 1 }}
                  >
                    {account.name}
                  </Button>
                ))}
              </Box>
            </Paper>

            {/* Performance Overview */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Performance Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Trades
                      </Typography>
                      <Typography variant="h4">
                        {metrics?.totalTrades || '0'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            {/* Tabs for different analytics views */}
            <Paper sx={{ p: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
                  <Tab label="Performance" />
                  <Tab label="Symbols" />
                  <Tab label="Trade Details" />
                </Tabs>
              </Box>

              {/* Performance Tab */}
              {tabValue === 0 && (
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Win/Loss Distribution
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Winning Trades', value: metrics?.winningTrades || 0 },
                                { name: 'Losing Trades', value: metrics?.losingTrades || 0 }
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="#4CAF50" />
                              <Cell fill="#F44336" />
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Profit/Loss Metrics
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Gross Profit', value: metrics?.grossProfit || 0 },
                              { name: 'Gross Loss', value: Math.abs(metrics?.grossLoss || 0) },
                              { name: 'Net Profit', value: metrics?.netProfit || 0 }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Average Win vs. Average Loss
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Average Win', value: metrics?.averageWin || 0 },
                              { name: 'Average Loss', value: Math.abs(metrics?.averageLoss || 0) }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Symbols Tab */}
              {tabValue === 1 && (
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Symbol Performance
                      </Typography>
                      <Box sx={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={prepareSymbolPerformanceData()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="symbol" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="netProfit" fill="#8884d8" name="Net Profit ($)" />
                            <Bar yAxisId="right" dataKey="winRate" fill="#82ca9d" name="Win Rate (%)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Symbol Details
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Symbol</TableCell>
                              <TableCell align="right">Trades</TableCell>
                              <TableCell align="right">Win Rate</TableCell>
                              <TableCell align="right">Profit Factor</TableCell>
                              <TableCell align="right">Net Profit</TableCell>
                              <TableCell align="right">Avg. Win</TableCell>
                              <TableCell align="right">Avg. Loss</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tradeAnalysis && Object.keys(tradeAnalysis).map((symbol) => (
                              <TableRow key={symbol}>
                                <TableCell component="th" scope="row">
                                  {symbol}
                                </TableCell>
                                <TableCell align="right">{tradeAnalysis[symbol].totalTrades}</TableCell>
                                <TableCell align="right">{tradeAnalysis[symbol].winRate.toFixed(1)}%</TableCell>
                                <TableCell align="right">{tradeAnalysis[symbol].profitFactor.toFixed(2)}</TableCell>
                                <TableCell align="right" 
                                  sx={{ 
                                    color: tradeAnalysis[symbol].netProfit > 0 
                                      ? 'success.main' 
                                      : tradeAnalysis[symbol].netProfit < 0 
                                        ? 'error.main' 
                                        : 'inherit' 
                                  }}
                                >
                                  ${tradeAnalysis[symbol].netProfit.toFixed(2)}
                                </TableCell>
                                <TableCell align="right">${tradeAnalysis[symbol].averageWin.toFixed(2)}</TableCell>
                                <TableCell align="right">${Math.abs(tradeAnalysis[symbol].averageLoss).toFixed(2)}</TableCell>
                              </TableRow>
                    
(Content truncated due to size limit. Use line ranges to read in chunks)