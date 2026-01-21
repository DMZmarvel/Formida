import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/login`,
        { email, password }
      );

      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <form
        onSubmit={login}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          FORMIDA Admin
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Secure administrator access
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full border rounded-lg px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
