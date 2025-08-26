import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBookings } from '../../services/bookingService.js';
import { downloadInvoicePDF } from '../../services/invoiceService.js';
import UserNavbar from '../../components/UserNavbar.jsx';
import UserHeader from '../../components/UserHeader.jsx';
import UserFooter from '../../components/UserFooter.jsx';
import { 
  FaCalendarAlt, FaDownload, FaMapMarkerAlt, FaPhone, FaEye, FaFilter,
  FaClock, FaCheckCircle, FaTimesCircle, FaBuilding, FaMotorcycle,
  FaArrowLeft, FaSearch, FaSort
} from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, typeFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const bookingRes = await getBookings();
      const bookingData = Array.isArray(bookingRes) ? bookingRes : (bookingRes.bookings || []);
      setBookings(bookingData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.type === typeFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleDownloadInvoice = async (bookingId) => {
    try {
      const pdf = await downloadInvoicePDF(bookingId);
      const url = window.URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${bookingId}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return <FaCheckCircle className="text-green-500" />;
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UserHeader />
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading your bookings...</p>
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
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <Link 
                  to="/user/dashboard" 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-xl mr-4 transition-all duration-300 hover:scale-105"
                >
                  <FaArrowLeft className="text-xl" />
                </Link>
                <div>
                  <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
                  <p className="text-blue-100 text-lg">Manage all your accommodation and bike rentals</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-blue-100">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>{filteredBookings.length} Total Bookings</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="mr-2" />
                  <span>{filteredBookings.filter(b => b.status === 'confirmed').length} Confirmed</span>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="PG">PG Accommodation</option>
                <option value="Bike">Bike Rental</option>
              </select>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center">
                <FaFilter className="mr-2" />
                Apply Filters
              </button>
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredBookings.map((booking, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      {/* Booking Info */}
                      <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                        <div className={`p-4 rounded-2xl ${booking.type === 'PG' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {booking.type === 'PG' ? 
                            <FaBuilding className={`text-2xl ${booking.type === 'PG' ? 'text-blue-600' : 'text-green-600'}`} /> :
                            <FaMotorcycle className={`text-2xl ${booking.type === 'PG' ? 'text-blue-600' : 'text-green-600'}`} />
                          }
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{booking.itemName || booking.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                              {booking.status || 'Confirmed'}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-gray-600">
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-2 text-blue-600" />
                              <span>{booking.location || 'Location not specified'}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-2 text-blue-600" />
                              <span>Booked on: {new Date(booking.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            {booking.phone && (
                              <div className="flex items-center">
                                <FaPhone className="mr-2 text-blue-600" />
                                <span>{booking.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Booking Actions */}
                      <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:space-x-3">
                        <div className="text-right lg:text-left lg:mr-6">
                          <div className="text-2xl font-bold text-green-600">
                            ₹{booking.totalAmount || booking.price || 'N/A'}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {booking.type === 'PG' ? 'Per Month' : 'Per Day'}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleDownloadInvoice(booking._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center"
                          >
                            <FaDownload className="mr-2" />
                            Invoice
                          </button>
                          
                          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center">
                            <FaEye className="mr-2" />
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Bookings Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                  ? 'No bookings match your current filters. Try adjusting your search criteria.'
                  : 'You haven\'t made any bookings yet. Start exploring our amazing accommodations and bikes!'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/user/home" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Browse PGs & Bikes
                </Link>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <UserFooter />
    </div>
  );
};

export default MyBookings;
