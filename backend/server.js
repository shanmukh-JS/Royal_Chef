const app = require('./app');
require('dotenv').config();
const db = require('./config/db'); // Tests DB connection on startup

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
