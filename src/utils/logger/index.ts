// src/logger.ts
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

// Define custom colours for log levels
const customColors = {
  info: 'blue',
  warn: 'orange',
  error: 'red',
  debug: 'grey',
  log: 'green',
};

// Add colours to winston
import winston from 'winston';
winston.addColors(customColors);

// Define the custom format for log messages
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${level}] ${timestamp} ${message}`;
});

// Create the logger
const logger = createLogger({
  level: 'debug', // Default log level
  format: combine(
    timestamp({ format: 'HH:mm:ss' }), // Only time as per the example
    logFormat,
  ),
  transports: [
    new transports.Console({
      format: combine(colorize({ level: true }), logFormat),
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
