import React from 'react';
import { FaHome, FaBicycle, FaClipboardList, FaRupeeSign } from 'react-icons/fa';

// This component displays owner dashboard widgets: PGs, Bikes, Bookings, and Revenue
const OwnerDashboardWidgets = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
      {/* PGs Widget */}
      <div className="bg-green-50 rounded-xl shadow p-4 flex flex-col items-center">
        <FaHome className="text-green-600 text-3xl mb-2" />
        <div className="text-lg font-bold">PGs</div>
        <div className="text-2xl">{stats?.pgs ?? 0}</div>
      </div>
      {/* Bikes Widget */}
      <div className="bg-blue-50 rounded-xl shadow p-4 flex flex-col items-center">
        <FaBicycle className="text-blue-600 text-3xl mb-2" />
        <div className="text-lg font-bold">Bikes</div>
        <div className="text-2xl">{stats?.bikes ?? 0}</div>
      </div>
      {/* Bookings Widget */}
      <div className="bg-yellow-50 rounded-xl shadow p-4 flex flex-col items-center">
        <FaClipboardList className="text-yellow-600 text-3xl mb-2" />
        <div className="text-lg font-bold">Bookings</div>
        <div className="text-2xl">{stats?.bookings ?? 0}</div>
      </div>
      {/* Revenue Widget */}
      <div className="bg-purple-50 rounded-xl shadow p-4 flex flex-col items-center">
        <FaRupeeSign className="text-purple-600 text-3xl mb-2" />
        <div className="text-lg font-bold">Revenue</div>
        <div className="text-2xl">₹{stats?.revenue ?? 0}</div>
      </div>
    </div>
  );
};

export default OwnerDashboardWidgets;
