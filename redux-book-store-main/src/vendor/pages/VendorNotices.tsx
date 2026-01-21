import React from 'react';
import axios from 'axios';

const API =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

export default function VendorNotices() {
  const [rows, setRows] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const token = localStorage.getItem('adminToken');

  const load = async () => {
    const res = await axios.get(`${API}/vendor/my-notices`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { search, status, page, limit: 20 },
    });

    setRows(res.data.data || []);
    setTotal(res.data.total || 0);
  };

  React.useEffect(() => {
    load();
  }, [search, status, page]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Notices</h1>

      {/* FILTERS */}
      <div className="flex gap-3 mb-5">
        <input
          placeholder="Search reference or type…"
          className="border px-3 py-2 rounded"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          className="border px-3 py-2 rounded"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Ref</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Paid?</th>
              <th className="p-3 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((n) => (
              <tr key={n._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono">{n.referenceId}</td>
                <td className="p-3">{n.type}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      n.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : n.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {n.status}
                  </span>
                </td>

                <td className="p-3">
                  {n.paid ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-red-600">Unpaid</span>
                  )}
                </td>

                <td className="p-3">{new Date(n.createdAt).toDateString()}</td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td className="p-5 text-center text-gray-500" colSpan={5}>
                  No notices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex justify-between">
        <button
          className="px-4 py-2 border rounded"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} of {Math.max(1, Math.ceil(total / 20))}
        </span>

        <button
          className="px-4 py-2 border rounded"
          disabled={page >= Math.ceil(total / 20)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
