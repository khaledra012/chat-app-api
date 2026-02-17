const express = require("express");
const cors = require("cors");
const userRoutes = require("./modules/user/user-routes");
const AppError = require("./shared/utils/AppError");
const messageRouter = require("./modules/message/message-routes");
const app = express();
const morgan = require("morgan");
app.use(cors());
// app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/messages", messageRouter);

app.use((req, res, next) => {
  next(
    new AppError(`العنوان ${req.originalUrl} غير موجود في هذا السيرفر!`, 404),
  );
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
