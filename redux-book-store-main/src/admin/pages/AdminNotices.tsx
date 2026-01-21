import React from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/Toast';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';

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
  const [selected, setSelected] = React.useState<Row | null>(null);

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

  const token = localStorage.getItem('adminToken');

  const fetchAll = React.useCallback(async () => {
    if (!token) {
      addToast('error', 'You must be logged in as admin.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/notices/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, page, limit },
      });

      const data: Row[] = res.data?.data ?? [];
      let filtered = data;

      if (status) filtered = filtered.filter((d) => d.status === status);
      if (type) filtered = filtered.filter((d) => d.type === type);
      if (paid) filtered = filtered.filter((d) => String(d.paid) === paid);

      setRows(filtered);
      setTotal(res.data?.total ?? filtered.length);
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
      await axios.put(`${API_BASE}/admin/notices/${action}/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast('success', `Notice ${action}d.`);
      fetchAll();
    } catch (err) {
      addToast('error', `Failed to ${action} notice.`);
    }
  };

  const exportCSV = (data: Row[]) => {
    const header = ['Reference', 'Type', 'Status', 'Paid', 'User', 'Email'];
    const rows = data.map((d) => [
      d.referenceId,
      d.type,
      d.status,
      d.paid ? 'Yes' : 'No',
      d.user?.name,
      d.user?.email,
    ]);

    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'notices.csv';
    a.click();
  };

  const Modal = ({ notice, close }: any) => {
    if (!notice) return null;

    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl w-[90%] max-w-lg p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-3">Notice Details</h2>

          <div className="space-y-2 text-sm">
            <p>
              <b>Reference:</b> {notice.referenceId}
            </p>
            <p>
              <b>Type:</b> {notice.type}
            </p>
            <p>
              <b>Status:</b> {notice.status}
            </p>
            <p>
              <b>Paid:</b> {notice.paid ? 'Yes' : 'No'}
            </p>
            <p>
              <b>Submitted by:</b> {notice.user?.name} ({notice.user?.email})
            </p>

            <p className="pt-3">
              <b>Content:</b>
            </p>
            <div className="p-3 bg-gray-100 rounded text-gray-800 text-sm">
              {notice.content}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={() => act(notice._id, 'reject')}
            >
              Reject
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => act(notice._id, 'approve')}
            >
              Approve
            </button>
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={close}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notices</h1>
          <p className="text-gray-500">Review, approve or reject notices.</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border p-4 rounded-xl mb-6 shadow-sm grid gap-3 md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search notices..."
          className="border rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-indigo-200"
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as any);
          }}
          className="border rounded-lg px-3 py-2 text-sm w-full"
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
          className="border rounded-lg px-3 py-2 text-sm w-full"
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
          className="border rounded-lg px-3 py-2 text-sm w-full"
        >
          <option value="">Payment</option>
          <option value="true">Paid</option>
          <option value="false">Unpaid</option>
        </select>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => rows.forEach((r) => act(r._id, 'approve'))}
        >
          Approve All
        </button>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={() => rows.forEach((r) => act(r._id, 'reject'))}
        >
          Reject All
        </button>

        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={() => exportCSV(rows)}
        >
          Export CSV
        </button>
      </div>

      {selected && <Modal notice={selected} close={() => setSelected(null)} />}

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left">Ref</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Paid</th>
              <th className="px-4 py-3 text-left">Submitted</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  Loading notices…
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  No notices found.
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((r) => (
                <tr
                  key={r._id}
                  className="border-t hover:bg-indigo-50 cursor-pointer transition"
                  onClick={() => setSelected(r)}
                >
                  <td className="px-4 py-3 font-mono">{r.referenceId}</td>

                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {r.user?.name}
                    </div>
                    <div className="text-gray-500 text-xs">{r.user?.email}</div>
                  </td>

                  <td className="px-4 py-3 capitalize">{r.type}</td>

                  <td className="px-4 py-3">
                    {r.status === 'approved' && (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircleIcon className="w-4" /> Approved
                      </span>
                    )}
                    {r.status === 'rejected' && (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircleIcon className="w-4" /> Rejected
                      </span>
                    )}
                    {r.status === 'pending' && (
                      <span className="text-yellow-600 flex items-center gap-1">
                        <ClockIcon className="w-4" /> Pending
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {r.paid ? (
                      <span className="px-2 py-1 text-xs rounded-lg bg-green-100 text-green-600">
                        Paid
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-lg bg-red-100 text-red-600">
                        Unpaid
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-600">
                    {new Date(r.createdAt ?? '').toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => act(r._id, 'approve')}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => act(r._id, 'reject')}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
