import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static z-30 bg-[#0A1325] text-white w-64 h-full transform 
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="p-4 text-xl font-bold">FORMIDA Admin</div>

        <nav className="px-4 space-y-2">
          <a href="/admin/dashboard" className="block py-2">
            Dashboard
          </a>
          <a href="/admin/notices" className="block py-2">
            Notices
          </a>
          <a href="/admin/pricing" className="block py-2">
            Pricing
          </a>
          <a href="/admin/vendors" className="block py-2">
            Vendors
          </a>
          <a href="/admin/admin-users" className="block py-2">
            Admin Users
          </a>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        {/* TOPBAR FOR MOBILE */}
        <div className="lg:hidden bg-white p-3 shadow flex items-center">
          <button onClick={() => setOpen(true)}>
            <Bars3Icon className="w-7 h-7 text-gray-800" />
          </button>
          <span className="ml-4 font-semibold text-gray-800 text-lg">
            Admin Panel
          </span>
        </div>

        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
