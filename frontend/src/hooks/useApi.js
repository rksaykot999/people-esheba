import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/* ── useApi — generic fetch hook ─────────────────────────────
 *  const { data, loading, error, refetch } = useApi('/jobs', { params: { page: 1 } })
 */
export const useApi = (url, options = {}) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(async (overrideOptions = {}) => {
    try {
      setLoading(true); setError(null);
      const res = await api.get(url, { ...options, ...overrideOptions });
      setData(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [url]); // eslint-disable-line

  useEffect(() => { if (url) fetch(); }, [url]); // eslint-disable-line

  return { data, loading, error, refetch: fetch };
};

/* ── useMutation — POST/PUT/DELETE ───────────────────────────
 *  const { mutate, loading } = useMutation()
 *  await mutate('post', '/jobs', body)
 */
export const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const mutate = useCallback(async (method, url, data = null, config = {}) => {
    try {
      setLoading(true); setError(null);
      const res = await api[method](url, data, config);
      return res.data;
    } catch (e) {
      const msg = e.response?.data?.message || 'Request failed';
      setError(msg); throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

/* ── usePaginated — paginated list fetch ─────────────────────*/
export const usePaginated = (url, initialParams = {}) => {
  const [items,   setItems]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [params,  setParams]  = useState(initialParams);

  const load = useCallback(async (p = page, q = params) => {
    try {
      setLoading(true);
      const res = await api.get(url, { params: { ...q, page: p } });
      const d   = res.data.data;
      setItems(d.rows || d);
      setTotal(d.total  ?? (d.rows?.length ?? 0));
      setPages(d.pages  ?? 1);
      setPage(p);
    } catch { /* silently handled */ }
    finally  { setLoading(false); }
  }, [url, page, params]);

  useEffect(() => { load(1, params); }, [url]); // eslint-disable-line

  const updateParams = (newParams) => {
    const merged = { ...params, ...newParams };
    setParams(merged);
    load(1, merged);
  };

  return { items, total, pages, page, loading, load, updateParams };
};
