import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import VendorSidebar from './components/VendorSidebar';
import VendorTopbar from './components/VendorTopbar';

export default function VendorLayout() {
  const [open, setOpen] = React.useState(false);
  const token = localStorage.getItem('vendorToken');

  if (!token) return <Navigate to="/vendor/login" replace />;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <VendorSidebar open={open} />

      {/* Page content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <VendorTopbar toggleSidebar={() => setOpen(!open)} />

        <main className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
