import { getLogger } from '../utils/logger.js';

export const addLogger = (req, res, next) => {
  req.logger = getLogger();
  req.logger.http(`${req.method} ${req.url}`);
  next();
};
