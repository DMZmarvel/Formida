import { NavLink } from 'react-router-dom';
import React from 'react';

export default function VendorSidebar({ open }: { open: boolean }) {
  const base = 'block px-4 py-2.5 rounded-lg text-sm font-medium transition';

  const linkClasses = ({ isActive }: any) =>
    isActive
      ? `${base} bg-blue-600 text-white`
      : `${base} text-gray-700 hover:bg-gray-200`;

  return (
    <aside
      className={`bg-white shadow-lg h-full fixed md:static top-0 left-0 z-40
        w-64 p-4 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-64 md:translate-x-0'}`}
    >
      <h1 className="text-xl font-bold mb-6 text-blue-700">Vendor Panel</h1>

      <nav className="space-y-2">
        <NavLink to="/vendor/dashboard" className={linkClasses}>
          Dashboard
        </NavLink>

        <NavLink to="/vendor/notices" className={linkClasses}>
          My Notices
        </NavLink>

        <NavLink to="/vendor/earnings" className={linkClasses}>
          Earnings
        </NavLink>
      </nav>
    </aside>
  );
}
