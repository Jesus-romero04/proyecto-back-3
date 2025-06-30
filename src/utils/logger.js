import winston from 'winston';

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'magenta',
    error: 'red',
    warning: 'yellow',
    info: 'cyan',
    http: 'green',
    debug: 'blue'
  }
};

winston.addColors(customLevels.colors);

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.File({ filename: 'errors.log', level: 'error' }),
    new winston.transports.Console({ level: 'info' })
  ]
});

Object.keys(customLevels.levels).forEach(level => {
  devLogger[level] = (msg) => devLogger.log(level, msg);
  prodLogger[level] = (msg) => prodLogger.log(level, msg);
});

export const getLogger = () => {
  return process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
};
