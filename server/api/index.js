// Vercel serverless entry point — আসল Express অ্যাপটি লোড করা হচ্ছে
// (src/server.js এ পুরো অ্যাপ, routes, database ও auth সব আছে)
try {
  module.exports = require('../src/server.js');
} catch (error) {
  module.exports = (req, res) => {
    res.status(500).json({
      success: false,
      message: 'Server Initialization Error',
      error: error.message,
      stack: error.stack
    });
  };
}
