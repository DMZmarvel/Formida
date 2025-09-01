import React from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/Toast';

type Row = {
  _id: string;
  referenceId: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  paid: boolean;
  publishAt?: string;
  price?: number;
  newspaper?: string;
  content?: string;
  user?: { name: string; email: string };
  createdAt?: string;
};

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

export default function AdminNotices() {
  const { addToast } = useToast();

  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<
    '' | 'pending' | 'approved' | 'rejected'
  >('');
  const [type, setType] = React.useState<
    '' | 'change-of-name' | 'lost-document' | 'court-affidavit'
  >('');
  const [paid, setPaid] = React.useState<'' | 'true' | 'false'>('');

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);

  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<Row[]>([]);
  const [total, setTotal] = React.useState(0);

  const token = localStorage.getItem('token');

  const fetchAll = React.useCallback(async () => {
    if (!token) {
      addToast('error', 'You must be logged in as admin.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/notices/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, page, limit },
      });
      // client-side filter for minimalism (optionally move to server)
      let data: Row[] = res.data?.data ?? [];
      if (status) data = data.filter((d) => d.status === status);
      if (type) data = data.filter((d) => d.type === type);
      if (paid) data = data.filter((d) => String(d.paid) === paid);
      setRows(data);
      setTotal(res.data?.total ?? data.length);
    } catch (err: any) {
      addToast('error', 'Failed to load admin notices.');
    } finally {
      setLoading(false);
    }
  }, [token, search, page, limit, status, type, paid, addToast]);

  React.useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const act = async (id: string, action: 'approve' | 'reject') => {
    if (!token) return;
    try {
      await axios.put(`${API_BASE}/notices/${action}/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast('success', `Notice ${action}d.`);
      fetchAll();
    } catch (err: any) {
      addToast('error', `Failed to ${action} notice.`);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl border bg-white shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin — Notices
            </h1>
            <p className="mt-1 text-gray-600">
              Moderate, approve, or reject submissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              {[20, 30, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search (name, ref, type, email)…"
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as any);
            }}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={type}
            onChange={(e) => {
              setPage(1);
              setType(e.target.value as any);
            }}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option value="change-of-name">Change of Name</option>
            <option value="lost-document">Lost Document</option>
            <option value="court-affidavit">Court Affidavit</option>
          </select>
          <select
            value={paid}
            onChange={(e) => {
              setPage(1);
              setPaid(e.target.value as any);
            }}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Paid?</option>
            <option value="true">Paid</option>
            <option value="false">Unpaid</option>
          </select>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Ref</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Paid</th>
                <th className="py-2 pr-4">Publish</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-4 text-gray-600" colSpan={7}>
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="py-4 text-gray-600" colSpan={7}>
                    No records.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r._id} className="border-t">
                    <td className="py-2 pr-4">
                      <div className="font-mono">{r.referenceId}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(r.createdAt ?? '').toDateString()}
                      </div>
                    </td>
                    <td className="py-2 pr-4">{r.type?.replace('-', ' ')}</td>
                    <td className="py-2 pr-4">
                      <div className="text-gray-800">{r.user?.name ?? '—'}</div>
                      <div className="text-xs text-gray-500">
                        {r.user?.email ?? '—'}
                      </div>
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className={`rounded border px-2 py-0.5 text-xs ${
                          r.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : r.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className={`rounded border px-2 py-0.5 text-xs ${
                          r.paid
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {r.paid ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-700">
                      {r.publishAt ? new Date(r.publishAt).toDateString() : '—'}
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => act(r._id, 'approve')}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700 text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => act(r._id, 'reject')}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700 text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </div>
    </div>
  );
}
