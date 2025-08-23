import React from 'react';
import { FaHome, FaList, FaBook, FaChartBar, FaBell, FaUserTie, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OwnerNavbar = () => (
  <nav className="bg-white shadow flex items-center justify-between px-6 py-3 sticky top-0 z-40">
    <div className="flex items-center gap-6">
      <Link to="/owner/dashboard" className="flex items-center gap-2 text-purple-900 font-bold hover:text-purple-700">
        <FaHome /> Dashboard
      </Link>
      <Link to="/owner/listings" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
        <FaList /> Listings
      </Link>
      <Link to="/owner/bookings" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
        <FaBook /> Bookings
      </Link>
      <Link to="/owner/analytics" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
        <FaChartBar /> Analytics
      </Link>
      <Link to="/owner/notifications" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
        <FaBell /> Notifications
      </Link>
      <Link to="/owner/profile" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
        <FaUserTie /> Profile
      </Link>
    </div>
    <button className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold">
      <FaSignOutAlt /> Logout
    </button>
  </nav>
);

export default OwnerNavbar;
