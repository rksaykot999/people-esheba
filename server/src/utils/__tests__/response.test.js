const { ok, err } = require('../response');

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('response utils', () => {
  describe('ok', () => {
    test('uses defaults when only res is provided', () => {
      const res = mockRes();
      ok(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data: {},
      });
    });

    test('passes through data, message and status', () => {
      const res = mockRes();
      const data = { id: 1, name: 'RK' };
      ok(res, data, 'Created', 201);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Created',
        data,
      });
    });

    test('returns the result of res.json for chaining', () => {
      const res = mockRes();
      expect(ok(res)).toBe(res);
    });
  });

  describe('err', () => {
    test('uses defaults when only res is provided', () => {
      const res = mockRes();
      err(res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error',
      });
    });

    test('sets custom message and status', () => {
      const res = mockRes();
      err(res, 'Not found', 404);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not found',
      });
    });

    test('includes errors object only when provided', () => {
      const res = mockRes();
      const errors = { email: 'required' };
      err(res, 'Validation failed', 422, errors);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors,
      });
    });

    test('omits errors key when errors is null', () => {
      const res = mockRes();
      err(res, 'Bad request', 400, null);
      const payload = res.json.mock.calls[0][0];
      expect(payload).not.toHaveProperty('errors');
    });
  });
});
