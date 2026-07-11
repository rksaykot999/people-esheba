const jwt = require('jsonwebtoken');

const SECRET  = process.env.JWT_SECRET;
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

if (!SECRET || SECRET.length < 32) {
  throw new Error(
    'JWT_SECRET is missing or too weak. Set JWT_SECRET to a long random string ' +
    '(at least 32 characters) in the environment before starting the server.'
  );
}

const signToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES });

const verifyToken = (token) =>
  jwt.verify(token, SECRET);

module.exports = { signToken, verifyToken };
