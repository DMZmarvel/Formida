import axios from 'axios';
import React from 'react';
import useCounter from '@/hooks/useCounter';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboard() {
  const token = localStorage.getItem('adminToken');
  const [data, setData] = React.useState<any>(null);

  const noticesCount = data?.notices?.totalNotices ?? 0;
  const vendorsCount = data?.vendors?.totalVendors ?? 0;
  const revenueCount = data?.revenue ?? 0;

  // Hooks MUST ALWAYS RUN inside component, before any return.
  const animatedNotices = useCounter(noticesCount);
  const animatedVendors = useCounter(vendorsCount);
  const animatedRevenue = useCounter(revenueCount);

  // Monthly filter state
  const [month, setMonth] = React.useState('All');

  React.useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="p-6 text-gray-500 animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  // Fake monthly data (Later we'll replace with real backend)
  const allData = [
    { month: 'Jan', revenue: 30000 },
    { month: 'Feb', revenue: 42000 },
    { month: 'Mar', revenue: 38000 },
    { month: 'Apr', revenue: 52000 },
    { month: 'May', revenue: 61000 },
    { month: 'Jun', revenue: 70000 },
  ];

  const filteredData =
    month === 'All' ? allData : allData.filter((d) => d.month === month);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Platform performance overview</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Total Notices</p>
          <p className="text-4xl font-bold text-blue-700 mt-2">
            {animatedNotices}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Total Vendors</p>
          <p className="text-4xl font-bold text-green-700 mt-2">
            {animatedVendors}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-4xl font-bold text-purple-700 mt-2">
            ₦{animatedRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* CHART + RECENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LINE CHART */}
        <div className="bg-white shadow-md rounded-lg p-6 xl:col-span-2">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg mb-3">Revenue Trend</h2>

            {/* MONTH FILTER */}
            <select
              className="border px-3 py-2 rounded text-sm"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="All">All Months</option>
              {allData.map((d) => (
                <option key={d.month} value={d.month}>
                  {d.month}
                </option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-3">Recent Activity</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-700 font-medium mb-1">
                Latest Notices
              </h3>
              {data.recentNotices.slice(0, 3).map((n: any) => (
                <div
                  key={n._id}
                  className="border-b py-2 text-sm text-gray-700"
                >
                  {n.ref} – {n.status}
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm text-gray-700 font-medium mb-1">
                New Vendors
              </h3>
              {data.recentVendors.slice(0, 3).map((v: any) => (
                <div
                  key={v._id}
                  className="border-b py-2 text-sm text-gray-700"
                >
                  {v.name} – {v.email}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
