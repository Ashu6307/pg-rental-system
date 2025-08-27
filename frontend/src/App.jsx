import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ReduxProvider } from './context/ReduxStore';
import ScrollToTop from './components/ScrollToTop';
import './config/console'; // Import console configuration to disable logs in production
import AdminRoute from './routes/AdminRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import SessionGuard from './components/SessionGuard';
import SessionExpiredPage from './pages/SessionExpiredPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';
import PGManagement from './pages/owner/PGManagement.jsx';
import BikeManagement from './pages/owner/BikeManagement.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import UserDashboardHome from './pages/user/UserDashboardHome.jsx';
import MyBookings from './pages/user/MyBookings.jsx';
import RentBikes from './pages/user/RentBikes.jsx';
import UserHome from './pages/user/UserHome.jsx';
import PolicyManagement from './pages/PolicyManagement';
import KYCCompliance from './pages/KYCCompliance';
import Notifications from './pages/user/Notifications.jsx';
import AnalyticsReports from './pages/AnalyticsReports';
// import AdminPGBookings from './pages/AdminPGBookings'; // Not found, comment out
import NotificationPrefs from './pages/user/NotificationPrefs.jsx';
import AdminEmailTemplates from './pages/admin/AdminEmailTemplates.jsx';
import AdminAuditLogs from './pages/admin/AdminAuditLogs.jsx';
import AdminKYCReview from './pages/admin/AdminKYCReview.jsx';
import UserProfile from './pages/user/UserProfile.jsx';
import LoyaltyPoints from './pages/user/LoyaltyPoints.jsx';
import Home from './pages/Home';
import Navbar from './components/Navbar';

import About from './pages/About.jsx';
import Bike from './pages/Bike.jsx';
import PG from './pages/PG.jsx';
import Contact from './pages/Contact.jsx';
import Footer from './components/Footer';
import PGDetails from './pages/PGDetails.jsx';
import UserLogin from '../src/pages/auth/UserLogin.jsx';
import UserRegistration from './pages/auth/UserRegistration.jsx';
import OwnerLogin from './pages/auth/OwnerLogin.jsx';
import LoaderDemo from './components/loaders/LoaderDemo.jsx';
import OwnerRegistration from './pages/auth/OwnerRegistration.jsx';
import AdminLogin from './pages/auth/AdminLogin.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import BookingManagement from './pages/owner/BookingManagement.jsx';
import RevenueAnalytics from './pages/owner/RevenueAnalytics.jsx';
import DocumentVerification from './pages/owner/DocumentVerification.jsx';
import OwnerProfile from './pages/owner/OwnerProfile.jsx';
import OwnerNotifications from './pages/owner/Notifications.jsx';
import OwnerReviews from './pages/owner/Reviews.jsx';
import OwnerFavorites from './pages/owner/Favorites.jsx';
import OwnerAuditLogs from './pages/owner/AuditLogs.jsx';
import OwnerGDPRConsent from './pages/owner/GDPRConsent.jsx';
import OwnerTenants from './pages/owner/Tenants.jsx';

const MainApp = () => {
  const { role, loading, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  
  if (loading) return null;
  
  // Define dashboard routes where public Navbar/Footer should be hidden
  const dashboardRoutes = [
    '/admin', '/admin/',
    '/owner', '/owner/',
    '/user/dashboard',
    '/user/dashboard-home',
    '/user/my-bookings',
    '/user/browse-pgs',
    '/user/rent-bikes',
    '/user/my-profile',
    '/user/loyalty-rewards',
    '/user/notifications',
    '/owner/pg-management',
    '/owner/bike-management', 
    '/owner/booking-management',
    '/owner/revenue-analytics',
    '/owner/document-verification',
    '/owner/profile',
    '/owner/notifications',
    '/owner/reviews',
    '/owner/favorites', 
    '/owner/auditlogs',
    '/owner/gdprconsent',
    '/owner/tenants',
    '/policy',
    '/kyc',
    '/notifications',
    '/analytics',
    '/notification-prefs',
    '/admin/email-templates',
    '/admin/audit-logs',
    '/admin/kyc-review'
  ];
  
  // Check if current path is a dashboard route
  const isDashboardRoute = dashboardRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  );
  
  // Hide public Navbar for:
  // 1. All admin routes (including login, dashboard, etc.)
  // 2. All authenticated dashboard routes
  const hidePublicNavbar = 
    location.pathname.startsWith('/admin') || 
    (isAuthenticated && isDashboardRoute);
  
  // Hide public Footer for:
  // 1. All admin routes (including login, dashboard, etc.)
  // 2. All authenticated dashboard routes
  // 3. All login and registration pages
  const hidePublicFooter = 
    location.pathname.startsWith('/admin') || 
    location.pathname.includes('/login') ||
    location.pathname.includes('/register') ||
    location.pathname.includes('/forgot-password') ||
    (isAuthenticated && isDashboardRoute);
    
  return (
    <>
      {!hidePublicNavbar && <Navbar />}
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/owner" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/pg-management" element={<ProtectedRoute allowedRoles={["owner"]}><PGManagement /></ProtectedRoute>} />
        <Route path="/owner/bike-management" element={<ProtectedRoute allowedRoles={["owner"]}><BikeManagement /></ProtectedRoute>} />
        <Route path="/owner/booking-management" element={<ProtectedRoute allowedRoles={["owner"]}><BookingManagement /></ProtectedRoute>} />
        <Route path="/owner/revenue-analytics" element={<ProtectedRoute allowedRoles={["owner"]}><RevenueAnalytics /></ProtectedRoute>} />
        <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/dashboard-home" element={<ProtectedRoute allowedRoles={["user"]}><UserDashboardHome /></ProtectedRoute>} />
        <Route path="/user/my-bookings" element={<ProtectedRoute allowedRoles={["user"]}><MyBookings /></ProtectedRoute>} />
        <Route path="/user/rent-bikes" element={<ProtectedRoute allowedRoles={["user"]}><RentBikes /></ProtectedRoute>} />
        <Route path="/user/my-profile" element={<ProtectedRoute allowedRoles={["user"]}><UserProfile /></ProtectedRoute>} />
        <Route path="/user/loyalty-rewards" element={<ProtectedRoute allowedRoles={["user"]}><LoyaltyPoints /></ProtectedRoute>} />
        <Route path="/user/notifications" element={<ProtectedRoute allowedRoles={["user"]}><Notifications /></ProtectedRoute>} />
        <Route path="/user/home" element={<ProtectedRoute allowedRoles={["user"]}><UserHome /></ProtectedRoute>} />
        <Route path="/policy" element={<ProtectedRoute allowedRoles={["admin"]}><PolicyManagement /></ProtectedRoute>} />
        <Route path="/kyc" element={<ProtectedRoute allowedRoles={["admin", "owner", "user"]}><KYCCompliance /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute allowedRoles={["admin", "owner", "user"]}><Notifications /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute allowedRoles={["admin", "owner"]}><AnalyticsReports /></ProtectedRoute>} />
        {/* <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPGBookings /></ProtectedRoute>} /> */}
        <Route path="/notification-prefs" element={<ProtectedRoute allowedRoles={["admin", "owner", "user"]}><NotificationPrefs /></ProtectedRoute>} />
        <Route path="/admin/email-templates" element={<ProtectedRoute allowedRoles={["admin"]}><AdminEmailTemplates /></ProtectedRoute>} />
        <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAuditLogs /></ProtectedRoute>} />
        <Route path="/admin/kyc-review" element={<ProtectedRoute allowedRoles={["admin"]}><AdminKYCReview /></ProtectedRoute>} />
        <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        
        {/* Public Routes - Only accessible when NOT authenticated */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
        <Route path="/bikes" element={<PublicRoute><Bike /></PublicRoute>} />
        <Route path="/pg" element={<PublicRoute><PG /></PublicRoute>} />
  <Route path="/pg/:id" element={<PublicRoute><PGDetails /></PublicRoute>} />
        <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
        
        
        {/* Session Management */}
        <Route path="/session-expired" element={<SessionExpiredPage />} />
        
        {/* Google OAuth Callback - Temporarily commented until GoogleCallback component is created */}
        {/* <Route path="/auth/google/callback" element={<GoogleCallback />} /> */}
        
        {/* Authentication Routes - Only accessible when NOT authenticated */}
        <Route path="/loaders" element={<LoaderDemo />} />
        <Route path="/user/login" element={<PublicRoute><UserLogin /></PublicRoute>} />
        <Route path="/user/register" element={<PublicRoute><UserRegistration /></PublicRoute>} />
        <Route path="/owner/login" element={<PublicRoute><OwnerLogin /></PublicRoute>} />
        <Route path="/owner/register" element={<PublicRoute><OwnerRegistration /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword role="user" /></PublicRoute>} />
        <Route path="/owner/forgot-password" element={<PublicRoute><ForgotPassword role="owner" /></PublicRoute>} />
        <Route path="/admin/forgot-password" element={<ForgotPassword role="admin" />} />
        <Route path="/owner/document-verification" element={<ProtectedRoute allowedRoles={["owner"]}><DocumentVerification /></ProtectedRoute>} />
        <Route path="/owner/profile" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerProfile /></ProtectedRoute>} />
        <Route path="/owner/notifications" element={<OwnerNotifications />} />
        <Route path="/owner/reviews" element={<OwnerReviews />} />
        <Route path="/owner/favorites" element={<OwnerFavorites />} />
        <Route path="/owner/auditlogs" element={<OwnerAuditLogs />} />
        <Route path="/owner/gdprconsent" element={<OwnerGDPRConsent />} />
        <Route path="/owner/tenants" element={<OwnerTenants />} />
        
        {/* Fallback Route - Smart redirect based on authentication */}
        <Route path="*" element={
          isAuthenticated ? (
            // Redirect authenticated users to their dashboard
            role === 'admin' ? <Navigate to="/admin" replace /> :
            role === 'owner' ? <Navigate to="/owner" replace /> :
            role === 'user' ? <Navigate to="/user/home" replace /> :
            <Navigate to="/user/login" replace />
          ) : (
            // Show login message for unauthenticated users
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                <p className="text-gray-600 mb-6">Please login to access this page.</p>
                <div className="space-x-4">
                  <a href="/user/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">User Login</a>
                  <a href="/owner/login" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Owner Login</a>
                  <a href="/admin/login" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Admin Login</a>
                </div>
              </div>
            </div>
          )
        } />
      </Routes>
      {!hidePublicFooter && <Footer />}
    </>
  );
};

const App = () => (
  <ReduxProvider>
    <AuthProvider>
      <Router>
        <SessionGuard>
          <MainApp />
        </SessionGuard>
      </Router>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 4000,
          },
        }}
      />
    </AuthProvider>
  </ReduxProvider>
);

export default App;
