/**
 * notFound — catches any request that doesn't match a defined route
 * and passes a structured 404 error to the error handler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * errorHandler — centralized error middleware.
 * Normalizes all thrown errors into a consistent JSON response shape:
 * { success: false, message: "...", stack: "..." (dev only) }
 *
 * Handles:
 *  - Mongoose CastError  → 400 (bad ObjectId)
 *  - Mongoose validation → 400 with all field messages
 *  - Mongoose duplicate  → 409
 *  - JWT errors          → 401
 *  - Everything else     → statusCode || 500
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message    || "Internal Server Error";

  // Mongoose bad ObjectId (e.g. /products/not-valid-id)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message    = "Invalid resource ID format";
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message    = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
  }

  // MongoDB duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message    = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message    = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message    = "Token expired — please log in again";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
