import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
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
  FaTrendingUp,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';

const OwnerDashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPGs: 12,
    totalBikes: 8,
    activeBookings: 24,
    monthlyRevenue: 45000,
    occupancyRate: 85,
    averageRating: 4.6,
    totalReviews: 156,
    newNotifications: 5
  });
  
  const [recentBookings, setRecentBookings] = useState([
    {
      id: 1,
      customerName: "Rajesh Kumar",
      propertyType: "PG",
      propertyName: "Green Valley PG",
      checkIn: "2024-01-15",
      amount: 8500,
      status: "confirmed"
    },
    {
      id: 2,
      customerName: "Priya Sharma",
      propertyType: "Bike",
      propertyName: "Honda Activa 6G",
      checkIn: "2024-01-14",
      amount: 1200,
      status: "active"
    },
    {
      id: 3,
      customerName: "Amit Singh",
      propertyType: "PG", 
      propertyName: "Sunrise Residency",
      checkIn: "2024-01-13",
      amount: 12000,
      status: "pending"
    }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "booking",
      message: "New PG booking received from Rajesh Kumar",
      time: "2 hours ago",
      icon: FaClipboardList,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "review",
      message: "New 5-star review for Green Valley PG",
      time: "4 hours ago", 
      icon: FaStar,
      color: "text-yellow-600"
    },
    {
      id: 3,
      type: "payment",
      message: "Payment of ₹8,500 received",
      time: "6 hours ago",
      icon: FaRupeeSign,
      color: "text-blue-600"
    },
    {
      id: 4,
      type: "maintenance",
      message: "Maintenance request for Room 201",
      time: "1 day ago",
      icon: FaCog,
      color: "text-orange-600"
    }
  ]);

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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total PGs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPGs}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <FaTrendingUp className="mr-1" />
                  +2 this month
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
                  <FaTrendingUp className="mr-1" />
                  +1 this month
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
                  <FaTrendingUp className="mr-1" />
                  +12% from last month
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
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        booking.propertyType === 'PG' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {booking.propertyType === 'PG' ? 
                          <FaHome className={`h-5 w-5 ${booking.propertyType === 'PG' ? 'text-blue-600' : 'text-green-600'}`} /> :
                          <FaBicycle className="h-5 w-5 text-green-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.customerName}</p>
                        <p className="text-sm text-gray-600">{booking.propertyName}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <FaCalendarAlt className="mr-1" />
                          {booking.checkIn}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{booking.amount.toLocaleString()}</p>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                ))}
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
                  <span className="font-semibold">{stats.averageRating}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaUsers className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Total Reviews</span>
                  </div>
                  <span className="font-semibold">{stats.totalReviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaChartLine className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Occupancy Rate</span>
                  </div>
                  <span className="font-semibold">{stats.occupancyRate}%</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-gray-100`}>
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
                ))}
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
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-900">New booking request for Green Valley PG</p>
                  <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-900">Payment reminder: Invoice #1234 due tomorrow</p>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-900">Document verification completed</p>
                  <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                </div>
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

export default OwnerDashboardHome;
