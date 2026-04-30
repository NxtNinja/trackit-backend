const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error.middleware");
const AppError = require("./utils/AppError");

const transactionRoutes = require("./routes/transaction.routes");
const recurringRoutes = require("./routes/recurring.routes");
const categoryRoutes = require("./routes/category.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const budgetRoutes = require("./routes/budget.routes");

const app = express();

app.use(helmet());
app.use(morgan("dev"));

// Trust the gateway's IP to accurately read X-Forwarded-For
app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);



app.use(cookieParser());
app.use(express.json({ limit: "50kb" }));

app.use("/", transactionRoutes);
app.use("/recurring", recurringRoutes);
app.use("/category", categoryRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/budgets", budgetRoutes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
