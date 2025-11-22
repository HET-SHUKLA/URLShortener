export enum LogLevel {
  Info = "INFO",
  Error = "ERROR",
  Success = "SUCCESS",
  Failure = "FAILURE",
}

const printLog = (level: LogLevel, msg: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  if (data !== undefined) {
    console.log(`[${timestamp}] [${level}] ${msg}`, data);
  } else {
    console.log(`[${timestamp}] [${level}] ${msg}`);
  }
};

export const logInfo = (msg: string, data?: unknown) => {
  printLog(LogLevel.Info, msg, data);
};

export const logError = (msg: string, data?: unknown) => {
  printLog(LogLevel.Error, msg, data);
};

export const logSuccess = (msg: string, data?: unknown) => {
  printLog(LogLevel.Success, msg, data);
};

export const logFailure = (msg: string, data?: unknown) => {
  printLog(LogLevel.Failure, msg, data);
};
