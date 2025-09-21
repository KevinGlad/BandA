import pinoHttp from "pino-http"
import { LoggerOptions } from "pino"

// Logging Configuration
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
export const LOGGER_OPTIONS: LoggerOptions = {
  formatters: {
    level(level) {
      return { level }
    },
  },
  level: LOG_LEVEL,
}

/**
 * Pino Http Logger, used as middleware for Express
 */
const middlewareLogger = pinoHttp(LOGGER_OPTIONS)

export default middlewareLogger