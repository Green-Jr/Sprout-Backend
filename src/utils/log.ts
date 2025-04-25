import winston from 'winston';
import fs from 'fs';
import settings from "../data/settings.json";

const logDirectory = settings.logs.path;

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const myCustomLevels = {
  levels: {
    aud: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
  },
  colors: {
    debug: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red',
    aud: 'magenta',
  },
};

const timeFormat = { format: 'YYYY-MM-DD HH:mm:ss' };

const transports = {
  console: new winston.transports.Console({
    //colors
    level: 'error',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(timeFormat),
      winston.format.printf(log => {
        return `${log.timestamp} | IdLog: ${log.logId} | ${log.level} | ${JSON.stringify(log.message)}`;
      })
    ),
  }),
  file: new winston.transports.File({
    level: settings.logs.level,
    filename: `${logDirectory}/${settings.logs.file}`,
    format: winston.format.combine(
      winston.format.timestamp(timeFormat),
      winston.format.printf(log => {

        let jsonMessage = JSON.stringify({Date: log.timestamp, idLog: log.logId, Level: log.level, Message: log.message});
        return `${jsonMessage}`;
      })
    ),
  }),
};

const transportsList = [transports.file, transports.console];

winston.addColors(myCustomLevels.colors);

const logger = winston.createLogger({
  levels: myCustomLevels.levels,
  transports: transportsList,
});

export function Logger(userData?: null,  ip: string ='',idLog?: string, Authorization?: string,verify?: string,requestHeaders?: any) {
  let logId = parseInt(idLog || '0') || getNanoSecTimeStamp();
  const debug = async function ( ...logData: any) {
    logger.debug({logId, message: logData });
  };
  const info = async function (this: any, ...logData: any) {
    logger.info({ logId, message: logData });
  };
  const warn = async (...logData: any) => {
    logger.warn({logId, message: logData });
  };
  const error = async (...logData: any) => {
    logger.error({logId, message: logData });
  };

  return {
    debug,
    info,
    warn,
    error,
    userData,
    logId,
    ip: ip || "",
    Authorization: Authorization || "",
    verify: verify || "",
    requestHeaders
  };
}

function getNanoSecTimeStamp() {
  const hrTime = process.hrtime();
  return hrTime[0] * 10000 + hrTime[1];
}