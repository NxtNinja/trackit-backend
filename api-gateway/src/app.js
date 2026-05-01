const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");

const proxyRoutes = require("./routes/proxy.routes");
const authMiddleware = require("./middleware/auth.middleware");

const app = express();

// Security Headers
app.use(helmet());

// Trust the load balancer's IP to accurately read X-Forwarded-For
app.set("trust proxy", 1);

// Anti-Spoofing: Strip internal headers if they exist in incoming request
app.use((req, res, next) => {
  delete req.headers["x-user-id"];
  delete req.headers["x-internal-service-key"];
  next();
});

// Centralized CORS - Only allow the frontend
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "x-internal-service-key"],
  })
);

app.use(morgan("dev"));
app.use(cookieParser());

// Global Rate Limiting - Protect the entire gateway
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased to 1000 to handle dashboard component bursts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use(limiter);

// GLOBAL AUTH
app.use(authMiddleware);

// Proxy
proxyRoutes(app);

module.exports = app;