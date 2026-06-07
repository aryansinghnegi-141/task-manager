/**
 * errorHandler
 * Global Express error-handling middleware.
 * Express identifies error handlers by their 4-parameter signature: (err, req, res, next).
 * Any route or middleware that calls next(err) will end up here.
 *
 * @param {Error} err - The error object passed to next()
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next - Required in signature even if unused
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Log the full stack trace to the server console for debugging
  // In production, consider a logging library like winston or pino
  console.error("❌ Unhandled Error:", err.stack || err.message);

  // Determine an appropriate HTTP status code:
  // - If the error carries a statusCode property (custom errors), use it
  // - Otherwise default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;

  // Build a friendly, consistent error response matching the API's error format
  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected server error occurred.", // avoid leaking internals
  });
}

// Export for mounting in index.js after all other middleware and routes
module.exports = errorHandler;
