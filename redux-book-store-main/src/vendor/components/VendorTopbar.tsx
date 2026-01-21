import React from 'react';

export default function VendorTopbar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const vendorName = localStorage.getItem('vendorName');

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4">
      <button
        className="md:hidden text-gray-600 text-2xl"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <h2 className="text-lg font-semibold text-gray-700">
        Welcome, {vendorName}
      </h2>

      <button
        className="text-red-600 text-sm"
        onClick={() => {
          localStorage.removeItem('vendorToken');
          localStorage.removeItem('vendorName');
          window.location.href = '/vendor/login';
        }}
      >
        Logout
      </button>
    </header>
  );
}
