import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccess, showError, showWarning } from '../../utils/notifications';
import { 
  FaBuilding, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaStar,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUsers,
  FaChartLine,
  FaEnvelope,
  FaCheckCircle,
  FaExclamationCircle,
  FaPhone
} from 'react-icons/fa';
import FileUpload from '../../components/FileUpload.jsx';
import { formatPhoneNumber, isValidIndianMobile } from '../../utils/validation/mobileValidation';

const PG_TYPE_OPTIONS = ['Single', 'Double', 'Triple', 'Four'];
const GENDER_OPTIONS = [
  { value: 'male', label: 'Boys Only' },
  { value: 'female', label: 'Girls Only' },
  { value: 'both', label: 'Co-living' }
];

const AMENITIES_OPTIONS = [
  'High-Speed WiFi', 'AC', 'Laundry Service', 'Parking', 'Security',
  'Power Backup', 'Water Supply', 'Housekeeping', 'Gym', 'Common Kitchen',
  'Study Room', 'Recreation Room', 'CCTV', 'Fire Safety'
];

const initialForm = {
  name: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  contactNumber: '',
  email: '',
  rooms: '',
  availableRooms: '',
  price: '',
  originalPrice: '',
  priceType: 'monthly',
  deposit: '',
  pgType: 'Single',
  genderAllowed: 'both',
  
  // Location
  location: {
    lat: '',
    lng: ''
  },
  
  // Images with captions
  images: [],
  
  // Enhanced amenities
  amenities: [],
  rules: [],
  
  // Facilities
  furnished: false,
  foodIncluded: false,
  foodType: 'vegetarian',
  allowedVisitors: false,
  
  // Visitor Policy
  visitorPolicy: {
    timings: '6 AM - 9 PM',
    idRequired: true
  },
  
  // Parking Details
  parkingAvailable: false,
  parkingDetails: {
    twoWheeler: { available: false, charges: 0 },
    fourWheeler: { available: false, charges: 0 }
  },
  
  // WiFi Details
  wifiAvailable: false,
  wifiDetails: {
    speed: '',
    coverage: 'All rooms'
  },
  
  // Other facilities
  acAvailable: false,
  laundryAvailable: false,
  laundryDetails: {
    charges: '',
    pickup: 'Daily'
  },
  
  // Security
  security: '',
  securityFeatures: [],
  cctv: false,
  fireSafety: false,
  petsAllowed: false,
  
  // Description and highlights
  description: '',
  highlights: [],
  
  // Nearby places
  nearby: [],
  
  // Bills
  electricityBill: {
    included: false,
    type: 'shared',
    averageAmount: ''
  },
  waterBill: {
    included: true,
    type: 'unlimited'
  },
  internetBill: {
    included: true,
    provider: ''
  },
  
  // Policies
  bookingPolicy: {
    advanceRequired: true,
    advanceAmount: '',
    minimumStay: '1 month',
    noticePeriod: '30 days'
  },
  
  // Contact timings
  contactTimings: {
    office: '9 AM - 7 PM',
    emergency: '24x7',
    viewings: '10 AM - 6 PM'
  }
};

export default function PGManagement() {
  const [form, setForm] = useState(initialForm);
  const [pgList, setPgList] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchPGs();
  }, []);

  const fetchPGs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/pgs/owner/dashboard');
      if (res.data.success) {
        setPgList(res.data.data);
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching PGs:', err);
      showError('Error fetching PGs. Please try again.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'contactNumber') {
      const formatted = formatPhoneNumber(value);
      setForm(prev => ({ ...prev, contactNumber: formatted }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data for submission
      const submitData = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        rooms: parseInt(form.rooms),
        availableRooms: parseInt(form.availableRooms),
        deposit: form.deposit ? parseFloat(form.deposit) : null,
        location: {
          type: 'Point',
          coordinates: [parseFloat(form.location.lng) || 0, parseFloat(form.location.lat) || 0],
          lat: parseFloat(form.location.lat) || 0,
          lng: parseFloat(form.location.lng) || 0
        }
      };

      if (editId) {
        await axios.put(`/api/pgs/${editId}`, submitData);
        showSuccess('PG updated successfully!');
      } else {
        await axios.post('/api/pgs', submitData);
        showSuccess('PG created successfully!');
      }
      
      fetchPGs();
      setForm(initialForm);
      setEditId(null);
      setActiveTab('basic');
    } catch (err) {
      console.error('Error saving PG:', err);
      showError('Error saving PG: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  const handleEdit = (pg) => {
    setForm({
      ...pg,
      location: {
        lat: pg.location?.lat || '',
        lng: pg.location?.lng || ''
      }
    });
    setEditId(pg._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PG?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`/api/pgs/${id}`);
      showSuccess('PG deleted successfully!');
      fetchPGs();
    } catch (err) {
      console.error('Error deleting PG:', err);
      showError('Error deleting PG. Please try again.');
    }
    setLoading(false);
  };

  const renderBasicInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">PG Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter PG name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
        <div className="relative">
          <input
            name="contactNumber"
            type="tel"
            value={form.contactNumber}
            onChange={handleChange}
            maxLength="10"
            placeholder="Enter contact number (e.g., 9876543210)"
            className={`appearance-none block w-full p-3 pr-10 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
              form.contactNumber && isValidIndianMobile(form.contactNumber)
                ? 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50'
                : form.contactNumber && form.contactNumber.length > 0 && !isValidIndianMobile(form.contactNumber)
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            required
          />
          <div className="absolute right-3 top-3.5">
            {form.contactNumber && isValidIndianMobile(form.contactNumber) ? (
              <FaCheckCircle className="h-5 w-5 text-green-500" />
            ) : form.contactNumber && form.contactNumber.length > 0 ? (
              <FaExclamationCircle className="h-5 w-5 text-red-500" />
            ) : (
              <FaPhone className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        {/* Fixed height container for error message */}
        <div className="h-5 mt-1">
          {form.contactNumber && form.contactNumber.length > 0 && !isValidIndianMobile(form.contactNumber) && (
            <p className="text-red-500 text-xs">
              📱 Please enter a valid Indian mobile number (10 digits, starting with 6-9)
            </p>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter full address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <div className="relative">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
          />
          
          {/* Email validation icons */}
          {form.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email) ? (
            <FaExclamationCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />
          ) : form.email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email) ? (
            <FaCheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
          ) : (
            <FaEnvelope className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
        <input
          name="location.lat"
          type="number"
          step="any"
          value={form.location.lat}
          onChange={handleChange}
          placeholder="28.6139"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
        <input
          name="location.lng"
          type="number"
          step="any"
          value={form.location.lng}
          onChange={handleChange}
          placeholder="77.2090"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderPricingRooms = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Total Rooms *</label>
        <input
          name="rooms"
          type="number"
          value={form.rooms}
          onChange={handleChange}
          placeholder="Total rooms"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Available Rooms</label>
        <input
          name="availableRooms"
          type="number"
          value={form.availableRooms}
          onChange={handleChange}
          placeholder="Available rooms"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Price *</label>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Monthly rent"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (Optional)</label>
        <input
          name="originalPrice"
          type="number"
          value={form.originalPrice}
          onChange={handleChange}
          placeholder="Original price"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit</label>
        <input
          name="deposit"
          type="number"
          value={form.deposit}
          onChange={handleChange}
          placeholder="Security deposit"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
        <select
          name="pgType"
          value={form.pgType}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          {PG_TYPE_OPTIONS.map(type => (
            <option key={type} value={type}>{type} Sharing</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gender Allowed *</label>
        <select
          name="genderAllowed"
          value={form.genderAllowed}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          {GENDER_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Type</label>
        <select
          name="priceType"
          value={form.priceType}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="monthly">Monthly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
    </div>
  );

  const renderAmenities = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Select Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AMENITIES_OPTIONS.map(amenity => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.amenities.includes(amenity)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleArrayChange('amenities', [...form.amenities, amenity]);
                  } else {
                    handleArrayChange('amenities', form.amenities.filter(a => a !== amenity));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Basic Facilities</h4>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="furnished"
              checked={form.furnished}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Furnished</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="foodIncluded"
              checked={form.foodIncluded}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Food Included</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="allowedVisitors"
              checked={form.allowedVisitors}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Visitors Allowed</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="parkingAvailable"
              checked={form.parkingAvailable}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Parking Available</span>
          </label>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Utilities</h4>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="wifiAvailable"
              checked={form.wifiAvailable}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>WiFi Available</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="acAvailable"
              checked={form.acAvailable}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>AC Available</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="laundryAvailable"
              checked={form.laundryAvailable}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Laundry Service</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="cctv"
              checked={form.cctv}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>CCTV Surveillance</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your PG..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
        />
      </div>
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FaBuilding },
    { id: 'pricing', label: 'Pricing & Rooms', icon: FaRupeeSign },
    { id: 'amenities', label: 'Amenities', icon: FaStar }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaBuilding className="text-3xl text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">PG Management</h1>
                <p className="text-gray-600">Manage your PG listings and analytics</p>
              </div>
            </div>
            <button
              onClick={() => {
                setForm(initialForm);
                setEditId(null);
                setActiveTab('basic');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FaPlus /> Add New PG
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && Object.keys(analytics).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total PGs</p>
                  <p className="text-2xl font-bold text-gray-800">{analytics.totalPGs || 0}</p>
                </div>
                <FaBuilding className="text-blue-600 text-2xl" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.totalViews || 0}</p>
                </div>
                <FaEye className="text-green-600 text-2xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Inquiries</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.totalInquiries || 0}</p>
                </div>
                <FaUsers className="text-purple-600 text-2xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{(analytics.averageRating || 0).toFixed(1)}</p>
                </div>
                <FaStar className="text-yellow-600 text-2xl" />
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-6">
            {editId ? 'Edit PG' : 'Add New PG'}
          </h2>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'basic' && renderBasicInfo()}
            {activeTab === 'pricing' && renderPricingRooms()}
            {activeTab === 'amenities' && renderAmenities()}

            <div className="flex justify-end space-x-4 mt-8">
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialForm);
                    setEditId(null);
                    setActiveTab('basic');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : editId ? 'Update PG' : 'Add PG'}
              </button>
            </div>
          </form>
        </div>

        {/* PG List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">Your PG Listings</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading PGs...</p>
            </div>
          ) : pgList.length === 0 ? (
            <div className="text-center py-12">
              <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No PGs Found</h3>
              <p className="text-gray-500">Start by adding your first PG listing</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pgList.map(pg => (
                <div key={pg._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                  {/* Image */}
                  <div className="h-48 bg-gray-100 relative">
                    {pg.images && pg.images.length > 0 ? (
                      <img 
                        src={pg.images[0].url || pg.images[0]} 
                        alt={pg.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                        <FaBuilding className="text-4xl text-blue-400" />
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold">
                      {pg.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{pg.name}</h4>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaMapMarkerAlt className="mr-1 text-red-500" />
                      <span className="text-sm">{pg.city}, {pg.state}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold text-green-600">₹{pg.price?.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-1">/{pg.priceType}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{pg.availableRooms}/{pg.rooms}</div>
                        <div className="text-xs text-gray-500">rooms</div>
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <FaEye />
                        <span>{pg.analytics?.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUsers />
                        <span>{pg.analytics?.inquiries || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaStar />
                        <span>{(pg.rating?.overall || 0).toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(pg)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition flex items-center justify-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pg._id)}
                        className="bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 transition flex items-center justify-center"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
