import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Fab
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getJournalEntries } from '../api/api';
import { JournalEntry } from '../types';
import Layout from '../components/Layout';

const Journal: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: '',
    tags: ''
  });

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const res = await getJournalEntries({
          page,
          limit: 10,
          ...filters,
          tags: filters.tags ? filters.tags.split(',').map(tag => tag.trim()) : undefined
        });
        
        if (page === 1) {
          setEntries(res.data.data);
        } else {
          setEntries(prev => [...prev, ...res.data.data]);
        }
        
        setHasMore(res.data.data.length === 10);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching journal entries:', err);
        setError('Failed to load journal entries');
        setLoading(false);
      }
    };

    fetchEntries();
  }, [page, filters]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    if (name) {
      setFilters(prev => ({ ...prev, [name]: value }));
      setPage(1); // Reset to first page when filters change
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Trading Journal
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Filters */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Filter Journal Entries
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="type-label">Entry Type</InputLabel>
                    <Select
                      labelId="type-label"
                      name="type"
                      value={filters.type}
                      label="Entry Type"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="pre-market">Pre-Market</MenuItem>
                      <MenuItem value="post-session">Post-Session</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Tags (comma separated)"
                    name="tags"
                    value={filters.tags}
                    onChange={handleFilterChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Journal Entries */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              {loading && page === 1 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : entries.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    No Journal Entries Found
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Start journaling your trading thoughts and reflections to improve your performance.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/journal/add')}
                    startIcon={<AddIcon />}
                  >
                    Create First Entry
                  </Button>
                </Box>
              ) : (
                <>
                  <List>
                    {entries.map((entry) => (
                      <React.Fragment key={entry._id}>
                        <ListItem 
                          alignItems="flex-start" 
                          button 
                          onClick={() => navigate(`/journal/${entry._id}`)}
                          sx={{ py: 2 }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="h6" component="div">
                                {entry.title}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                  sx={{ display: 'block', mb: 1 }}
                                >
                                  {formatDate(entry.createdAt)} • {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} Entry
                                </Typography>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {entry.content}
                                </Typography>
                                {entry.tags && entry.tags.length > 0 && (
                                  <Box sx={{ mt: 1 }}>
                                    {entry.tags.map((tag, index) => (
                                      <Typography
                                        key={index}
                                        component="span"
                                        variant="body2"
                                        sx={{
                                          bgcolor: 'primary.light',
                                          color: 'primary.contrastText',
                                          borderRadius: 1,
                                          px: 1,
                                          py: 0.5,
                                          mr: 1,
                                          fontSize: '0.75rem'
                                        }}
                                      >
                                        {tag}
                                      </Typography>
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                  
                  {hasMore && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Button 
                        onClick={handleLoadMore} 
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Load More'}
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => navigate('/journal/add')}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Layout>
  );
};

export default Journal;
