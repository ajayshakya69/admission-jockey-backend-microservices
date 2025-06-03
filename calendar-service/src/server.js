require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');

// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calendar-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const calendarRoutes = require('./routes/calendar.routes');
const reminderRoutes = require('./routes/reminder.routes');

// Use routes
app.use('/calendar', calendarRoutes);
app.use('/reminders', reminderRoutes);

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('MongoDB connected'))
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

const { exec } = require('child_process');

// Start server
const PORT = process.env.PORT || 3007;
const SERVICE_NAME = 'calendar-service';
const SERVICE_ID = 'calendar-service-' + PORT;
const SERVICE_ADDRESS = process.env.SERVICE_ADDRESS || 'localhost';

const server = app.listen(PORT, () => {
  logger.info(`calendar-service running on port ${PORT}`);

  // Register service with Consul
  exec(`bash ../service-discovery/scripts/register-service.sh ${SERVICE_NAME} ${SERVICE_ID} ${SERVICE_ADDRESS} ${PORT}`, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error registering service: ${error.message}`);
      return;
    }
    logger.info(`Service registered: ${stdout}`);
  });
});

// Deregister service on shutdown
function cleanup() {
  exec(`bash ../service-discovery/scripts/deregister-service.sh ${SERVICE_ID}`, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error deregistering service: ${error.message}`);
    } else {
      logger.info(`Service deregistered: ${stdout}`);
    }
    process.exit();
  });
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = app;
