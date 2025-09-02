import React, { useState, useEffect } from 'react';
import { 
  FaKey, 
  FaMapMarkerAlt, 
  FaRupeeSign, 
  FaStar, 
  FaEye, 
  FaUsers, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaBuilding,
  FaBed,
  FaHome,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import axios from 'axios';

const initialForm = {
  name: '',
  description: '',
  propertyType: 'Room',
  address: '',
  city: '',
  state: '',
  pincode: '',
  locality: '',
  subLocality: '',
  landmarks: [],
  location: {
    lat: '',
    lng: ''
  },
  pricing: {
    rent: '',
    securityDeposit: '',
    maintenanceCharges: '',
    electricityCharges: 'Extra',
    waterCharges: 'Included',
    internetCharges: '',
    parkingCharges: '',
    brokerageCharges: ''
  },
  totalUnits: '',
  availableUnits: '',
  roomConfig: {
    roomType: 'Single',
    area: '',
    furnished: false,
    attachedBathroom: false,
    balcony: false,
    floor: '',
    facing: '',
    windowType: '',
    acType: 'None'
  },
  flatConfig: {
    flatType: '1BHK',
    bedrooms: '',
    bathrooms: '',
    halls: '',
    kitchens: '',
    balconies: '',
    areas: {
      carpetArea: '',
      builtUpArea: '',
      superBuiltUpArea: ''
    },
    floor: '',
    totalFloors: '',
    furnishingStatus: 'Unfurnished',
    ageOfProperty: '0-1 years',
    facing: '',
    parkingSpaces: {
      covered: '',
      open: ''
    }
  },
  amenities: {
    basic: {
      wifi: false,
      parking: false,
      powerBackup: false,
      waterSupply: false,
      security: false,
      lift: false,
      cctv: false,
      fireExtinguisher: false
    },
    room: {
      ac: false,
      geyser: false,
      bed: false,
      wardrobe: false,
      studyTable: false,
      chair: false,
      fan: false,
      light: false,
      curtains: false,
      mirror: false
    },
    kitchen: {
      modularKitchen: false,
      refrigerator: false,
      microwave: false,
      gasConnection: false,
      waterPurifier: false,
      dishwasher: false,
      washingMachine: false,
      kitchenUtensils: false
    },
    society: {
      gym: false,
      swimming: false,
      garden: false,
      playground: false,
      clubhouse: false,
      commonArea: false,
      rooftop: false,
      visitorsParking: false
    },
    services: {
      housekeeping: false,
      laundry: false,
      foodService: false,
      maintenance: false,
      securityGuard: false,
      reception: false
    }
  },
  media: {
    images: [],
    videos: [],
    virtualTour: {
      url: '',
      provider: ''
    }
  },
  contact: {
    primaryPhone: '',
    secondaryPhone: '',
    whatsappNumber: '',
    email: '',
    availability: {
      callTime: {
        start: '09:00',
        end: '21:00'
      },
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      preferredContactMethod: 'Phone'
    }
  },
  tenantPreferences: {
    genderPreference: 'Any',
    occupationType: 'Any',
    ageGroup: 'Any',
    foodHabits: 'Any',
    smokingAllowed: false,
    drinkingAllowed: false,
    petsAllowed: false,
    guestsAllowed: true,
    maximumOccupancy: ''
  },
  tenantRules: {
    noSmoking: true,
    noDrinking: false,
    noPets: false,
    noLoudMusic: true,
    noParties: true,
    gateClosingTime: '',
    visitorsPolicy: '',
    additionalRules: []
  },
  propertyStatus: {
    listingStatus: 'Active',
    verified: false,
    featured: false,
    premium: false,
    qualityScore: 0
  }
};

export default function RoomFlatManagement() {
  const [form, setForm] = useState(initialForm);
  const [propertyList, setPropertyList] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/rooms/owner/dashboard');
      if (res.data.success) {
        setPropertyList(res.data.data);
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      showError('Error fetching properties. Please try again.');
    }
    setLoading(false);
  };

  const showSuccess = (message) => {
    // You can implement toast notifications here
    alert(message);
  };

  const showError = (message) => {
    // You can implement toast notifications here
    alert(message);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: type === 'checkbox' ? checked : value
          } : type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = {
        ...form,
        pricing: {
          ...form.pricing,
          rent: parseFloat(form.pricing.rent),
          securityDeposit: parseFloat(form.pricing.securityDeposit),
          maintenanceCharges: form.pricing.maintenanceCharges ? parseFloat(form.pricing.maintenanceCharges) : 0,
          internetCharges: form.pricing.internetCharges ? parseFloat(form.pricing.internetCharges) : 0,
          parkingCharges: form.pricing.parkingCharges ? parseFloat(form.pricing.parkingCharges) : 0,
          brokerageCharges: form.pricing.brokerageCharges ? parseFloat(form.pricing.brokerageCharges) : 0
        },
        totalUnits: parseInt(form.totalUnits),
        availableUnits: parseInt(form.availableUnits),
        location: {
          type: 'Point',
          coordinates: [parseFloat(form.location.lng) || 0, parseFloat(form.location.lat) || 0]
        }
      };

      if (editId) {
        await axios.put(`/api/rooms/${editId}`, submitData);
        showSuccess('Property updated successfully!');
      } else {
        await axios.post('/api/rooms', submitData);
        showSuccess('Property created successfully!');
      }
      
      fetchProperties();
      setForm(initialForm);
      setEditId(null);
      setActiveTab('basic');
    } catch (err) {
      console.error('Error saving property:', err);
      showError('Error saving property: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  const handleEdit = (property) => {
    setForm({
      ...property,
      location: {
        lat: property.location?.coordinates?.[1] || '',
        lng: property.location?.coordinates?.[0] || ''
      }
    });
    setEditId(property._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`/api/rooms/${id}`);
      showSuccess('Property deleted successfully!');
      fetchProperties();
    } catch (err) {
      console.error('Error deleting property:', err);
      showError('Error deleting property. Please try again.');
    }
    setLoading(false);
  };

  const renderBasicInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Property Name *</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter property name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
        <select
          name="propertyType"
          value={form.propertyType}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="Room">Room</option>
          <option value="Flat">Flat</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your property..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows="4"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
        <input
          name="address"
          type="text"
          value={form.address}
          onChange={handleChange}
          placeholder="Full address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
        <input
          name="city"
          type="text"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
        <input
          name="state"
          type="text"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
        <input
          name="pincode"
          type="text"
          value={form.pincode}
          onChange={handleChange}
          placeholder="6-digit pincode"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Locality *</label>
        <input
          name="locality"
          type="text"
          value={form.locality}
          onChange={handleChange}
          placeholder="Locality/Area"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sub Locality</label>
        <input
          name="subLocality"
          type="text"
          value={form.subLocality}
          onChange={handleChange}
          placeholder="Sub locality (optional)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
        <input
          name="location.lat"
          type="number"
          step="any"
          value={form.location.lat}
          onChange={handleChange}
          placeholder="Latitude"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
          placeholder="Longitude"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  );

  const renderPricingAndUnits = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent *</label>
        <input
          name="pricing.rent"
          type="number"
          value={form.pricing.rent}
          onChange={handleChange}
          placeholder="Monthly rent"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit *</label>
        <input
          name="pricing.securityDeposit"
          type="number"
          value={form.pricing.securityDeposit}
          onChange={handleChange}
          placeholder="Security deposit"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Charges</label>
        <input
          name="pricing.maintenanceCharges"
          type="number"
          value={form.pricing.maintenanceCharges}
          onChange={handleChange}
          placeholder="Monthly maintenance"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Electricity Charges</label>
        <select
          name="pricing.electricityCharges"
          value={form.pricing.electricityCharges}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="Included">Included in Rent</option>
          <option value="Extra">Extra</option>
          <option value="Per Unit">Per Unit</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Total Units *</label>
        <input
          name="totalUnits"
          type="number"
          value={form.totalUnits}
          onChange={handleChange}
          placeholder="Total units"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Available Units *</label>
        <input
          name="availableUnits"
          type="number"
          value={form.availableUnits}
          onChange={handleChange}
          placeholder="Available units"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      {/* Property Type Specific Fields */}
      {form.propertyType === 'Room' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
            <select
              name="roomConfig.roomType"
              value={form.roomConfig.roomType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Shared">Shared</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Area (sq ft) *</label>
            <input
              name="roomConfig.area"
              type="number"
              value={form.roomConfig.area}
              onChange={handleChange}
              placeholder="Area in sq ft"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Floor *</label>
            <input
              name="roomConfig.floor"
              type="number"
              value={form.roomConfig.floor}
              onChange={handleChange}
              placeholder="Floor number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AC Type</label>
            <select
              name="roomConfig.acType"
              value={form.roomConfig.acType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="None">No AC</option>
              <option value="Window AC">Window AC</option>
              <option value="Split AC">Split AC</option>
              <option value="Central AC">Central AC</option>
            </select>
          </div>
        </>
      )}

      {form.propertyType === 'Flat' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flat Type *</label>
            <select
              name="flatConfig.flatType"
              value={form.flatConfig.flatType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="1RK">1RK</option>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="4BHK">4BHK</option>
              <option value="5BHK+">5BHK+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms *</label>
            <input
              name="flatConfig.bedrooms"
              type="number"
              value={form.flatConfig.bedrooms}
              onChange={handleChange}
              placeholder="Number of bedrooms"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms *</label>
            <input
              name="flatConfig.bathrooms"
              type="number"
              value={form.flatConfig.bathrooms}
              onChange={handleChange}
              placeholder="Number of bathrooms"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Carpet Area (sq ft) *</label>
            <input
              name="flatConfig.areas.carpetArea"
              type="number"
              value={form.flatConfig.areas.carpetArea}
              onChange={handleChange}
              placeholder="Carpet area in sq ft"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Floor *</label>
            <input
              name="flatConfig.floor"
              type="number"
              value={form.flatConfig.floor}
              onChange={handleChange}
              placeholder="Floor number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors *</label>
            <input
              name="flatConfig.totalFloors"
              type="number"
              value={form.flatConfig.totalFloors}
              onChange={handleChange}
              placeholder="Total floors in building"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing Status *</label>
            <select
              name="flatConfig.furnishingStatus"
              value={form.flatConfig.furnishingStatus}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Fully-Furnished">Fully-Furnished</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age of Property *</label>
            <select
              name="flatConfig.ageOfProperty"
              value={form.flatConfig.ageOfProperty}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="Under Construction">Under Construction</option>
              <option value="0-1 years">0-1 years</option>
              <option value="1-5 years">1-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="10-15 years">10-15 years</option>
              <option value="15+ years">15+ years</option>
            </select>
          </div>
        </>
      )}
    </div>
  );

  const renderAmenities = () => (
    <div className="space-y-6">
      {/* Basic Amenities */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Basic Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(form.amenities.basic).map(amenity => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={`amenities.basic.${amenity}`}
                checked={form.amenities.basic[amenity]}
                onChange={handleChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Room Amenities */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Room Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(form.amenities.room).map(amenity => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={`amenities.room.${amenity}`}
                checked={form.amenities.room[amenity]}
                onChange={handleChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Kitchen Amenities */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Kitchen Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(form.amenities.kitchen).map(amenity => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={`amenities.kitchen.${amenity}`}
                checked={form.amenities.kitchen[amenity]}
                onChange={handleChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Society Amenities */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Society Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(form.amenities.society).map(amenity => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={`amenities.society.${amenity}`}
                checked={form.amenities.society[amenity]}
                onChange={handleChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Services</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(form.amenities.services).map(amenity => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={`amenities.services.${amenity}`}
                checked={form.amenities.services[amenity]}
                onChange={handleChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Phone *</label>
            <input
              name="contact.primaryPhone"
              type="tel"
              value={form.contact.primaryPhone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
            <input
              name="contact.whatsappNumber"
              type="tel"
              value={form.contact.whatsappNumber}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              name="contact.email"
              type="email"
              value={form.contact.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
            <select
              name="contact.availability.preferredContactMethod"
              value={form.contact.availability.preferredContactMethod}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="Phone">Phone</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tenant Preferences */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Tenant Preferences</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
            <select
              name="tenantPreferences.genderPreference"
              value={form.tenantPreferences.genderPreference}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="Any">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation Type</label>
            <select
              name="tenantPreferences.occupationType"
              value={form.tenantPreferences.occupationType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="Any">Any</option>
              <option value="Students">Students</option>
              <option value="Working Professionals">Working Professionals</option>
              <option value="Family">Family</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Habits</label>
            <select
              name="tenantPreferences.foodHabits"
              value={form.tenantPreferences.foodHabits}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="Any">Any</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Occupancy</label>
            <input
              name="tenantPreferences.maximumOccupancy"
              type="number"
              value={form.tenantPreferences.maximumOccupancy}
              onChange={handleChange}
              placeholder="Max people per unit"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="tenantPreferences.smokingAllowed"
              checked={form.tenantPreferences.smokingAllowed}
              onChange={handleChange}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span>Smoking Allowed</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="tenantPreferences.drinkingAllowed"
              checked={form.tenantPreferences.drinkingAllowed}
              onChange={handleChange}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span>Drinking Allowed</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="tenantPreferences.petsAllowed"
              checked={form.tenantPreferences.petsAllowed}
              onChange={handleChange}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span>Pets Allowed</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="tenantPreferences.guestsAllowed"
              checked={form.tenantPreferences.guestsAllowed}
              onChange={handleChange}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span>Guests Allowed</span>
          </label>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FaKey },
    { id: 'pricing', label: 'Pricing & Units', icon: FaRupeeSign },
    { id: 'amenities', label: 'Amenities & Contact', icon: FaStar }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaKey className="text-3xl text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Room & Flat Management</h1>
                <p className="text-gray-600">Manage your property listings and analytics</p>
              </div>
            </div>
            <button
              onClick={() => {
                setForm(initialForm);
                setEditId(null);
                setActiveTab('basic');
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <FaPlus /> Add New Property
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && Object.keys(analytics).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-800">{analytics.totalProperties || 0}</p>
                </div>
                <FaKey className="text-purple-600 text-2xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.totalViews || 0}</p>
                </div>
                <FaEye className="text-blue-600 text-2xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Inquiries</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.totalInquiries || 0}</p>
                </div>
                <FaUsers className="text-green-600 text-2xl" />
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
            {editId ? 'Edit Property' : 'Add New Property'}
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
                      ? 'border-purple-500 text-purple-600'
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
            {activeTab === 'pricing' && renderPricingAndUnits()}
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
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : editId ? 'Update Property' : 'Add Property'}
              </button>
            </div>
          </form>
        </div>

        {/* Property List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">Your Property Listings</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading properties...</p>
            </div>
          ) : propertyList.length === 0 ? (
            <div className="text-center py-12">
              <FaKey className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Properties Found</h3>
              <p className="text-gray-500">Start by adding your first property listing</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyList.map(property => (
                <div key={property._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                  {/* Image */}
                  <div className="h-48 bg-gray-100 relative">
                    {property.media?.images && property.media.images.length > 0 ? (
                      <img 
                        src={property.media.images[0].url || property.media.images[0]} 
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                        {property.propertyType === 'Room' ? 
                          <FaBed className="text-4xl text-purple-400" /> : 
                          <FaHome className="text-4xl text-blue-400" />
                        }
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold">
                      {property.propertyStatus?.listingStatus || 'Active'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{property.name}</h4>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaMapMarkerAlt className="mr-1 text-red-500" />
                      <span className="text-sm">{property.city}, {property.state}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold text-green-600">₹{property.pricing?.rent?.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-1">/month</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{property.availableUnits}/{property.totalUnits}</div>
                        <div className="text-xs text-gray-500">units</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                        {property.propertyType}
                      </span>
                      <div className="flex items-center gap-1">
                        <FaEye />
                        <span>{property.analytics?.views?.total || 0}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(property)}
                        className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition"
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
