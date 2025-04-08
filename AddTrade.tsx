import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTrade, getAccounts, getSetups } from '../api/api';
import { Account, Setup, TradeFormData } from '../types';
import Layout from '../components/Layout';
import { useEffect } from 'react';

const AddTrade: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [setups, setSetups] = useState<Setup[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<TradeFormData>({
    accountId: '',
    symbol: '',
    assetClass: 'stock',
    direction: 'long',
    quantity: 0,
    entryPrice: 0,
    entryDate: new Date().toISOString().split('T')[0],
    exitPrice: undefined,
    exitDate: undefined,
    stopLoss: undefined,
    takeProfit: undefined,
    fees: 0,
    setupId: undefined,
    tags: [],
    mistakes: [],
    notes: '',
    rating: undefined
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch accounts
        const accountsRes = await getAccounts();
        setAccounts(accountsRes.data.data);
        
        if (accountsRes.data.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            accountId: accountsRes.data.data[0]._id
          }));
        }
        
        // Fetch setups
        const setupsRes = await getSetups();
        setSetups(setupsRes.data.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await createTrade(formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        accountId: formData.accountId, // Keep the selected account
        symbol: '',
        assetClass: 'stock',
        direction: 'long',
        quantity: 0,
        entryPrice: 0,
        entryDate: new Date().toISOString().split('T')[0],
        exitPrice: undefined,
        exitDate: undefined,
        stopLoss: undefined,
        takeProfit: undefined,
        fees: 0,
        setupId: undefined,
        tags: [],
        mistakes: [],
        notes: '',
        rating: undefined
      });
      
      // Navigate to trades list after a short delay
      setTimeout(() => {
        navigate('/trades');
      }, 1500);
    } catch (err) {
      console.error('Error creating trade:', err);
      setError('Failed to create trade');
    } finally {
      setSubmitting(false);
    }
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
            Add New Trade
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/trades')}
          >
            Back to Trades
          </Button>
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
              You need to create at least one trading account before adding trades.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/settings')}
            >
              Create Account
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="account-label">Account</InputLabel>
                    <Select
                      labelId="account-label"
                      name="accountId"
                      value={formData.accountId}
                      label="Account"
                      onChange={handleChange}
                      required
                    >
                      {accounts.map(account => (
                        <MenuItem key={account._id} value={account._id}>
                          {account.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Symbol"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="asset-class-label">Asset Class</InputLabel>
                    <Select
                      labelId="asset-class-label"
                      name="assetClass"
                      value={formData.assetClass}
                      label="Asset Class"
                      onChange={handleChange}
                    >
                      <MenuItem value="stock">Stock</MenuItem>
                      <MenuItem value="option">Option</MenuItem>
                      <MenuItem value="future">Future</MenuItem>
                      <MenuItem value="forex">Forex</MenuItem>
                      <MenuItem value="crypto">Crypto</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="direction-label">Direction</InputLabel>
                    <Select
                      labelId="direction-label"
                      name="direction"
                      value={formData.direction}
                      label="Direction"
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="long">Long</MenuItem>
                      <MenuItem value="short">Short</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: "any" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Entry Price"
                    name="entryPrice"
                    type="number"
                    value={formData.entryPrice}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: "any" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Entry Date"
                    name="entryDate"
                    type="date"
                    value={formData.entryDate}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Exit Price"
                    name="exitPrice"
                    type="number"
                    value={formData.exitPrice || ''}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: "any" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Exit Date"
                    name="exitDate"
                    type="date"
                    value={formData.exitDate || ''}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stop Loss"
                    name="stopLoss"
                    type="number"
                    value={formData.stopLoss || ''}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: "any" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Take Profit"
                    name="takeProfit"
                    type="number"
                    value={formData.takeProfit || ''}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: "any" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fees"
                    name="fees"
                    type="number"
                    value={formData.fees || ''}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: "any" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="setup-label">Setup</InputLabel>
                    <Select
                      labelId="setup-label"
                      name="setupId"
                      value={formData.setupId || ''}
                      label="Setup"
                      onChange={handleChange}
                    >
                      <MenuItem value="">None</MenuItem>
                      {setups.map(setup => (
                        <MenuItem key={setup._id} value={setup._id}>
                          {setup.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tags (comma separated)"
                    name="tags"
                    value={formData.tags?.join(', ') || ''}
                    onChange={handleTagsChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    multiline
                    rows={4}
                    value={formData.notes || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="rating-label">Rating</InputLabel>
                    <Select
                      labelId="rating-label"
                      name="rating"
                      value={formData.rating || ''}
                      label="Rating"
                      onChange={handleChange}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value={1}>1 - Poor</MenuItem>
                      <MenuItem value={2}>2 - Fair</MenuItem>
                      <MenuItem value={3}>3 - Average</MenuItem>
                      <MenuItem value={4}>4 - Good</MenuItem>
                      <MenuItem value={5}>5 - Excellent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => navigate('/trades')}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                    >
                      {submitting ? <CircularProgress size={24} /> : 'Add Trade'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
          message="Trade added successfully"
        />
      </Container>
    </Layout>
  );
};

export default AddTrade;
