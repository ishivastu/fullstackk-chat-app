import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  handler: (req, res) => {
    console.log("Rate limit exceeded for:", req.ip);

    res.status(429).json({
      message: "Too many requests",
    });
  },
});

export default rateLimiter;