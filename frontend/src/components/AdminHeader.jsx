import React from 'react';

const AdminHeader = () => (
  <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow border-b-2 border-red-700">
    <div className="font-bold text-xl tracking-wide text-red-700">Admin Panel</div>
    <nav className="flex gap-6">
      <a href="/admin/dashboard" className="hover:text-red-400 transition">Dashboard</a>
      <a href="/admin/users" className="hover:text-red-400 transition">Users</a>
      <a href="/admin/owners" className="hover:text-red-400 transition">Owners</a>
      <a href="/admin/policies" className="hover:text-red-400 transition">Policies</a>
      <a href="/admin/analytics" className="hover:text-red-400 transition">Analytics</a>
    </nav>
    <div>
      <button className="bg-red-700 hover:bg-red-900 text-white px-4 py-1 rounded font-semibold shadow focus:outline-none focus:ring-2 focus:ring-red-500">Logout</button>
    </div>
  </header>
);

export default AdminHeader;
