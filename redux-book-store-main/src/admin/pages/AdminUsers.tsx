import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/Toast';

const API = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

export default function AdminUsers() {
  const token = localStorage.getItem('adminToken');
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetId, setResetId] = useState('');
  const [password, setPassword] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(res.data.data || []);
    } catch {
      addToast('error', 'Failed to load admin users');
    }
    setLoading(false);
  };

  // CREATE ADMIN
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    roles: ['moderator'],
    vendorId: '',
  });

  const createAdmin = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/users`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast('success', 'Admin created');
      setShowCreate(false);
      fetchUsers();
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Failed');
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await axios.put(
        `${API}/admin/users/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast('success', 'Status updated');
      fetchUsers();
    } catch {
      addToast('error', 'Failed to change status');
    }
  };

  const resetPassword = async () => {
    try {
      await axios.put(
        `${API}/admin/users/${resetId}/reset-password`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast('success', 'Password reset');
      setShowReset(false);
      setPassword('');
    } catch {
      addToast('error', 'Reset failed');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Admin
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : rows.length === 0 ? (
        <p>No admin users found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 text-left">User</th>
                <th className="py-2">Role</th>
                <th className="py-2">Vendor</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((ad) => (
                <tr key={ad._id} className="border-b">
                  <td className="py-3">
                    <p className="font-semibold">{ad.name}</p>
                    <p className="text-xs text-gray-500">{ad.email}</p>
                  </td>

                  {/* ROLES BADGE */}
                  <td className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        ad.roles.includes('super_admin')
                          ? 'bg-purple-100 text-purple-700'
                          : ad.roles.includes('vendor_admin')
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {ad.roles[0].replace('_', ' ').toUpperCase()}
                    </span>
                  </td>

                  {/* Vendor */}
                  <td className="text-center text-sm text-gray-600">
                    {ad.vendorId ? ad.vendorId.name : '—'}
                  </td>

                  {/* STATUS */}
                  <td className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        ad.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {ad.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>

                  <td className="text-right">
                    <button
                      onClick={() => {
                        setResetId(ad._id);
                        setShowReset(true);
                      }}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Reset Password
                    </button>

                    <button
                      onClick={() => toggleActive(ad._id)}
                      className="text-orange-600 hover:underline mr-3"
                    >
                      {ad.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    {/* Optional Delete */}
                    {/* <button className="text-red-600 hover:underline">Delete</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE ADMIN MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-96 p-5 rounded-xl shadow-xl">
            <h2 className="text-lg font-semibold mb-3">Create Admin</h2>

            <form onSubmit={createAdmin} className="space-y-3">
              <input
                className="border w-full p-2 rounded"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="border w-full p-2 rounded"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                type="password"
                className="border w-full p-2 rounded"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <select
                className="border w-full p-2 rounded"
                value={form.roles[0]}
                onChange={(e) => setForm({ ...form, roles: [e.target.value] })}
              >
                <option value="moderator">Moderator</option>
                <option value="super_admin">Super Admin</option>
                <option value="vendor_admin">Vendor Admin</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {showReset && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-96 p-5 rounded-xl shadow-xl">
            <h2 className="text-lg font-semibold mb-3">Reset Password</h2>

            <input
              className="border w-full p-2 rounded mb-3"
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReset(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={resetPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
