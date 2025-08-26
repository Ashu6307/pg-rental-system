import React, { useContext, useState, useEffect, useRef } from 'react';
import { FaBell, FaUserTie, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const OwnerHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Dummy notification count, replace with real data if available
  const notificationCount = user?.notifications?.length || 3;
  const ownerName = user?.businessName || user?.ownerName || user?.name || 'Owner';
  const avatarUrl = user?.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(ownerName);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setShowDropdown(false); // Close dropdown immediately
    
    try {
      await logout();
      navigate('/owner/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      localStorage.clear();
      window.location.href = '/owner/login';
    }
  };

  return (
    <header className="bg-purple-900 text-white py-4 px-6 flex justify-between items-center shadow">
      <div className="font-bold text-2xl tracking-wide flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8 rounded-full bg-white" />
        PG & Bike Rental Owner Panel
      </div>
      <div className="flex items-center gap-6">
        <button className="relative">
          <FaBell className="text-xl" />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-1">{notificationCount}</span>
          )}
        </button>
        
        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-purple-800 px-3 py-2 rounded-lg transition-colors"
          >
            <img src={avatarUrl} alt="Owner Avatar" className="h-8 w-8 rounded-full border-2 border-white" />
            <span className="font-semibold">{ownerName}</span>
            <FaChevronDown className={`text-sm transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button 
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/owner/profile');
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaUserTie className="text-gray-500" />
                Profile Settings
              </button>
              <hr className="my-1 border-gray-200" />
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <FaSignOutAlt className="text-red-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default OwnerHeader;
