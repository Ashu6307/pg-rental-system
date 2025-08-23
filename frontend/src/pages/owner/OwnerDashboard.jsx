import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.js';
import OwnerHeader from '../../components/OwnerHeader.jsx';
import OwnerNavbar from '../../components/OwnerNavbar.jsx';
import OwnerFooter from '../../components/OwnerFooter.jsx';
import { 
  FaHome, 
  FaBicycle, 
  FaClipboardList, 
  FaRupeeSign, 
  FaUsers, 
  FaStar,
  FaChartLine,
  FaPlus,
  FaEye,
  FaEdit,
  FaBell,
  FaCog,
  FaFileAlt,
  FaShieldAlt,
  FaArrowUp,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';

const OwnerDashboard = () => {
  const { user, role } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Enhanced stats with more comprehensive data
  const [stats, setStats] = useState({
    totalPGs: 0,
    totalBikes: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    averageRating: 0,
    totalReviews: 0,
    newNotifications: 0
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const quickActions = [
    {
      title: "Add New PG",
      description: "List a new PG property",
      icon: FaHome,
      path: "/owner/pg-management",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      title: "Add New Bike",
      description: "List a new bike for rent",
      icon: FaBicycle,
      path: "/owner/bike-management",
      color: "bg-gradient-to-r from-green-500 to-green-600", 
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      title: "View Bookings",
      description: "Manage all bookings",
      icon: FaClipboardList,
      path: "/owner/booking-management",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    },
    {
      title: "Revenue Analytics",
      description: "View earnings reports",
      icon: FaChartLine,
      path: "/owner/revenue-analytics", 
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700"
    },
    {
      title: "Document Verification",
      description: "Manage KYC documents",
      icon: FaFileAlt,
      path: "/owner/document-verification",
      color: "bg-gradient-to-r from-red-500 to-red-600",
      hoverColor: "hover:from-red-600 hover:to-red-700"
    },
    {
      title: "Profile & Settings",
      description: "Update profile information",
      icon: FaCog,
      path: "/owner/profile",
      color: "bg-gradient-to-r from-gray-500 to-gray-600",
      hoverColor: "hover:from-gray-600 hover:to-gray-700"
    }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch dashboard stats
        const dashboardRes = await axios.get('http://localhost:5000/api/owners/dashboard');
        if (dashboardRes.data.dashboard) {
          setStats(prevStats => ({
            ...prevStats,
            totalPGs: dashboardRes.data.dashboard.pgs ?? 0,
            totalBikes: dashboardRes.data.dashboard.bikes ?? 0,
            activeBookings: dashboardRes.data.dashboard.bookings ?? 0,
            monthlyRevenue: dashboardRes.data.dashboard.revenue ?? 0,
            occupancyRate: dashboardRes.data.dashboard.occupancyRate ?? 0,
            averageRating: dashboardRes.data.dashboard.averageRating ?? 0,
            totalReviews: dashboardRes.data.dashboard.totalReviews ?? 0
          }));
        }

        // Fetch recent bookings
        const bookingsRes = await axios.get('http://localhost:5000/api/owners/recent-bookings');
        if (bookingsRes.data.bookings) {
          setRecentBookings(bookingsRes.data.bookings);
        }

        // Fetch recent activities
        const activitiesRes = await axios.get('http://localhost:5000/api/owners/recent-activities');
        if (activitiesRes.data.activities) {
          setRecentActivities(activitiesRes.data.activities.map(activity => ({
            ...activity,
            icon: getActivityIcon(activity.type),
            color: getActivityColor(activity.type)
          })));
        }

        // Fetch notifications
        const notificationsRes = await axios.get('http://localhost:5000/api/owners/notifications');
        if (notificationsRes.data.notifications) {
          setNotifications(notificationsRes.data.notifications);
          setStats(prevStats => ({
            ...prevStats,
            newNotifications: notificationsRes.data.notifications.filter(n => !n.read).length
          }));
        }

        setSuccess('Dashboard loaded successfully!');
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking': return FaClipboardList;
      case 'review': return FaStar;
      case 'payment': return FaRupeeSign;
      case 'maintenance': return FaCog;
      default: return FaBell;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'booking': return 'text-green-600';
      case 'review': return 'text-yellow-600';
      case 'payment': return 'text-blue-600';
      case 'maintenance': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      confirmed: "bg-green-100 text-green-800",
      active: "bg-blue-100 text-blue-800", 
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OwnerHeader />
      <OwnerNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Owner'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your properties today.
          </p>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center my-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total PGs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPGs}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <FaArrowUp className="mr-1" />
                  Active properties
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaHome className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bikes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBikes}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <FaArrowUp className="mr-1" />
                  Available for rent
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaBicycle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeBookings}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <FaCalendarAlt className="mr-1" />
                  {stats.occupancyRate}% occupancy
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaClipboardList className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <FaArrowUp className="mr-1" />
                  This month
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaRupeeSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className={`${action.color} ${action.hoverColor} text-white p-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
                  >
                    <action.icon className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                <Link 
                  to="/owner/booking-management"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {recentBookings.length > 0 ? (
                  recentBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          booking.propertyType === 'PG' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {booking.propertyType === 'PG' ? 
                            <FaHome className="h-5 w-5 text-blue-600" /> :
                            <FaBicycle className="h-5 w-5 text-green-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.customerName}</p>
                          <p className="text-sm text-gray-600">{booking.propertyName}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <FaCalendarAlt className="mr-1" />
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{booking.amount?.toLocaleString()}</p>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent bookings found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaStar className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Average Rating</span>
                  </div>
                  <span className="font-semibold">{stats.averageRating || 0}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaUsers className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Total Reviews</span>
                  </div>
                  <span className="font-semibold">{stats.totalReviews || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaChartLine className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Occupancy Rate</span>
                  </div>
                  <span className="font-semibold">{stats.occupancyRate || 0}%</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gray-100">
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <FaClock className="mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <FaBell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent activities</p>
                  </div>
                )}
              </div>
              <Link 
                to="/owner/notifications"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 inline-block"
              >
                View All Activities →
              </Link>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                {stats.newNotifications > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {stats.newNotifications} new
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className={`p-3 rounded-lg ${!notification.read ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <FaBell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                )}
              </div>
              <Link 
                to="/owner/notifications"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 inline-block"
              >
                View All Notifications →
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <OwnerFooter />
    </div>
  );
};

export default OwnerDashboard;
