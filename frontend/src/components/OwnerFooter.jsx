import React from 'react';

const OwnerFooter = () => (
  <footer className="bg-gray-900 text-white py-8 px-4 mt-12">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-bold mb-2">PG & Bike Rental - Owner Panel</h3>
        <p className="mb-4 text-sm">Manage your PGs and bikes, track bookings, reviews, and compliance. Your business, simplified and secure.</p>
        <div className="flex gap-3 text-xl">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-2">Owner Links</h3>
        <ul className="space-y-1 text-sm">
          <li><a href="/owner/dashboard">Dashboard</a></li>
          <li><a href="/owner/listings">Manage Listings</a></li>
          <li><a href="/owner/bookings">Bookings</a></li>
          <li><a href="/owner/reviews">Reviews</a></li>
          <li><a href="/owner/compliance">Compliance</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold mb-2">Owner Services</h3>
        <ul className="space-y-1 text-sm">
          <li>Listing Management</li>
          <li>Booking Analytics</li>
          <li>Review Management</li>
          <li>Document Verification</li>
          <li>Notifications</li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold mb-2">Contact Support</h3>
        <ul className="space-y-1 text-sm">
          <li><i className="fas fa-map-marker-alt mr-2"></i>123 Main Street, City, State 12345</li>
          <li><i className="fas fa-phone mr-2"></i>+91 9876543210</li>
          <li><i className="fas fa-envelope mr-2"></i>owner-support@pgrental.com</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-xs">
      <span>© 2025 PG & Bike Rental Owner Panel. All rights reserved.</span>
      <div className="flex gap-4 mt-2 md:mt-0">
        <a href="/owner/privacy" className="hover:underline">Privacy Policy</a>
        <a href="/owner/terms" className="hover:underline">Terms of Service</a>
        <a href="/owner/refund" className="hover:underline">Refund Policy</a>
      </div>
    </div>
  </footer>
);

export default OwnerFooter;
