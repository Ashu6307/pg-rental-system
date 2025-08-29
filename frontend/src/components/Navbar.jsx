import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaBars, FaTimes, FaUser, FaMotorcycle, FaBuilding, FaHome, FaPhone, FaInfoCircle, FaSignOutAlt, FaCrown, FaUserTie, FaChevronDown 
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import StayWheelsLogo from './StayWheelsLogo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [registerDropdown, setRegisterDropdown] = useState(false);
  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (loginRef.current && !loginRef.current.contains(event.target)) setLoginDropdown(false);
      if (registerRef.current && !registerRef.current.contains(event.target)) setRegisterDropdown(false);
      if (isOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useContext(AuthContext);
  const isAuthenticated = !!user;

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };
  const getCurrentUserInfo = () => {
    if (isAuthenticated && user) {
      if (role === 'admin' || role === 'superadmin') {
        return { role: 'admin', name: user.name || 'Admin', dashboard: '/admin/dashboard', icon: FaCrown };
      }
      if (role === 'owner') {
        return { role: 'owner', name: user.businessName || user.ownerName, dashboard: '/owner/dashboard', icon: FaUserTie };
      }
      return { role: 'user', name: user.name || user.email, dashboard: '/user/dashboard', icon: FaUser };
    }
    return null;
  };
  const currentUser = getCurrentUserInfo();
  const isLoggedIn = isAuthenticated;

  // Hide Navbar if logged in as admin, owner, or user
  if (isLoggedIn && currentUser && ['admin', 'owner', 'user'].includes(currentUser.role)) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isLoggedIn && currentUser ? (currentUser.role === 'admin' ? '/admin/dashboard' : currentUser.role === 'owner' ? '/owner/dashboard' : '/') : '/'} onClick={scrollToTop} className="flex items-center h-16">
              <div style={{ display: 'flex', alignItems: 'center', height: '48px' }}>
                <StayWheelsLogo />
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {(!isLoggedIn || (currentUser && currentUser.role === 'user')) && (
              <>
                <Link to="/" onClick={scrollToTop} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100 ${location.pathname === '/' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}> <FaHome className="mr-1" /> Home </Link>
                <Link to="/pg" onClick={scrollToTop} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100 ${location.pathname.startsWith('/pg') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}> <FaBuilding className="mr-1" /> PG </Link>
                <Link to="/bikes" onClick={scrollToTop} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100 ${location.pathname.startsWith('/bikes') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}> <FaMotorcycle className="mr-1" /> Bikes </Link>
              </>
            )}
            {(!isLoggedIn || (currentUser && currentUser.role !== 'admin')) && (
              <>
                <Link to="/about" onClick={scrollToTop} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100 ${location.pathname.startsWith('/about') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}> <FaInfoCircle className="mr-1" /> About </Link>
                <Link to="/contact" onClick={scrollToTop} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100 ${location.pathname.startsWith('/contact') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}> <FaPhone className="mr-1" /> Contact </Link>
              </>
            )}
            {isLoggedIn && currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to={currentUser?.dashboard || '/dashboard'} onClick={scrollToTop} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  {currentUser?.icon && React.createElement(currentUser.icon, { className: "mr-1" })}
                  {currentUser?.role === 'owner' ? 'Owner Dashboard' : currentUser?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{currentUser?.role === 'owner' ? 'Owner' : currentUser?.role === 'admin' ? 'Admin' : 'User'}: {currentUser?.name}</span>
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    <FaSignOutAlt className="mr-1" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="relative" ref={loginRef}>
                  <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none active:scale-95 transition-transform duration-100" onClick={() => { setLoginDropdown((prev) => !prev); setRegisterDropdown(false); }}>
                    <FaUser className="mr-1" /> Login <FaChevronDown className={`ml-1 transition-transform duration-200 ${loginDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 transition-all duration-200 transform ${loginDropdown ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-2 scale-95'}`} style={{ minWidth: '12rem', boxShadow: loginDropdown ? '0 8px 32px 0 rgba(31,38,135,0.15)' : undefined }} onMouseLeave={() => setLoginDropdown(false)}>
                    <Link to="/user/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors duration-150" onClick={() => { scrollToTop(); setLoginDropdown(false); }}>User Login</Link>
                    <Link to="/owner/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors duration-150" onClick={() => { scrollToTop(); setLoginDropdown(false); }}>Owner Login</Link>
                  </div>
                </div>
                <div className="relative" ref={registerRef}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none active:scale-95 transition-transform duration-100 flex items-center" onClick={() => { setRegisterDropdown((prev) => !prev); setLoginDropdown(false); }}>
                    Register <FaChevronDown className={`ml-1 transition-transform duration-200 ${registerDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 transition-all duration-200 transform ${registerDropdown ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-2 scale-95'}`} style={{ minWidth: '12rem', boxShadow: registerDropdown ? '0 8px 32px 0 rgba(31,38,135,0.15)' : undefined }} onMouseLeave={() => setRegisterDropdown(false)}>
                    <Link to="/user/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors duration-150" onClick={() => { scrollToTop(); setRegisterDropdown(false); }}>User Register</Link>
                    <Link to="/owner/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors duration-150" onClick={() => { scrollToTop(); setRegisterDropdown(false); }}>Owner Register</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600">
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden" ref={mobileMenuRef}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              {(!isLoggedIn || (currentUser && currentUser.role === 'user')) && (
                <>
                  <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`} onClick={() => { scrollToTop(); setIsOpen(false); }}><FaHome className="inline mr-2" /> Home</Link>
                  <Link to="/pg" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname.startsWith('/pg') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`} onClick={() => { scrollToTop(); setIsOpen(false); }}><FaBuilding className="inline mr-2" /> PG</Link>
                  <Link to="/bikes" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname.startsWith('/bikes') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`} onClick={() => { scrollToTop(); setIsOpen(false); }}><FaMotorcycle className="inline mr-2" /> Bikes</Link>
                </>
              )}
              {(!isLoggedIn || (currentUser && currentUser.role !== 'admin')) && (
                <>
                  <Link to="/about" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname.startsWith('/about') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`} onClick={() => { scrollToTop(); setIsOpen(false); }}><FaInfoCircle className="inline mr-2" /> About</Link>
                  <Link to="/contact" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname.startsWith('/contact') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-600'}`} onClick={() => { scrollToTop(); setIsOpen(false); }}><FaPhone className="inline mr-2" /> Contact</Link>
                </>
              )}
              <div className="border-t border-gray-200 pt-4">
                {isLoggedIn ? (
                  <>
                    <div className="px-3 py-2"><span className="text-sm text-gray-600">{currentUser?.role === 'owner' ? 'Owner' : currentUser?.role === 'admin' ? 'Admin' : 'User'}: {currentUser?.name}</span></div>
                    <Link to={currentUser?.dashboard || '/dashboard'} className="text-blue-600 hover:text-blue-800 block px-3 py-2 rounded-md text-base font-medium" onClick={() => { scrollToTop(); setIsOpen(false); }}>{currentUser?.icon && React.createElement(currentUser.icon, { className: "inline mr-2" })}{currentUser?.role === 'owner' ? 'Owner Dashboard' : currentUser?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</Link>
                    <button onClick={handleLogout} className="text-red-600 hover:text-red-800 block w-full text-left px-3 py-2 rounded-md text-base font-medium"><FaSignOutAlt className="inline mr-2" /> Logout</button>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none" onClick={() => setLoginDropdown((prev) => !prev)} aria-expanded={loginDropdown} aria-controls="mobile-login-options" type="button"><span>Login as:</span><FaChevronDown className={`ml-2 transition-transform ${loginDropdown ? 'rotate-180' : ''}`} /></button>
                      {loginDropdown && (
                        <div id="mobile-login-options" className="pl-2">
                          <Link to="/login" className="text-gray-700 hover:text-blue-600 block px-6 py-2 rounded-md text-sm" onClick={() => { scrollToTop(); setIsOpen(false); }}>User</Link>
                          <Link to="/owner/login" className="text-gray-700 hover:text-blue-600 block px-6 py-2 rounded-md text-sm" onClick={() => { scrollToTop(); setIsOpen(false); }}>Owner</Link>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 mt-4">
                      <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none" onClick={() => setRegisterDropdown((prev) => !prev)} aria-expanded={registerDropdown} aria-controls="mobile-register-options" type="button"><span>Register as:</span><FaChevronDown className={`ml-2 transition-transform ${registerDropdown ? 'rotate-180' : ''}`} /></button>
                      {registerDropdown && (
                        <div id="mobile-register-options" className="pl-2">
                          <Link to="/register" className="text-gray-700 hover:text-blue-600 block px-6 py-2 rounded-md text-sm" onClick={() => { scrollToTop(); setIsOpen(false); }}>User</Link>
                          <Link to="/owner/register" className="text-gray-700 hover:text-blue-600 block px-6 py-2 rounded-md text-sm" onClick={() => { scrollToTop(); setIsOpen(false); }}>Owner</Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
