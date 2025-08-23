import React, { useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const UserHeader = () => {
  const { user } = useContext(AuthContext);
  return (
    <header className="bg-blue-600 text-white py-4 px-6 flex items-center justify-between shadow">
      <div className="flex items-center gap-2">
        <FaUser className="h-6 w-6" />
        <span className="font-semibold text-lg">Welcome, {user?.name || user?.email}</span>
      </div>
      <div className="text-sm">User Dashboard</div>
    </header>
  );
};

export default UserHeader;
