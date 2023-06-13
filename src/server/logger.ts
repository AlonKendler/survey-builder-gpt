type Severity = {
  DEFAULT: string;
  DEBUG: string;
  INFO: string;
  NOTICE: string;
  WARNING: string;
  ERROR: string;
  CRITICAL: string;
  ALERT: string;
  EMERGENCY: string;
};

const SEVERITY: Severity = {
  DEFAULT: "DEFAULT",
  DEBUG: "DEBUG",
  INFO: "INFO",
  NOTICE: "NOTICE",
  WARNING: "WARNING",
  ERROR: "ERROR",
  CRITICAL: "CRITICAL",
  ALERT: "ALERT",
  EMERGENCY: "EMERGENCY",
};

const logger = {
  log: (
    severity: any,
    message: string | Record<string, unknown>,
    obj: Record<string, unknown> = {}
  ) => {
    let logMetadata: Record<string, unknown> = {};
    let logMessage: string | undefined;

    if (typeof obj === "object" && obj !== null) {
      logMetadata = { ...obj, ...logMetadata };
    } else {
      logMetadata = { ...logMetadata, additionalInfo: obj };
    }

    if (typeof message === "object" && message !== null) {
      logMetadata = { ...message, ...logMetadata };
    } else {
      logMessage = message;
    }

    console.log(
      JSON.stringify({
        severity,
        sandukMessage: logMessage,
        ...logMetadata,
      })
    );
  },
  debug(
    message: string | Record<string, unknown>,
    obj: Record<string, unknown> = {}
  ) {
    this.log(SEVERITY.DEBUG, message, obj);
  },
  info(
    message: string | Record<string, unknown>,
    obj: Record<string, unknown> = {}
  ) {
    this.log(SEVERITY.INFO, message, obj);
  },
  notice(
    message: string | Record<string, unknown>,
    obj: Record<string, unknown> = {}
  ) {
    this.log(SEVERITY.NOTICE, message, obj);
  },
  warning(
    message: string | Record<string, unknown>,
    obj: Record<string, unknown> = {}
  ) {
    this.log(SEVERITY.WARNING, message, obj);
  },
  error(
    message: string | Record<string, unknown>,
    obj: Record<string, unknown> = {}
  ) {
    this.log(SEVERITY.ERROR, message, obj);
  },
  critical(
    message: string | Record<string, unknown>,
    obj: Record<string, unknown> = {}
  ) {
    this.log(SEVERITY.CRITICAL, message, obj);
  },
  alert(
    message: string | Record<string, unknown>,
    obj: Record<string, unknown> = {}
  ) {
    this.log(SEVERITY.ALERT, message, obj);
  },
  emergency(
    message: string | Record<string, unknown>,
    obj: Record<string, unknown> = {}
  ) {
    this.log(SEVERITY.EMERGENCY, message, obj);
  },
};

export default logger;
