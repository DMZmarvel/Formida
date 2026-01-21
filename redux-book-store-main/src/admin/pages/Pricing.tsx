import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Pricing() {
  const token = localStorage.getItem('adminToken');
  const API = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', price: '' });
  const [editId, setEditId] = useState('');

  const loadPricing = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/pricing`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(res.data.data || []);
    } catch (err) {
      console.log(err);
      alert('Failed to load pricing');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPricing();
  }, []);

  const savePricing = async (e: any) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `${API}/admin/pricing/${editId}`,
          { ...form, price: Number(form.price) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API}/admin/pricing`,
          { ...form, price: Number(form.price) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setShowModal(false);
      setForm({ title: '', price: '' });
      setEditId('');
      loadPricing();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const deletePricing = async (id: string) => {
    if (!confirm('Delete this pricing item?')) return;

    try {
      await axios.delete(`${API}/admin/pricing/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      loadPricing();
    } catch {
      alert('Failed to delete');
    }
  };

  const toggleActive = async (item: any) => {
    try {
      await axios.put(
        `${API}/admin/pricing/${item._id}`,
        { isActive: !item.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadPricing();
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Pricing Manager</h1>

        <button
          onClick={() => {
            setShowModal(true);
            setEditId('');
            setForm({ title: '', price: '' });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Pricing
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : rows.length === 0 ? (
        <p>No pricing items yet.</p>
      ) : (
        <div className="bg-white p-5 rounded-xl shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 text-left">Title</th>
                <th className="py-2">Price</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="py-3">{item.title}</td>
                  <td className="text-center font-semibold">₦{item.price}</td>

                  <td className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>

                  <td className="text-right">
                    <button
                      onClick={() => {
                        setEditId(item._id);
                        setForm({ title: item.title, price: item.price });
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleActive(item)}
                      className="text-orange-600 hover:underline mr-3"
                    >
                      {item.isActive ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      onClick={() => deletePricing(item._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-96 rounded-xl p-5 shadow-xl">
            <h2 className="text-lg font-semibold mb-3">
              {editId ? 'Edit Pricing' : 'Add Pricing'}
            </h2>

            <form onSubmit={savePricing} className="space-y-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  {editId ? 'Save' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
