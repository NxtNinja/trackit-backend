const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const errorHandler = require("./middleware/error.middleware");
const serviceAuth = require("./middleware/serviceAuth.middleware");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(morgan("dev"));

// Trust the gateway's IP to accurately read X-Forwarded-For
app.set("trust proxy", 1);

app.use(helmet());

// Internal Service Authentication - Ensure requests come from the Gateway
app.use(serviceAuth);

app.use(cookieParser());
app.use(express.json({ limit: "50kb" }));

app.use("/", authRoutes);
app.use(errorHandler);

module.exports = app;
