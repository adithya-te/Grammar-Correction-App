/**
 * Main server file for Grammar Correction API
 * Starts the Express server and handles graceful shutdown
 */

const app = require('./src/app');
const port = process.env.PORT || 3001;

// Start the server
const server = app.listen(port, () => {
  console.log(`🚀 Grammar Correction API server running on port ${port}`);
  console.log(`📝 API endpoint: http://localhost:${port}/api/correct`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;