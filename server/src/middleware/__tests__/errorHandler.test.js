const errorHandler = require('../errorHandler');

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('errorHandler middleware', () => {
  const OLD_ENV = process.env.NODE_ENV;
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    process.env.NODE_ENV = OLD_ENV;
  });

  test('handles duplicate entry (ER_DUP_ENTRY) with 409', () => {
    const res = mockRes();
    errorHandler({ code: 'ER_DUP_ENTRY', message: 'dup' }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: expect.stringContaining('Duplicate') })
    );
  });

  test('handles ValidationError with 400 and the error message', () => {
    const res = mockRes();
    errorHandler({ name: 'ValidationError', message: 'email required' }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'email required' })
    );
  });

  test('uses err.statusCode when present', () => {
    const res = mockRes();
    process.env.NODE_ENV = 'development';
    errorHandler({ statusCode: 418, message: 'teapot' }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(418);
  });

  test('falls back to err.status when statusCode is absent', () => {
    const res = mockRes();
    errorHandler({ status: 404, message: 'missing' }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('defaults to 500 when no status is provided', () => {
    const res = mockRes();
    errorHandler({ message: 'boom' }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('exposes the real message in non-production', () => {
    const res = mockRes();
    process.env.NODE_ENV = 'development';
    errorHandler({ message: 'detailed failure' }, {}, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'detailed failure' })
    );
  });

  test('hides the real message in production', () => {
    const res = mockRes();
    process.env.NODE_ENV = 'production';
    errorHandler({ message: 'detailed failure' }, {}, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Internal server error' })
    );
  });
});
