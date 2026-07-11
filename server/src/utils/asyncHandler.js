/* ── asyncHandler ────────────────────────────────────────────
 * Wraps an async route handler so any thrown error / rejected
 * promise is forwarded to Express' error-handling middleware
 * (via next) instead of being silently swallowed as an
 * unhandled rejection.
 *
 *   router.get('/x', asyncHandler(controller.x));
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
