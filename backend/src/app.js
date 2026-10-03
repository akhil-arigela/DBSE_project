const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const mediaRoutes = require('./routes/media');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const transactionRoutes = require('./routes/transactions');
const agentRoutes = require('./routes/agents');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/agents', agentRoutes);

app.use(errorHandler);

module.exports = app;
