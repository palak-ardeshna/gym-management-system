export const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  const payload = {
    success: false,
    message: error.message || "Internal server error",
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    payload.stack = error.stack;
  }

  res.status(statusCode).json(payload);
};
