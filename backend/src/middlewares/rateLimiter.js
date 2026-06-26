import { ratelimit } from "../lib/redis.js";

const rateLimiter = async (req, res, next) => {
  const identifier = req.ip;

  const { success, limit, remaining, reset } =
    await ratelimit.limit(identifier);

  res.setHeader("X-RateLimit-Limit", limit);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", reset);

  if (!success) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Try again after 15 minutes.",
    });
  }

  next();
};

export default rateLimiter;