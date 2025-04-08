import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getTrades, deleteTrade, getAccounts } from '../api/api';
import { Trade, Account } from '../types';
import Layout from '../components/Layout';

const Trades: React.FC = () => {
  const navigate = useNavigate();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTrades, setTotalTrades] = useState(0);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({
    accountId: '',
    symbol: '',
    status: '',
    direction: '',
    startDate: '',
    endDate: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await getAccounts();
        setAccounts(res.data.data);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts');
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        const res = await getTrades({
          page: page + 1,
          limit: rowsPerPage,
          ...filters
        });
        setTrades(res.data.data);
        setTotalTrades(res.data.total);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trades:', err);
        setError('Failed to load trades');
        setLoading(false);
      }
    };

    fetchTrades();
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    if (name) {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFilterSubmit = () => {
    setPage(0);
    setOpenFilter(false);
  };

  const handleFilterReset = () => {
    setFilters({
      accountId: '',
      symbol: '',
      status: '',
      direction: '',
      startDate: '',
      endDate: ''
    });
    setPage(0);
    setOpenFilter(false);
  };

  const handleDeleteClick = (tradeId: string) => {
    setTradeToDelete(tradeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (tradeToDelete) {
      try {
        await deleteTrade(tradeToDelete);
        setTrades(trades.filter(trade => trade._id !== tradeToDelete));
        setTotalTrades(prev => prev - 1);
      } catch (err) {
        console.error('Error deleting trade:', err);
        setError('Failed to delete trade');
      }
    }
    setDeleteDialogOpen(false);
    setTradeToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTradeToDelete(null);
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Trades
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />} 
              onClick={() => setOpenFilter(true)}
              sx={{ mr: 1 }}
            >
              Filter
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => navigate('/trades/add')}
            >
              Add Trade
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Direction</TableCell>
                  <TableCell>Entry Date</TableCell>
                  <TableCell>Entry Price</TableCell>
                  <TableCell>Exit Date</TableCell>
                  <TableCell>Exit Price</TableCell>
                  <TableCell>P&L</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : trades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No trades found
                    </TableCell>
                  </TableRow>
                ) : (
                  trades.map((trade) => (
                    <TableRow key={trade._id}>
                      <TableCell>{trade.symbol}</TableCell>
                      <TableCell>
                        <Chip 
                          label={trade.direction.toUpperCase()} 
                          color={trade.direction === 'long' ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{new Date(trade.entryDate).toLocaleDateString()}</TableCell>
                      <TableCell>${trade.entryPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {trade.exitDate ? new Date(trade.exitDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Typography 
                          color={trade.pnl && trade.pnl > 0 ? 'success.main' : 
                                 trade.pnl && trade.pnl < 0 ? 'error.main' : 'text.primary'}
                        >
                          {trade.pnl ? `$${trade.pnl.toFixed(2)}` : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={trade.status.toUpperCase()} 
                          color={trade.status === 'open' ? 'primary' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => navigate(`/trades/${trade._id}`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteClick(trade._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalTrades}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Filter Dialog */}
        <Dialog open={openFilter} onClose={() => setOpenFilter(false)}>
          <DialogTitle>Filter Trades</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="account-label">Account</InputLabel>
                  <Select
                    labelId="account-label"
                    name="accountId"
                    value={filters.accountId}
                    label="Account"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All Accounts</MenuItem>
                    {accounts.map(account => (
                      <MenuItem key={account._id} value={account._id}>
                        {account.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Symbol"
                  name="symbol"
                  value={filters.symbol}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={filters.status}
                    label="Status"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="direction-label">Direction</InputLabel>
                  <Select
                    labelId="direction-label"
                    name="direction"
                    value={filters.direction}
                    label="Direction"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="long">Long</MenuItem>
                    <MenuItem value="short">Short</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFilterReset}>Reset</Button>
            <Button onClick={handleFilterSubmit} variant="contained">Apply</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this trade? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Trades;
