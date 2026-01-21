import React from 'react';
import axios from 'axios';

const API =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

export default function Vendors() {
  const token = localStorage.getItem('adminToken');

  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    commissionPct: 10,
    password: '',
  });

  const load = async () => {
    setLoading(true);
    const { data } = await axios.get(`${API}/admin/vendors/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRows(data.data || []);
    setLoading(false);
  };

  React.useEffect(() => {
    load();
  }, []);

  const saveVendor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API}/admin/vendors/${editingId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(`${API}/admin/vendors`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setForm({
      name: '',
      email: '',
      phone: '',
      commissionPct: 10,
      password: '',
    });
    setEditingId(null);
    load();
  };

  const startEdit = (v: any) => {
    setEditingId(v._id);
    setForm({
      name: v.name,
      email: v.email,
      phone: v.phone,
      commissionPct: v.commissionPct,
      password: '',
    });
  };

  const deleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    await axios.delete(`${API}/admin/vendors/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  const togglePricing = async (v: any) => {
    await axios.put(
      `${API}/admin/vendors/${v._id}`,
      { pricingEnabled: !v.pricingEnabled },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    load();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vendors</h1>

      {/* CREATE / EDIT FORM */}
      <form onSubmit={saveVendor} className="bg-white p-5 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">
          {editingId ? 'Edit Vendor' : 'Add New Vendor'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Vendor Name"
            className="border rounded px-3 py-2"
            required
          />

          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="border rounded px-3 py-2"
            required
          />

          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone Number"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            value={form.password || ''}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Vendor Password"
            className="border rounded px-3 py-2"
            required={!editingId}
          />

          <input
            type="number"
            value={form.commissionPct}
            onChange={(e) =>
              setForm({ ...form, commissionPct: Number(e.target.value) })
            }
            placeholder="Commission %"
            className="border rounded px-3 py-2"
            required
          />
        </div>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update Vendor' : 'Create Vendor'}
        </button>

        {editingId && (
          <button
            type="button"
            className="ml-3 text-sm text-gray-600 underline"
            onClick={() => {
              setEditingId(null);
              setForm({
                name: '',
                email: '',
                phone: '',
                commissionPct: 10,
                password: '',
              });
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* VENDOR LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rows.map((v) => (
          <div
            key={v._id}
            className="bg-white shadow-sm rounded-xl border p-5 hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {v.name}
                </h3>
                <p className="text-sm text-gray-500">{v.email}</p>
                <p className="text-sm text-gray-500">{v.phone}</p>
              </div>

              {/* Commission badge */}
              <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-md">
                {v.commissionPct}% Commission
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <p className="text-xs text-gray-500">Total Notices</p>
                <p className="font-semibold text-gray-800">
                  {v.totalNotices ?? 0}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md text-center">
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="font-semibold text-gray-800">
                  ₦{(v.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Pricing Toggle */}
            <button
              onClick={() => togglePricing(v)}
              className={`w-full py-2 rounded-md text-sm mb-4 ${
                v.pricingEnabled
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {v.pricingEnabled ? 'Pricing Enabled' : 'Pricing Disabled'}
            </button>

            {/* Action buttons */}
            <div className="flex justify-between pt-2 border-t">
              <button
                onClick={() => startEdit(v)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteVendor(v._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
