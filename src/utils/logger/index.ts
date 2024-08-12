import { createLogger, format, transports } from 'winston';
import winston from 'winston';

const { combine, timestamp, printf, colorize } = format;

// Define custom colours for log levels
const customColors = {
  info: 'green',
  warn: 'orange',
  error: 'red',
  debug: 'grey',
  log: 'blue',
};

// Add colours to winston
winston.addColors(customColors);

// Custom format to handle both strings and objects
const customFormat = printf(({ level, message, timestamp }) => {
  let logMessage = {
    timestamp,
    level,
    message,
  };

  // If the message is an object, merge it with the log message
  if (typeof message === 'object') {
    logMessage = { ...logMessage, ...message };
  }

  return JSON.stringify(logMessage);
});

// Create the logger
const logger = createLogger({
  level: 'debug', // Default log level
  format: combine(timestamp({ format: 'HH:mm:ss' }), customFormat),
  transports: [
    new transports.Console({
      format: combine(colorize({ level: true }), customFormat),
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
