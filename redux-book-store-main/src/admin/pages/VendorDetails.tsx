import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

export default function VendorDetails() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [vendor, setVendor] = React.useState<any>(null);
  const [stats, setStats] = React.useState<any>(null);
  const [recent, setRecent] = React.useState<any[]>([]);

  const load = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get(`${API}/admin/vendors/details/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVendor(data.vendor);
      setStats(data.stats);
      setRecent(data.recent);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="p-5">Loading vendor details…</div>;
  if (!vendor) return <div className="p-5">Vendor not found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{vendor.name}</h1>

      {/* Summary Card */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <p className="text-gray-700">
          <strong>Email:</strong> {vendor.email}
        </p>
        <p className="text-gray-700">
          <strong>Phone:</strong> {vendor.phone}
        </p>
        <p className="text-gray-700">
          <strong>Commission:</strong> {vendor.commissionPct}%
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Created: {new Date(vendor.createdAt).toDateString()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded shadow text-center">
          <p className="text-xs text-gray-500">Total Notices</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-green-50 p-4 rounded shadow text-center">
          <p className="text-xs text-green-700">Approved</p>
          <p className="text-xl font-bold text-green-800">{stats.approved}</p>
        </div>

        <div className="bg-amber-50 p-4 rounded shadow text-center">
          <p className="text-xs text-amber-700">Pending</p>
          <p className="text-xl font-bold text-amber-800">{stats.pending}</p>
        </div>

        <div className="bg-rose-50 p-4 rounded shadow text-center">
          <p className="text-xs text-rose-700">Rejected</p>
          <p className="text-xl font-bold text-rose-800">{stats.rejected}</p>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="font-semibold text-lg">Revenue</h2>
        <p className="text-2xl font-bold mt-2">
          ₦{stats.revenue.toLocaleString()}
        </p>
      </div>

      {/* Recent Notices */}
      <h2 className="font-semibold text-lg mb-2">Recent Notices</h2>

      <div className="bg-white rounded-xl shadow divide-y">
        {recent.length === 0 ? (
          <p className="p-4 text-gray-600 text-sm">No recent notices.</p>
        ) : (
          recent.map((n) => (
            <div key={n._id} className="p-4">
              <p className="font-semibold text-gray-800">{n.referenceId}</p>
              <p className="text-sm text-gray-500">
                {n.type} • {new Date(n.createdAt).toDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
