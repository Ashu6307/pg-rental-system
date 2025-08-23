import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import { getBookings } from '../../services/bookingService.js';
import { getNotifications } from '../../services/notificationService.js';
import { getUserProfile } from '../../services/userService.js';
import { getLoyaltyPoints } from '../../services/loyaltyService.js';
import { getOffers } from '../../services/offerService.js';
import UserNavbar from '../../components/UserNavbar.jsx';
import UserHeader from '../../components/UserHeader.jsx';
import UserFooter from '../../components/UserFooter.jsx';
import { 
  FaUser, FaBell, FaCalendarAlt, FaDownload, FaStar, FaMapMarkerAlt, 
  FaPhone, FaEnvelope, FaGift, FaTrophy, FaCrown, FaShieldAlt, 
  FaMotorcycle, FaBuilding, FaChartLine, FaHeart, FaCog, FaHistory,
  FaArrowRight, FaPlus, FaEye
} from 'react-icons/fa';

const UserDashboardHome = () => {
  const { user: authUser } = useContext(AuthContext);
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    loyaltyPoints: 0,
    unreadNotifications: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [quickOffers, setQuickOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, loyaltyRes, offersRes, notificationsRes] = await Promise.allSettled([
        getBookings().catch(() => ({ bookings: [] })),
        getLoyaltyPoints().catch(() => ({ points: 0 })),
        getOffers().catch(() => []),
        getNotifications().catch(() => ({ notifications: [] }))
      ]);

      const bookings = bookingsRes.value?.bookings || [];
      const loyalty = loyaltyRes.value || { points: 0 };
      const offers = offersRes.value || [];
      const notifications = notificationsRes.value?.notifications || [];

      setDashboardStats({
        totalBookings: bookings.length,
        activeBookings: bookings.filter(b => b.status === 'confirmed').length,
        loyaltyPoints: loyalty.points || 0,
        unreadNotifications: notifications.filter(n => !n.read).length
      });

      setRecentBookings(bookings.slice(0, 3));
      setQuickOffers(offers.slice(0, 2));
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'My Bookings',
      icon: FaCalendarAlt,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      link: '/user/my-bookings',
      description: 'View and manage all your bookings',
      count: dashboardStats.totalBookings
    },
    {
      title: 'Browse PGs',
      icon: FaBuilding,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      link: '/user/browse-pgs',
      description: 'Find perfect accommodation',
      action: 'Browse Now'
    },
    {
      title: 'Rent Bikes',
      icon: FaMotorcycle,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      link: '/user/rent-bikes',
      description: 'Choose from premium bikes',
      action: 'Rent Now'
    },
    {
      title: 'My Profile',
      icon: FaUser,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      link: '/user/my-profile',
      description: 'Update personal information',
      action: 'Edit Profile'
    },
    {
      title: 'Loyalty Rewards',
      icon: FaTrophy,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      link: '/user/loyalty-rewards',
      description: 'Redeem points and rewards',
      count: dashboardStats.loyaltyPoints
    },
    {
      title: 'Notifications',
      icon: FaBell,
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      link: '/user/notifications',
      description: 'Stay updated with alerts',
      count: dashboardStats.unreadNotifications,
      badge: dashboardStats.unreadNotifications > 0
    }
  ];

  const quickActions = [
    { icon: FaPlus, label: 'New Booking', link: '/user/home', color: 'blue' },
    { icon: FaHeart, label: 'Favorites', link: '/user/my-bookings', color: 'red' },
    { icon: FaHistory, label: 'History', link: '/user/my-bookings', color: 'gray' },
    { icon: FaCog, label: 'Settings', link: '/user/my-profile', color: 'green' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UserHeader />
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading your dashboard...</p>
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col">
      <UserHeader />
      <UserNavbar />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {authUser?.name || 'User'}! 👋
                </h1>
                <p className="text-blue-100 text-lg mb-6">
                  Ready to explore amazing accommodations and bikes today?
                </p>
                <div className="flex flex-wrap gap-4">
                  {quickActions.map((action, index) => (
                    <Link 
                      key={index}
                      to={action.link}
                      className={`bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300 px-6 py-3 rounded-xl flex items-center space-x-2 text-white hover:scale-105 transform`}
                    >
                      <action.icon className="text-lg" />
                      <span className="font-semibold">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-10 rounded-full transform -translate-x-24 translate-y-24"></div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalBookings}</p>
                </div>
                <FaCalendarAlt className="text-blue-500 text-3xl" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Bookings</p>
                  <p className="text-3xl font-bold text-gray-800">{dashboardStats.activeBookings}</p>
                </div>
                <FaShieldAlt className="text-green-500 text-3xl" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Loyalty Points</p>
                  <p className="text-3xl font-bold text-gray-800">{dashboardStats.loyaltyPoints}</p>
                </div>
                <FaTrophy className="text-yellow-500 text-3xl" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Notifications</p>
                  <p className="text-3xl font-bold text-gray-800">{dashboardStats.unreadNotifications}</p>
                </div>
                <FaBell className="text-red-500 text-3xl" />
              </div>
            </div>
          </div>

          {/* Main Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {dashboardCards.map((card, index) => (
              <Link 
                key={index}
                to={card.link}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`${card.color} h-32 relative`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <card.icon className="text-white text-4xl group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  {card.badge && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      New
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    {card.count !== undefined && (
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                        {card.count}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
                    {card.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-semibold group-hover:text-blue-700">
                      {card.action || 'View Details'}
                    </span>
                    <FaArrowRight className="text-blue-600 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Activity & Quick Offers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Recent Bookings</h3>
                <Link 
                  to="/user/my-bookings" 
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
                >
                  View All <FaArrowRight className="ml-2" />
                </Link>
              </div>
              
              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${booking.type === 'PG' ? 'bg-blue-100' : 'bg-green-100'}`}>
                            {booking.type === 'PG' ? 
                              <FaBuilding className={`${booking.type === 'PG' ? 'text-blue-600' : 'text-green-600'}`} /> :
                              <FaMotorcycle className={`${booking.type === 'PG' ? 'text-blue-600' : 'text-green-600'}`} />
                            }
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{booking.itemName || booking.name}</h4>
                            <p className="text-gray-600 text-sm">{booking.status || 'Confirmed'}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaCalendarAlt className="text-gray-300 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500">No recent bookings</p>
                  <Link 
                    to="/user/home" 
                    className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Make First Booking
                  </Link>
                </div>
              )}
            </div>

            {/* Special Offers */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Special Offers</h3>
                <FaGift className="text-red-500 text-2xl" />
              </div>
              
              {quickOffers.length > 0 ? (
                <div className="space-y-4">
                  {quickOffers.map((offer, index) => (
                    <div key={index} className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">Limited Time Offer!</h4>
                          <p className="text-gray-600 text-sm">{offer}</p>
                        </div>
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          NEW
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaGift className="text-gray-300 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500">No special offers available</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later for exciting deals!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <UserFooter />
    </div>
  );
};

export default UserDashboardHome;
