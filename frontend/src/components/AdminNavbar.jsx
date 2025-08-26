import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaUsers, FaFileAlt, FaChartBar, FaCog, FaSignOutAlt, FaShieldAlt, FaEnvelope, FaClipboardList } from 'react-icons/fa';

const AdminNavbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any session expired flags before logout
    localStorage.removeItem('auth_session_expired');
    localStorage.removeItem('auth_last_activity');
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-red-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Brand */}
          <Link to="/admin" className="flex items-center space-x-2">
            <FaShieldAlt className="text-2xl" />
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/admin" 
              className="flex items-center space-x-1 hover:text-red-200 transition-colors"
            >
              <FaHome />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/admin/audit-logs" 
              className="flex items-center space-x-1 hover:text-red-200 transition-colors"
            >
              <FaClipboardList />
              <span>Audit Logs</span>
            </Link>
            
            <Link 
              to="/admin/email-templates" 
              className="flex items-center space-x-1 hover:text-red-200 transition-colors"
            >
              <FaEnvelope />
              <span>Email Templates</span>
            </Link>
            
            <Link 
              to="/admin/kyc-review" 
              className="flex items-center space-x-1 hover:text-red-200 transition-colors"
            >
              <FaFileAlt />
              <span>KYC Review</span>
            </Link>
            
            <Link 
              to="/analytics" 
              className="flex items-center space-x-1 hover:text-red-200 transition-colors"
            >
              <FaChartBar />
              <span>Analytics</span>
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
