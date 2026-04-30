const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error.middleware");

const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(morgan("dev"));

// Trust the gateway's IP to accurately read X-Forwarded-For
app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);



app.use(cookieParser());

app.use(express.json({ limit: "50kb" }));


app.use("/", authRoutes);
app.use(errorHandler);

module.exports = app;
