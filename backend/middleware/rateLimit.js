
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
let RateLimitLog;
try {
  RateLimitLog = mongoose.models.RateLimitLog || (await import('../models/RateLimitLog.js')).default;
} catch (e) {
  RateLimitLog = null;
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increase limit to 1000 requests per windowMs for development
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res, next) => {
    // Log blocked request
    try {
      await RateLimitLog.create({
        user: req.user?._id,
        ip: req.ip,
        endpoint: req.originalUrl,
        method: req.method,
        status: 'blocked',
        reason: 'Too many requests',
      });
    } catch (err) {}
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  },
});

export default limiter;
