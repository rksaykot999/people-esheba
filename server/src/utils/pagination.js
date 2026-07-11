// ── utils/pagination.js ────────────────────────────────────────
// Shared helpers for the paginated list endpoints. Every list
// controller previously repeated the same three steps: parse
// page/limit, run a LIMIT/OFFSET query plus a COUNT query, then
// return { rows, total, page, pages }. These helpers centralise
// that logic so the pattern lives in exactly one place.

// Parse `?page` & `?limit` query params into safe integers.
const getPagination = (query = {}, defaultLimit = 20) => {
  const page  = Math.max(1, parseInt(query.page, 10)  || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || defaultLimit);
  return { page, limit, offset: (page - 1) * limit };
};

// Shape a consistent paginated list response body.
const paginated = (rows, total, page, limit) => ({
  rows,
  total,
  page,
  pages: Math.ceil(total / limit) || 1,
});

// Run a list query (with LIMIT/OFFSET appended) alongside its COUNT
// query and return the shaped response. `listSql` should end after
// its ORDER BY clause — the LIMIT/OFFSET is appended here.
const runPaginated = async (db, listSql, countSql, params, { page, limit }) => {
  const offset = (page - 1) * limit;
  const [rows] = await db.execute(
    `${listSql} LIMIT ${limit} OFFSET ${offset}`,
    params
  );
  const [[{ total }]] = await db.execute(countSql, params);
  return paginated(rows, total, page, limit);
};

module.exports = { getPagination, paginated, runPaginated };
