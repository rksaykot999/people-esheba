import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fmtDate,
  fmtRelative,
  fmtMoney,
  pct,
  trunc,
  initials,
  bloodColor,
  jobTypeColor,
  statusColor,
  buildQuery,
  debounce,
  DIVISIONS,
  BLOOD_GROUPS,
  JOB_TYPES,
  DONATION_CATEGORIES,
  VOLUNTEER_CATEGORIES,
  EMERGENCY_TYPES,
} from './helpers';

describe('fmtDate', () => {
  test('returns em dash for falsy input', () => {
    expect(fmtDate(null)).toBe('—');
    expect(fmtDate(undefined)).toBe('—');
    expect(fmtDate('')).toBe('—');
  });

  test('formats a valid date into a non-empty string containing the year', () => {
    const out = fmtDate('2024-03-15T00:00:00Z');
    expect(typeof out).toBe('string');
    expect(out).toContain('2024');
  });
});

describe('fmtRelative', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-10T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns empty string for falsy input', () => {
    expect(fmtRelative(null)).toBe('');
    expect(fmtRelative(undefined)).toBe('');
  });

  test('"Just now" for under a minute', () => {
    expect(fmtRelative(new Date('2024-01-10T11:59:30Z'))).toBe('Just now');
  });

  test('minutes ago', () => {
    expect(fmtRelative(new Date('2024-01-10T11:45:00Z'))).toBe('15m ago');
  });

  test('hours ago', () => {
    expect(fmtRelative(new Date('2024-01-10T09:00:00Z'))).toBe('3h ago');
  });

  test('days ago', () => {
    expect(fmtRelative(new Date('2024-01-08T12:00:00Z'))).toBe('2d ago');
  });

  test('falls back to absolute date beyond a week', () => {
    const out = fmtRelative(new Date('2023-12-01T12:00:00Z'));
    expect(out).toContain('2023');
  });
});

describe('fmtMoney', () => {
  test('returns em dash for null/undefined', () => {
    expect(fmtMoney(null)).toBe('—');
    expect(fmtMoney(undefined)).toBe('—');
  });

  test('formats zero (not treated as missing)', () => {
    expect(fmtMoney(0)).toContain('৳');
    expect(fmtMoney(0)).toContain('0');
  });

  test('formats a number with the taka symbol', () => {
    const out = fmtMoney(1500);
    expect(out.startsWith('৳')).toBe(true);
    expect(out).toContain('1');
  });
});

describe('pct', () => {
  test('returns 0 when needed is missing or zero', () => {
    expect(pct(50, 0)).toBe(0);
    expect(pct(50, null)).toBe(0);
    expect(pct(50, undefined)).toBe(0);
  });

  test('computes a rounded percentage', () => {
    expect(pct(50, 200)).toBe(25);
    expect(pct(1, 3)).toBe(33);
  });

  test('caps at 100 when raised exceeds needed', () => {
    expect(pct(500, 200)).toBe(100);
  });
});

describe('trunc', () => {
  test('leaves short strings unchanged', () => {
    expect(trunc('hello', 120)).toBe('hello');
  });

  test('truncates and appends an ellipsis', () => {
    const out = trunc('abcdefghij', 5);
    expect(out).toBe('abcde…');
  });

  test('trims trailing whitespace before the ellipsis', () => {
    const out = trunc('abcd      efgh', 6);
    expect(out).toBe('abcd…');
  });

  test('defaults to empty string with no args', () => {
    expect(trunc()).toBe('');
  });
});

describe('initials', () => {
  test('returns two uppercase initials from a full name', () => {
    expect(initials('Rk Saykot')).toBe('RS');
  });

  test('uses only the first two words', () => {
    expect(initials('md jumman khan')).toBe('MJ');
  });

  test('single name yields a single initial', () => {
    expect(initials('Admin')).toBe('A');
  });

  test('returns ? for empty name', () => {
    expect(initials('')).toBe('?');
    expect(initials()).toBe('?');
  });
});

describe('bloodColor', () => {
  test('maps known blood groups', () => {
    expect(bloodColor('A+')).toBe('#E63946');
    expect(bloodColor('O-')).toBe('#059669');
  });

  test('returns fallback grey for unknown groups', () => {
    expect(bloodColor('Z+')).toBe('#94A3B8');
    expect(bloodColor()).toBe('#94A3B8');
  });
});

describe('jobTypeColor', () => {
  test('maps known job types', () => {
    expect(jobTypeColor('full-time')).toBe('cyan');
    expect(jobTypeColor('govt')).toBe('red');
  });

  test('returns gray for unknown types', () => {
    expect(jobTypeColor('unknown')).toBe('gray');
  });
});

describe('statusColor', () => {
  test('maps known statuses', () => {
    expect(statusColor('pending')).toBe('amber');
    expect(statusColor('approved')).toBe('green');
    expect(statusColor('shortlisted')).toBe('purple');
  });

  test('returns gray for unknown statuses', () => {
    expect(statusColor('mystery')).toBe('gray');
  });
});

describe('buildQuery', () => {
  test('builds a query string from params', () => {
    expect(buildQuery({ page: 1, q: 'test' })).toBe('page=1&q=test');
  });

  test('drops empty, null and undefined values', () => {
    expect(buildQuery({ a: 1, b: '', c: null, d: undefined, e: 2 })).toBe('a=1&e=2');
  });

  test('url-encodes keys and values', () => {
    expect(buildQuery({ 'q p': 'a&b' })).toBe('q%20p=a%26b');
  });

  test('keeps zero values', () => {
    expect(buildQuery({ page: 0 })).toBe('page=0');
  });

  test('returns empty string for an empty object', () => {
    expect(buildQuery({})).toBe('');
  });
});

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test('invokes the function only once after the delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 400);
    debounced();
    debounced();
    debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(400);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('passes the latest arguments through', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);
    debounced('a');
    debounced('b');
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledWith('b');
  });
});

describe('constant collections', () => {
  test('expose the expected option lists', () => {
    expect(DIVISIONS).toContain('Dhaka');
    expect(DIVISIONS).toHaveLength(8);
    expect(BLOOD_GROUPS).toEqual(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
    expect(JOB_TYPES).toContain('govt');
    expect(DONATION_CATEGORIES).toContain('medical');
    expect(VOLUNTEER_CATEGORIES).toContain('tech');
    expect(EMERGENCY_TYPES).toContain('ambulance');
  });
});
