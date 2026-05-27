/**
 * asyncHandler — wraps async Express route handlers to eliminate
 * per-controller try/catch boilerplate. Any thrown error is forwarded
 * to the centralized error middleware via next().
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
