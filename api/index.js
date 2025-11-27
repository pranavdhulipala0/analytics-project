require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/database');
const { connectKafka, disconnectKafka } = require('./config/kafka');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', true);

app.use('/api/v1', routes);

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: `${req.method} ${req.path} is not a valid endpoint`
  });
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

async function startServer() {
  try {
    await connectDatabase();
    await connectKafka();
    
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  
  try {
    await disconnectKafka();
    console.log('Server shut down successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer().catch(console.error);