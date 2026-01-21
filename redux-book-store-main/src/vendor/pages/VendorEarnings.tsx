import React from 'react';
import axios from 'axios';

const API =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

export default function VendorEarnings() {
  const [data, setData] = React.useState<any>(null);

  const token = localStorage.getItem('adminToken');

  const load = async () => {
    const res = await axios.get(`${API}/vendor/earnings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setData(res.data);
  };

  React.useEffect(() => {
    load();
  }, []);

  if (!data) return <div className="p-6 text-gray-600">Loading earnings…</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Vendor Earnings</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold">
            ₦{data.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">
            Commission ({data.commissionPercent}%)
          </p>
          <p className="text-2xl font-bold text-blue-600">
            ₦{data.commissionEarned.toLocaleString()}
          </p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Total Notices</p>
          <p className="text-2xl font-bold">{data.totalNotices}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Ref</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {data.notices.map((n: any) => (
              <tr key={n._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{n.referenceId}</td>
                <td className="p-3">{n.type}</td>
                <td className="p-3">₦{n.price?.toLocaleString()}</td>
                <td className="p-3">{new Date(n.createdAt).toDateString()}</td>
              </tr>
            ))}

            {data.notices.length === 0 && (
              <tr>
                <td colSpan={4} className="p-5 text-center text-gray-500">
                  No paid notices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
