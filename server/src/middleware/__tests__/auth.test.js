jest.mock('../../utils/jwt', () => ({
  verifyToken: jest.fn(),
}));
jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

const { verifyToken } = require('../../utils/jwt');
const db = require('../../config/db');
const { protect, adminOnly } = require('../auth');

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('protect middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rejects when Authorization header is missing', async () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'No token provided' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects when header does not start with Bearer', async () => {
    const req = { headers: { authorization: 'Token abc' } };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects when the user does not exist', async () => {
    verifyToken.mockReturnValue({ id: 99 });
    db.execute.mockResolvedValue([[]]);
    const req = { headers: { authorization: 'Bearer validtoken' } };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'User not found' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a suspended (inactive) user with 403', async () => {
    verifyToken.mockReturnValue({ id: 1 });
    db.execute.mockResolvedValue([[{ id: 1, role: 'user', is_active: 0 }]]);
    const req = { headers: { authorization: 'Bearer validtoken' } };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Account is suspended' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('attaches user and calls next for a valid active user', async () => {
    const user = { id: 5, name: 'RK', email: 'rk@esheba.bd', role: 'user', is_active: 1 };
    verifyToken.mockReturnValue({ id: 5 });
    db.execute.mockResolvedValue([[user]]);
    const req = { headers: { authorization: 'Bearer validtoken' } };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('rejects when token verification throws', async () => {
    verifyToken.mockImplementation(() => { throw new Error('bad token'); });
    const req = { headers: { authorization: 'Bearer badtoken' } };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid or expired token' })
    );
    expect(next).not.toHaveBeenCalled();
  });
});

describe('adminOnly middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls next when user is an admin', () => {
    const req = { user: { role: 'admin' } };
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('rejects a non-admin user with 403', () => {
    const req = { user: { role: 'user' } };
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Admin access required' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects when req.user is missing', () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
