import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast';

type Notice = {
  _id: string;
  referenceId: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  paid: boolean;
  content?: string;
  publishAt?: string;
  price?: number;
  createdAt?: string;
};

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

export default function MyNotices() {
  const { addToast } = useToast();

  const [items, setItems] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);

  const fetchNotices = React.useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/notices/my`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
      });

      // Normalize: support either [] or { data, total, ... }
      const payload = res.data;
      const list: Notice[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : [];

      const count =
        typeof payload?.total === 'number'
          ? payload.total
          : Array.isArray(payload)
          ? payload.length
          : list.length;

      setItems(list);
      setTotal(count);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to fetch notices.';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, addToast]);

  React.useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-2xl border bg-white shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Submitted Notices
            </h1>
            <p className="mt-1 text-gray-600">
              Track your submissions and next steps.
            </p>
          </div>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-gray-600">Loading…</div>
        ) : error ? (
          <div className="mt-6 text-sm text-rose-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="mt-6 text-sm text-gray-600">
            No notices submitted yet.
          </div>
        ) : (
          <ul className="mt-6 grid gap-4">
            {items.map((n) => (
              <li
                key={n._id}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Ref:
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-800">
                    {n.referenceId}
                  </span>
                  <span className="rounded border px-2 py-0.5 text-xs text-gray-700 capitalize">
                    {n.type?.replace('-', ' ')}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 text-xs ${
                      n.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : n.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {n.status.toUpperCase()}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 text-xs ${
                      n.paid
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {n.paid ? 'PAID' : 'UNPAID'}
                  </span>
                </div>

                {n.content && (
                  <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                    {n.content}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-gray-500">
                  <span>
                    Created:{' '}
                    {n.createdAt ? new Date(n.createdAt).toDateString() : '—'}
                  </span>
                  <span>
                    Publish:{' '}
                    {n.publishAt ? new Date(n.publishAt).toDateString() : '—'}
                  </span>
                  {n.price != null && (
                    <span>₦{Number(n.price).toLocaleString()}</span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={`/notice/preview/${n.referenceId}`}
                    className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                  >
                    Preview
                  </Link>
                  {!n.paid && (
                    <Link
                      to={`/pay/${n.referenceId}`}
                      className="rounded-xl bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
                    >
                      Pay Now
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {!loading && !error && items.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Page {page} of {Math.max(1, Math.ceil(total / limit))} • {total}{' '}
              total
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-800 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page >= Math.max(1, Math.ceil(total / limit))}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
