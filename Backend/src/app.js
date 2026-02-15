const express = require("express");
const cors = require("cors");
const userRoutes = require("./modules/user/user-routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const err = new Error(`العنوان ${req.originalUrl} غير موجود!`);
  err.statusCode = 404;
  next(err);
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
