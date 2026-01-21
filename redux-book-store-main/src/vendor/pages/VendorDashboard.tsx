import React from 'react';
import axios from 'axios';

const API =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

export default function VendorDashboard() {
  const [data, setData] = React.useState<any>(null);
  const token = localStorage.getItem('adminToken');

  const load = async () => {
    const res = await axios.get(`${API}/vendor/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setData(res.data);
  };

  React.useEffect(() => {
    load();
  }, []);

  if (!data)
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Vendor Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard label="Total Notices" value={data.totalNotices} />

        <DashboardCard label="Paid Notices" value={data.paidNotices} />

        <DashboardCard
          label="Total Revenue"
          value={`₦${data.totalRevenue.toLocaleString()}`}
        />

        <DashboardCard
          label="Commission Earned"
          value={`₦${data.commissionEarned.toLocaleString()}`}
        />
      </div>

      {/* RECENT NOTICES */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-3">Recent Notices</h2>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Ref</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Paid</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {data.recent.map((n: any) => (
              <tr key={n._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{n.referenceId}</td>
                <td className="p-2">{n.type}</td>
                <td className="p-2">{n.paid ? 'Yes' : 'No'}</td>
                <td className="p-2">₦{(n.price || 0).toLocaleString()}</td>
                <td className="p-2">{new Date(n.createdAt).toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.recent.length === 0 && (
          <p className="text-gray-500 text-center py-4">No notices yet.</p>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ label, value }: any) {
  return (
    <div className="bg-white shadow rounded p-4">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
