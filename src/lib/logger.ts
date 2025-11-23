enum LogLevel {
  Info = "INFO",
  Error = "ERROR",
  Success = "SUCCESS",
  Failure = "FAILURE",
  Debug = "DEBUG",
}

/**
 * Helper function to log information
 * @param level Log level - [INFO, ERROR, SUCCESS, FAILURE, DEBUG]
 * @param msg Log message
 * @param data Option, Log data / error if any
 */
const printLog = (level: LogLevel, msg: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  if (data !== undefined) {
    console.log(`[${timestamp}] [${level}] ${msg}`, data);
  } else {
    console.log(`[${timestamp}] [${level}] ${msg}`);
  }
};

/**
 * Helper function to Log INFO events
 * @param msg Log message
 * @param data Log data
 */
export const logInfo = (msg: string, data?: unknown) => {
  printLog(LogLevel.Info, msg, data);
};

/**
 * Helper function to Log ERROR events
 * @param msg Log message
 * @param data Log data
 */
export const logError = (msg: string, data?: unknown) => {
  printLog(LogLevel.Error, msg, data);
};

/**
 * Helper function to Log SUCCESS events
 * @param msg Log message
 * @param data Log data
 */
export const logSuccess = (msg: string, data?: unknown) => {
  printLog(LogLevel.Success, msg, data);
};

/**
 * Helper function to Log FAILURE events
 * @param msg Log message
 * @param data Log data
 */
export const logFailure = (msg: string, data?: unknown) => {
  printLog(LogLevel.Failure, msg, data);
};

/**
 * Helper function to Log DEBUG events
 * @param msg Log message
 * @param data Log data
 */
export const logDebug = (msg: string, data?: unknown) => {
  console.debug(`[${new Date().toISOString()}] [${LogLevel.Debug}] ${msg}`, data ?? "");
};

