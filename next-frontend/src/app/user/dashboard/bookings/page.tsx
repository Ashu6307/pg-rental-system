'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  User,
  Filter,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  Home,
  Download,
  Phone,
  Mail,
  ChevronRight,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import RoleBasedLayout from '@/components/RoleBasedLayout';
import { userDashboardService } from '@/services/userDashboardService';

interface Booking {
  _id: string;
  pgId: {
    _id: string;
    pg_name: string;
    address: string;
    city?: string;
    images: string[];
    rating: number;
  };
  roomId: {
    _id: string;
    room_number: string;
    type: string;
    rent: number;
  };
  checkInDate: string;
  checkOutDate?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'checkedin' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'partial' | 'paid';
  bookingDate: string;
  duration: number;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchQuery, statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await userDashboardService.getUserBookings();
      setBookings(response.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((booking) =>
        booking.pgId.pg_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.roomId.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  };

  const downloadInvoice = async (bookingId: string) => {
    try {
      await userDashboardService.downloadInvoicePDF(bookingId);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
            <RefreshCw className="w-3 h-3 mr-1" />
            Refunded
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };



  return (
    <RoleBasedLayout role="user">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="bg-blue-600 rounded-3xl shadow-2xl mb-8 p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/user/dashboard')}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                  aria-label="Back to dashboard"
                  title="Back to dashboard"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold mb-1">My Bookings</h1>
                  <p className="text-blue-100 text-sm">Manage all your reservations</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-blue-100">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by property, city, or booking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                    title="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                  aria-label="Filter bookings by status"
                  title="Filter by status"
                >
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start exploring properties to make your first booking'}
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium"
              >
                Explore Properties
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowDetailsModal(true);
                  }}
                >
                  {/* Property Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={booking.pgId.images[0] || '/placeholder.jpg'}
                      alt={booking.pgId.pg_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {booking.pgId.pg_name}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        {booking.roomId.type} - Room {booking.roomId.room_number}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                        {formatDate(booking.checkInDate)} {booking.checkOutDate && `- ${formatDate(booking.checkOutDate)}`}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-blue-600" />
                        {booking.duration} days
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-blue-600">₹{booking.totalAmount.toLocaleString()}</p>
                      </div>
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">#{booking._id.slice(-8)}</span>
                      <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-blue-600 text-white px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-bold mb-1">Booking Details</h2>
                <p className="text-blue-100 text-sm">#{selectedBooking._id}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                aria-label="Close modal"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Property Image */}
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <img
                  src={selectedBooking.pgId.images[0] || '/placeholder.jpg'}
                  alt={selectedBooking.pgId.pg_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(selectedBooking.status)}
                </div>
              </div>

              {/* Property Info */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedBooking.pgId.pg_name}</h3>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {selectedBooking.pgId.address}
                </p>
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Check-in</p>
                  <p className="font-bold text-gray-900">{formatDate(selectedBooking.checkInDate)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Check-out</p>
                  <p className="font-bold text-gray-900">{selectedBooking.checkOutDate ? formatDate(selectedBooking.checkOutDate) : 'Ongoing'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Duration</p>
                  <p className="font-bold text-gray-900">
                    {selectedBooking.duration} days
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-4">Amount Breakdown</h4>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Booking Amount</span>
                    <span className="font-semibold">₹{selectedBooking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-blue-200">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{selectedBooking.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => downloadInvoice(selectedBooking._id)}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Invoice
                </button>
                <button
                  onClick={() => router.push(`/pg/${selectedBooking.pgId._id}`)}
                  className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-xl transition-all font-medium flex items-center justify-center"
                >
                  <Home className="w-5 h-5 mr-2" />
                  View Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </RoleBasedLayout>
  );
}
