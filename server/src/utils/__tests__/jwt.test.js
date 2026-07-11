const jwt = require('jsonwebtoken');
const { signToken, verifyToken } = require('../jwt');

describe('jwt utils', () => {
  test('signToken produces a token that verifyToken can decode', () => {
    const token = signToken({ id: 42, role: 'admin' });
    expect(typeof token).toBe('string');
    const decoded = verifyToken(token);
    expect(decoded.id).toBe(42);
    expect(decoded.role).toBe('admin');
  });

  test('signed token carries an expiry claim', () => {
    const token = signToken({ id: 1 });
    const decoded = verifyToken(token);
    expect(decoded).toHaveProperty('iat');
    expect(decoded).toHaveProperty('exp');
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });

  test('verifyToken throws on a tampered token', () => {
    const token = signToken({ id: 1 });
    const tampered = token.slice(0, -2) + (token.endsWith('a') ? 'b' : 'a');
    expect(() => verifyToken(tampered)).toThrow();
  });

  test('verifyToken throws on garbage input', () => {
    expect(() => verifyToken('not-a-jwt')).toThrow();
  });

  test('token cannot be verified with a different secret', () => {
    const token = signToken({ id: 7 });
    expect(() => jwt.verify(token, 'a_totally_different_secret')).toThrow();
  });
});
