import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.js';
import AdminHeader from '../../components/AdminHeader.jsx';
import AdminNavbar from '../../components/AdminNavbar.jsx';
import AdminFooter from '../../components/AdminFooter.jsx';
import { 
  FaUsers, 
  FaUserShield, 
  FaClipboardList, 
  FaRupeeSign, 
  FaChartLine,
  FaFileAlt,
  FaShieldAlt,
  FaBell,
  FaCog,
  FaArrowUp,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { user, role, isAuthenticated, token } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Enhanced stats with comprehensive admin data
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeProperties: 0,
    systemAlerts: 0,
    monthlyGrowth: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage all users",
      icon: FaUsers,
      path: "/admin/users",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      title: "Manage Owners",
      description: "Owner verification & management",
      icon: FaUserShield,
      path: "/admin/owners",
      color: "bg-gradient-to-r from-green-500 to-green-600", 
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      title: "Booking Management",
      description: "Monitor all bookings",
      icon: FaClipboardList,
      path: "/admin/bookings",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    },
    {
      title: "Revenue Analytics",
      description: "Financial reports & analytics",
      icon: FaChartLine,
      path: "/admin/revenue",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700"
    },
    {
      title: "KYC Review",
      description: "Document verification",
      icon: FaFileAlt,
      path: "/admin/kyc-review",
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      hoverColor: "hover:from-yellow-600 hover:to-yellow-700"
    },
    {
      title: "System Settings",
      description: "Platform configuration",
      icon: FaCog,
      path: "/admin/settings",
      color: "bg-gradient-to-r from-gray-500 to-gray-600",
      hoverColor: "hover:from-gray-600 hover:to-gray-700"
    }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Get token for authorization
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        // Fetch admin dashboard stats
        const dashboardRes = await axios.get('http://localhost:5000/api/admin/dashboard', { headers });
        
        if (dashboardRes.data.dashboard) {
          setStats(prevStats => ({
            ...prevStats,
            totalUsers: dashboardRes.data.dashboard.totalUsers ?? 0,
            totalOwners: dashboardRes.data.dashboard.totalOwners ?? 0,
            totalBookings: dashboardRes.data.dashboard.totalBookings ?? 0,
            totalRevenue: dashboardRes.data.dashboard.totalRevenue ?? 0,
            pendingApprovals: dashboardRes.data.dashboard.pendingApprovals ?? 0,
            activeProperties: dashboardRes.data.dashboard.activeProperties ?? 0,
            systemAlerts: dashboardRes.data.dashboard.systemAlerts ?? 0,
            monthlyGrowth: dashboardRes.data.dashboard.monthlyGrowth ?? 0
          }));
        }

        // Fetch recent activities
        const activitiesRes = await axios.get('http://localhost:5000/api/admin/recent-activities', { headers });
        if (activitiesRes.data.activities) {
          setRecentActivities(activitiesRes.data.activities.map(activity => ({
            ...activity,
            icon: getActivityIcon(activity.type),
            color: getActivityColor(activity.type)
          })));
        }

        // Fetch pending approvals
        const approvalsRes = await axios.get('http://localhost:5000/api/admin/pending-approvals', { headers });
        if (approvalsRes.data.approvals) {
          setPendingApprovals(approvalsRes.data.approvals);
        }

        // Fetch system alerts
        const alertsRes = await axios.get('http://localhost:5000/api/admin/system-alerts', { headers });
        if (alertsRes.data.alerts) {
          setSystemAlerts(alertsRes.data.alerts);
        }

        setSuccess('Admin dashboard loaded successfully!');
      } catch (error) {
        console.error('Admin dashboard fetch error:', error);
        setError('Failed to load admin dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration': return FaUsers;
      case 'owner_verification': return FaUserShield;
      case 'booking': return FaClipboardList;
      case 'payment': return FaRupeeSign;
      case 'system': return FaCog;
      default: return FaBell;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_registration': return 'text-blue-600';
      case 'owner_verification': return 'text-green-600';
      case 'booking': return 'text-purple-600';
      case 'payment': return 'text-orange-600';
      case 'system': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800", 
      rejected: "bg-red-100 text-red-800",
      active: "bg-blue-100 text-blue-800"
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <AdminNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard 🛡️
          </h1>
          <p className="text-gray-600 mt-2">
            Complete platform overview and management controls.
          </p>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center my-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Loading admin dashboard...</p>
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
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <FaArrowUp className="mr-1" />
                  Active platform users
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUsers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Owners</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOwners}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <FaArrowUp className="mr-1" />
                  Verified property owners
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaUserShield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <FaCalendarAlt className="mr-1" />
                  All-time bookings
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
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <FaArrowUp className="mr-1" />
                  +{stats.monthlyGrowth}% this month
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Controls</h2>
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

            {/* Pending Approvals */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Pending Approvals</h2>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                  {stats.pendingApprovals} pending
                </span>
              </div>
              <div className="space-y-4">
                {pendingApprovals.length > 0 ? (
                  pendingApprovals.slice(0, 3).map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-yellow-100">
                          <FaFileAlt className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{approval.ownerName}</p>
                          <p className="text-sm text-gray-600">{approval.documentType} Verification</p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <FaCalendarAlt className="mr-1" />
                            {new Date(approval.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                          <FaCheck className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaFileAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No pending approvals</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Database</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Payment Gateway</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Email Service</span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-600">Degraded</span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
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
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                {stats.systemAlerts > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {stats.systemAlerts} alerts
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {systemAlerts.length > 0 ? (
                  systemAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg ${alert.severity === 'high' ? 'bg-red-50' : alert.severity === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <FaShieldAlt className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No system alerts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <AdminFooter />
    </div>
  );
};

export default AdminDashboard;
