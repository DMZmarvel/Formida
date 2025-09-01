import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast';

type Notice = {
  _id: string;
  referenceId: string;
  type: 'change-of-name' | 'lost-document' | 'court-affidavit' | string;
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

export default function Dashboard() {
  const { addToast } = useToast();

  const [items, setItems] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // pagination
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);

  const token = React.useMemo(() => localStorage.getItem('token'), []);

  const fetchNotices = React.useCallback(async () => {
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

      // Normalize both shapes: [] or { data, total, ... }
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
      const msg =
        err?.response?.data?.message || 'Failed to fetch your notices.';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  }, [token, page, limit, addToast]);

  React.useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // derived stats
  const stats = React.useMemo(() => {
    const total = items.length;
    const approved = items.filter((n) => n.status === 'approved').length;
    const pending = items.filter((n) => n.status === 'pending').length;
    const rejected = items.filter((n) => n.status === 'rejected').length;
    const paid = items.filter((n) => n.paid).length;
    return { total, approved, pending, rejected, paid };
  }, [items]);

  const badgeForStatus = (s: Notice['status']) =>
    s === 'approved'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : s === 'rejected'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

  const badgeForPaid = (p: boolean) =>
    p
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header / CTA */}
      <div className="mb-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-[1px]">
          <div className="rounded-2xl bg-white/90 p-6 md:p-7 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="mt-1 text-gray-600">
                  Overview of your notices, statuses, and next steps.
                </p>
              </div>
              <Link
                to="/notice"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm text-white hover:bg-blue-700"
              >
                + Submit New Notice
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Approved" value={stats.approved} tone="emerald" />
        <StatCard label="Pending" value={stats.pending} tone="amber" />
        <StatCard label="Rejected" value={stats.rejected} tone="rose" />
        <StatCard label="Paid" value={stats.paid} tone="blue" />
      </div>

      {/* Content */}
      <div className="rounded-2xl border bg-white shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Notices
            </h2>
            <p className="text-sm text-gray-600">
              Latest submissions with quick actions.
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
            You haven’t submitted any notices yet.
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
                    className={`rounded border px-2 py-0.5 text-xs ${badgeForStatus(
                      n.status
                    )}`}
                  >
                    {n.status.toUpperCase()}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 text-xs ${badgeForPaid(
                      n.paid
                    )}`}
                  >
                    {n.paid ? 'PAID' : 'UNPAID'}
                  </span>
                </div>

                {n.content && (
                  <div className="mt-2 text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">
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
              Page {page} of {totalPages} • {total} total
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
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

/** Small stat card */
function StatCard({
  label,
  value,
  tone = 'slate',
}: {
  label: string;
  value: number | string;
  tone?: 'slate' | 'emerald' | 'amber' | 'rose' | 'blue';
}) {
  const toneMap: Record<string, string> = {
    slate: 'bg-slate-50 border-slate-200 text-slate-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    rose: 'bg-rose-50 border-rose-200 text-rose-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  return (
    <div className={`rounded-2xl border p-4 ${toneMap[tone]}`}>
      <div className="text-sm">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
