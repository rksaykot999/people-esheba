const errorHandler = (err, req, res, next) => {
  console.error('💥', err.message);

  if (err.code === 'ER_DUP_ENTRY')
    return res.status(409).json({ success: false, message: 'Duplicate entry — this record already exists.' });

  if (err.name === 'ValidationError')
    return res.status(400).json({ success: false, message: err.message });

  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
};

module.exports = errorHandler;
