const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('./src/config/config');

// Import routes
const accountRoutes = require('./src/routes/accountsRouter');
const authRoutes = require('./src/routes/authRouter');
const tradeRoutes = require('./src/routes/tradesRouter');
const journalRoutes = require('./src/routes/journalRouter');
const setupRoutes = require('./src/routes/setupsRouter');
const analyticsRoutes = require('./src/routes/analyticsRouter');

// Initialize express app
const app = express();

// Body parser middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Add security headers
app.use(helmet());

// Logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/setups', setupRoutes);
app.use('/api/analytics', analyticsRoutes);

// Define root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Trading Journal API' });
});

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
// Fix: Use accountsRouter for proper routing
