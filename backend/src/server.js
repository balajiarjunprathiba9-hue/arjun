const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializePool } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    project: 'Interactive Database System Structure Visualization Tool',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      schema: '/api/schema',
      relationships: '/api/relationships',
      tables: '/api/tables',
      query: '/api/query',
      operations: '/api/operations/insert',
      reset: '/api/reset'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: err.message || 'Internal server error occurred.'
    }
  });
});

// Start Server
async function startServer() {
  await initializePool();
  
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 DB Visualizer Backend running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📘 Schema API:   http://localhost:${PORT}/api/schema`);
    console.log(`=======================================================`);
  });
}

startServer();
