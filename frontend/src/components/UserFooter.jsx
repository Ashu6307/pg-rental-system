import React from 'react';

const UserFooter = () => {
  return (
    <footer className="bg-blue-700 text-white py-8 px-4 mt-12 border-t border-blue-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-2">PG & Bike Rental</h3>
          <p className="mb-4 text-sm">Your trusted partner for comfortable PG accommodations and reliable bike rentals. Making your stay and travel convenient and affordable.</p>
          <div className="flex gap-3 text-xl">
            <a href="#" aria-label="Facebook" className="hover:text-blue-300"><i className="fab fa-facebook"></i></a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-300"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram" className="hover:text-blue-300"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-300"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/user/dashboard" className="hover:text-blue-200">Dashboard</a></li>
            <li><a href="/profile" className="hover:text-blue-200">Profile</a></li>
            <li><a href="/contact" className="hover:text-blue-200">Contact</a></li>
            <li><a href="/pg" className="hover:text-blue-200">PG Listings</a></li>
            <li><a href="/bikes" className="hover:text-blue-200">Bike Rentals</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Services</h3>
          <ul className="space-y-1 text-sm">
            <li>PG Accommodation</li>
            <li>Bike Rentals</li>
            <li>24/7 Support</li>
            <li>Maintenance Service</li>
            <li>Insurance Coverage</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Contact Info</h3>
          <ul className="space-y-1 text-sm">
            <li><i className="fas fa-map-marker-alt mr-2"></i>123 Main Street, City, State 12345</li>
            <li><i className="fas fa-phone mr-2"></i>+91 9876543210</li>
            <li><i className="fas fa-envelope mr-2"></i>support@pgbikerental.com</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-blue-200">&copy; {new Date().getFullYear()} PG & Bike Rental | User Portal. All rights reserved.</div>
    </footer>
  );
};

export default UserFooter;
