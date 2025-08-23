import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBuilding, FaMotorcycle, FaInfoCircle, FaPhone, FaSignOutAlt, FaUser, FaBell, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const UserNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [profileDropdown, setProfileDropdown] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle PG and Bike navigation
  const handlePGClick = () => {
    if (location.pathname === '/user/home') {
      // If already on UserHome, scroll to PG section
      const element = document.getElementById('pgs-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to UserHome and then scroll
      navigate('/user/home?tab=pgs');
    }
  };

  const handleBikeClick = () => {
    if (location.pathname === '/user/home') {
      // If already on UserHome, scroll to Bikes section
      const element = document.getElementById('bikes-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to UserHome and then scroll
      navigate('/user/home?tab=bikes');
    }
  };

  const avatar = user?.profilePhoto ? (
    <img src={user.profilePhoto} alt="avatar" className="h-8 w-8 rounded-full object-cover border" />
  ) : (
    <FaUser className="h-8 w-8 text-blue-600" />
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50" aria-label="User Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/user/dashboard" className="flex items-center space-x-2 focus:outline-none">
            <FaHome className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">PG & Bike Rental</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/user/home" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${location.pathname === '/user/home' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}> <FaHome className="mr-1" /> Home </Link>
            <button onClick={handlePGClick} className="px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-700 hover:text-blue-600 transition-colors"> <FaBuilding className="mr-1" /> PG </button>
            <button onClick={handleBikeClick} className="px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-700 hover:text-blue-600 transition-colors"> <FaMotorcycle className="mr-1" /> Bikes </button>
            <Link to="/user/about" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${location.pathname.startsWith('/user/about') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}> <FaInfoCircle className="mr-1" /> About </Link>
            <Link to="/user/contact" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${location.pathname.startsWith('/user/contact') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}> <FaPhone className="mr-1" /> Contact </Link>
            <button className="relative focus:outline-none" aria-label="Notifications">
              <FaBell className="h-6 w-6 text-blue-600" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">2</span>
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none" onClick={() => setProfileDropdown((prev) => !prev)} aria-haspopup="true" aria-expanded={profileDropdown}>
                {avatar}
                <span>{user?.name || user?.email}</span>
              </button>
              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors duration-150">Your Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors duration-150">Settings</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 rounded transition-colors duration-150">Logout</button>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-blue-600 focus:outline-none" aria-label="Toggle Menu">
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-xl">
            <Link to="/user/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}><FaHome className="inline mr-2" /> Home</Link>
            <Link to="/pg" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}><FaBuilding className="inline mr-2" /> PG</Link>
            <Link to="/bikes" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}><FaMotorcycle className="inline mr-2" /> Bikes</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md textbase font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}><FaInfoCircle className="inline mr-2" /> About</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md textbase font-medium text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}><FaPhone className="inline mr-2" /> Contact</Link>
            <div className="border-t border-gray-200 pt-4">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">Your Profile</Link>
              <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">Settings</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 rounded">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;
