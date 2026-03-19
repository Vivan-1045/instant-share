const rateLimit = require("express-rate-limit");

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  message: {
    error: "Too many requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 10, 
  message: {
    error: "Too many uploads. Please try again later.",
  },
});

// Password attempt limiter
const passwordLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 5, 
  message: {
    error: "Too many password attempts. Try again later.",
  },
});

module.exports = {
  apiLimiter,
  uploadLimiter,
  passwordLimiter,
};