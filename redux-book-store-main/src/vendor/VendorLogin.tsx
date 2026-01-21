import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VendorLogin() {
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/vendor/login`,
        { email, password }
      );

      localStorage.setItem('vendorToken', res.data.token);
      localStorage.setItem('vendorName', res.data.vendor.name);

      nav('/vendor/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={login} className="bg-white w-96 p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Vendor Login</h2>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Vendor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-600 w-full text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
