import React from 'react';

const AdminFooter = () => (
  <footer className="bg-gray-900 text-white py-8 px-4 mt-12 border-t-2 border-red-700">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-bold mb-2 text-red-700">PG & Bike Rental - Admin Panel</h3>
        <p className="mb-4 text-sm">Administer the platform, manage users, owners, policies, analytics, and compliance. Secure, scalable, and robust control.</p>
        <div className="flex gap-3 text-xl">
          <a href="#" aria-label="Facebook" className="hover:text-red-400"><i className="fab fa-facebook"></i></a>
          <a href="#" aria-label="Twitter" className="hover:text-red-400"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram" className="hover:text-red-400"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-red-400"><i className="fab fa-linkedin"></i></a>
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-2 text-red-700">Admin Links</h3>
        <ul className="space-y-1 text-sm">
          <li><a href="/admin/dashboard" className="hover:text-red-400">Dashboard</a></li>
          <li><a href="/admin/users" className="hover:text-red-400">User Management</a></li>
          <li><a href="/admin/owners" className="hover:text-red-400">Owner Management</a></li>
          <li><a href="/admin/policies" className="hover:text-red-400">Policy Management</a></li>
          <li><a href="/admin/analytics" className="hover:text-red-400">Analytics</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold mb-2 text-red-700">Admin Services</h3>
        <ul className="space-y-1 text-sm">
          <li>Platform Analytics</li>
          <li>Audit Logs</li>
          <li>Notifications</li>
          <li>Compliance Management</li>
          <li>Export/Reporting</li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold mb-2 text-red-700">Contact Admin Support</h3>
        <ul className="space-y-1 text-sm">
          <li><i className="fas fa-map-marker-alt mr-2"></i>123 Main Street, City, State 12345</li>
          <li><i className="fas fa-phone mr-2"></i>+91 9876543210</li>
          <li><i className="fas fa-envelope mr-2"></i>admin-support@pgrental.com</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-xs">
      <span>© 2025 PG & Bike Rental Admin Panel. All rights reserved.</span>
      <div className="flex gap-4 mt-2 md:mt-0">
        <a href="/admin/privacy" className="hover:text-red-400">Privacy Policy</a>
        <a href="/admin/terms" className="hover:text-red-400">Terms of Service</a>
        <a href="/admin/refund" className="hover:text-red-400">Refund Policy</a>
      </div>
    </div>
  </footer>
);

export default AdminFooter;
