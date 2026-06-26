import { ratelimit } from "../lib/redis.js";

const rateLimiter = async (req, res, next) => {
  try {
    const identifier =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.ip;

    console.log("Identifier:", identifier);

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
  } catch (error) {
    console.error("Rate limiter error:", error);

    // Allow the request if Upstash is temporarily unavailable
    next();
  }
};

export default rateLimiter;