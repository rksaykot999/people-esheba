const errorHandler = (err, req, res, next) => {
  // If a response was already partially sent, delegate to Express' default
  // handler which will close the connection instead of crashing.
  if (res.headersSent) return next(err);

  const method = req.method;
  const url    = req.originalUrl || req.url;
  console.error(`💥 ${method} ${url} —`, err.stack || err.message || err);

  // ── MySQL / driver errors ───────────────────────────────────
  if (err.code === 'ER_DUP_ENTRY')
    return res.status(409).json({ success: false, message: 'Duplicate entry — this record already exists.' });

  if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_NO_REFERENCED_ROW_2')
    return res.status(400).json({ success: false, message: 'Referenced record does not exist.' });

  if (err.code === 'ER_ROW_IS_REFERENCED' || err.code === 'ER_ROW_IS_REFERENCED_2')
    return res.status(409).json({ success: false, message: 'Cannot delete — this record is still referenced by other data.' });

  if (err.code === 'ER_BAD_FIELD_ERROR' || err.code === 'ER_PARSE_ERROR')
    return res.status(400).json({ success: false, message: 'Invalid query parameters.' });

  // ── Auth / token errors ─────────────────────────────────────
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ success: false, message: 'Invalid token' });

  if (err.name === 'TokenExpiredError')
    return res.status(401).json({ success: false, message: 'Token expired, please log in again' });

  // ── Validation ──────────────────────────────────────────────
  if (err.name === 'ValidationError')
    return res.status(400).json({ success: false, message: err.message });

  // ── File upload (multer) errors ─────────────────────────────
  if (err.name === 'MulterError')
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : 'File upload error',
    });

  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && status >= 500
      ? 'Internal server error'
      : err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
