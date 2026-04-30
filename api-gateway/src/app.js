const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const { rateLimit } = require("express-rate-limit");

const proxyRoutes = require("./routes/proxy.routes");
const authMiddleware = require("./middleware/auth.middleware");

const app = express();

// Trust the load balancer's IP to accurately read X-Forwarded-For
app.set("trust proxy", 1);

// Rate Limiting - Protect the entire gateway
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use(limiter);

// Anti-Spoofing: Strip x-user-id if it's already in the request
app.use((req, res, next) => {
  delete req.headers["x-user-id"];
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());

// GLOBAL AUTH
app.use(authMiddleware);

// Proxy
proxyRoutes(app);

module.exports = app;