import { rtnRes, log } from '#utils/helper.js';

export const errorHandler = (err, req, res, next) => {
  log(`Error: ${err.message}`, "error");
  if (err.stack) {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  rtnRes(res, statusCode, message);
};

export const notFoundHandler = (req, res, next) => {
  rtnRes(res, 404, `Route ${req.originalUrl} not found`);
};
