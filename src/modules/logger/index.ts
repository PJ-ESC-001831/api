import { createLogger, format, transports } from 'winston';
import winston from 'winston';

const { combine, timestamp, printf, label } = format;

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
const customFormat = printf(({ level, message, timestamp, label }) => {
  let logMessage = {
    timestamp,
    label,
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
const defaultLogger = (location: string | null = null) =>
  createLogger({
    level: 'debug', // Default log level
    format: combine(
      label({ label: location ?? 'default' }),
      timestamp({
        format: () =>
          new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).format(new Date()),
      }),
      customFormat,
    ),
    transports: [
      new transports.Console({
        format: combine(customFormat),
      }),
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
      new transports.File({ filename: 'logs/combined.log' }),
    ],
  });

// This labelled logger will typically be used in a class or module.
export const labeledLogger = (location: string) => {
  return defaultLogger(location);
};

// This default logger will be used in the rest of the application.
export default defaultLogger();
