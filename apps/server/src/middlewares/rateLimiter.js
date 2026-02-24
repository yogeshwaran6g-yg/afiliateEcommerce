import { rtnRes, log } from '#utils/helper.js';

const rateLimitMap = new Map();

export const customRateLimit = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const max = options.max || 100;
  const message = options.message || 'Too many requests, please try again later';

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const rateData = rateLimitMap.get(ip);

    if (now > rateData.resetTime) {
      rateData.count = 1;
      rateData.resetTime = now + windowMs;
      return next();
    }

    rateData.count += 1;

    if (rateData.count > max) {
      log(`Rate limit exceeded for IP: ${ip}`, "error");
      return rtnRes(res, 429, message);
    }

    next();
  };
};

export const globalRateLimiter = customRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

export const authRateLimiter = customRateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  message: 'Too many authentication attempts, please try again after an hour'
});

// Periodic cleanup of the map to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 30 * 60 * 1000); // Cleanup every 30 minutes
