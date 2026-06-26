import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per `window` (here, per 1 minute)

  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after a minute',
  },
});

export default rateLimiter;