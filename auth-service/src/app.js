const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error.middleware");

const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(morgan("dev"));

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(cookieParser());

app.use(express.json());


app.use("/", authRoutes);
app.use(errorHandler);

module.exports = app;
