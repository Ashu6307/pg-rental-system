"use client";
import React, { useState, useRef } from 'react';
import { 
  FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaRupeeSign, 
  FaBed, FaWifi, FaCar, FaUtensils, FaShieldAlt, FaCamera,
  FaPlus, FaMinus, FaStar, FaClock, FaUsers, FaHome,
  FaDumbbell, FaSwimmingPool, FaTshirt, FaSnowflake,
  FaBolt, FaVideo, FaLeaf, FaBook, FaGamepad, FaMusic,
  FaCoffee, FaMedkit, FaBusinessTime, FaParking, FaCheck,
  FaInfoCircle, FaEye, FaEyeSlash, FaGraduationCap, FaMale, FaFemale
} from 'react-icons/fa';

interface RoomType {
  type: string;
  name: string;
  description: string;
  price: number;
  securityDeposit: number;
  totalRooms: number;
  availableRooms: number;
  amenities: string[];
  isActive: boolean;
}

interface NearbyPlace {
  type: string;
  name: string;
  distance: string;
}

interface AddPGFormProps {
  onSubmit: (pgData: any) => void;
  onClose: () => void;
  loading?: boolean;
}

const AddPGForm: React.FC<AddPGFormProps> = ({ onSubmit, onClose, loading = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const totalSteps = 8;

  // Form Steps
  const steps = [
    { id: 1, title: 'Basic Info', icon: <FaHome />, description: 'Property details & location' },
    { id: 2, title: 'Contact', icon: <FaPhone />, description: 'Communication details' },
    { id: 3, title: 'Rooms', icon: <FaBed />, description: 'Room types & pricing' },
    { id: 4, title: 'Media', icon: <FaCamera />, description: 'Photos & gallery' },
    { id: 5, title: 'Amenities', icon: <FaStar />, description: 'Facilities & services' },
    { id: 6, title: 'Policies', icon: <FaShieldAlt />, description: 'Rules & access control' },
    { id: 7, title: 'Location', icon: <FaMapMarkerAlt />, description: 'Nearby places' },
    { id: 8, title: 'Preview', icon: <FaEye />, description: 'Review & submit' }
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  // Basic Information
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    area: '',
    latitude: '',
    longitude: '',
    ownerRef: '',
    isFeatured: false,
    isVerified: false,
    status: 'active',
    gender: 'Unisex'
  });

  // Contact Information
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    whatsapp: '',
    alternatePhone: ''
  });

  // Room Types
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    {
      type: 'single',
      name: 'Single Room',
      description: 'Private single occupancy room',
      price: 0,
      securityDeposit: 0,
      totalRooms: 0,
      availableRooms: 0,
      amenities: [],
      isActive: true
    }
  ]);

  // Images
  const [images, setImages] = useState<File[]>([]);
  const [imageDescriptions, setImageDescriptions] = useState<string[]>(['']);

  // Amenities
  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');

  // Facilities (Boolean flags)
  const [facilities, setFacilities] = useState({
    wifi: false,
    ac: false,
    laundry: false,
    parking: false,
    meals: false,
    powerBackup: false,
    security: false,
    cctv: false,
    gym: false,
    commonArea: false
  });

  // Detailed Facility Information
  const [detailedFacilities, setDetailedFacilities] = useState({
    wifiDetails: { speed: '', coverage: '' },
    foodType: 'veg',
    parkingDetails: { 
      twoWheeler: { available: false, charges: 0 },
      fourWheeler: { available: false, charges: 0 }
    },
    laundryDetails: { charges: '', pickup: '' },
    securityDetails: { guard: '', cctv: '' }
  });

  // Access Control
  const [accessControl, setAccessControl] = useState({
    gateCloseTime: '11:00 PM',
    guestPolicy: 'Guests allowed with prior permission',
    smokingAllowed: false,
    alcoholAllowed: false
  });

  // Rules
  const [rules, setRules] = useState<string[]>(['']);

  // Nearby Places
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([
    { type: 'metro', name: '', distance: '' }
  ]);

  // Highlights
  const [highlights, setHighlights] = useState<string[]>(['']);

  // Pricing & Discounts
  const [pricing, setPricing] = useState({
    originalPrice: 0,
    discountPercentage: 0
  });

  // Available Amenities List
  const availableAmenities = [
    'High Speed WiFi', 'AC', 'Parking', 'Food', 'Laundry', 'Security', 
    'CCTV', 'Gym', 'Swimming Pool', 'Power Backup', 'Common Area',
    'Study Room', 'Gaming Zone', 'Garden', 'Terrace', 'Library',
    'Medical Room', 'Beauty Salon', 'Yoga Studio', 'Business Center',
    'Conference Room', 'Event Space', 'Cafe', 'Canteen', 'Kitchen',
    'Housekeeping', 'Concierge', 'Valet Parking'
  ];

  // Place Types for Nearby
  const placeTypes = [
    'metro', 'bus_stop', 'hospital', 'mall', 'market', 'school', 
    'college', 'office', 'bank', 'restaurant', 'pharmacy', 'gym'
  ];

  // Room Types Options
  const roomTypeOptions = ['single', 'double', 'triple', 'dormitory'];

  // Add Room Type
  const addRoomType = () => {
    setRoomTypes([...roomTypes, {
      type: 'single',
      name: '',
      description: '',
      price: 0,
      securityDeposit: 0,
      totalRooms: 0,
      availableRooms: 0,
      amenities: [],
      isActive: true
    }]);
  };

  // Remove Room Type
  const removeRoomType = (index: number) => {
    if (roomTypes.length > 1) {
      setRoomTypes(roomTypes.filter((_, i) => i !== index));
    }
  };

  // Update Room Type
  const updateRoomType = (index: number, field: string, value: any) => {
    const updated = [...roomTypes];
    updated[index] = { ...updated[index], [field]: value };
    setRoomTypes(updated);
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages([...images, ...newImages]);
      setImageDescriptions([...imageDescriptions, ...newImages.map(() => '')]);
    }
  };

  // Remove Image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageDescriptions(imageDescriptions.filter((_, i) => i !== index));
  };

  // Toggle Amenity
  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  // Add Custom Amenity
  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setAmenities([...amenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  // Add/Remove Dynamic Lists
  const addToList = (list: any[], setter: any, defaultItem: any) => {
    setter([...list, defaultItem]);
  };

  const removeFromList = (list: any[], setter: any, index: number) => {
    if (list.length > 1) {
      setter(list.filter((_: any, i: number) => i !== index));
    }
  };

  const updateListItem = (list: any[], setter: any, index: number, field: string, value: any) => {
    const updated = [...list];
    if (typeof updated[index] === 'string') {
      updated[index] = value;
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setter(updated);
  };

  // Calculate derived values
  const calculateDerivedValues = () => {
    const totalBeds = roomTypes.reduce((sum, room) => sum + room.totalRooms, 0);
    const availableRooms = roomTypes.reduce((sum, room) => sum + room.availableRooms, 0);
    const minPrice = Math.min(...roomTypes.map(room => room.price).filter(p => p > 0));
    const maxPrice = Math.max(...roomTypes.map(room => room.price).filter(p => p > 0));
    
    return {
      totalBeds,
      availableRooms,
      price: minPrice || 0,
      priceRange: { min: minPrice || 0, max: maxPrice || minPrice || 0 },
      originalPrice: pricing.originalPrice || Math.round(minPrice * (1 + pricing.discountPercentage / 100))
    };
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const derivedValues = calculateDerivedValues();
    
    const pgData = {
      // Basic Information
      ...basicInfo,
      location: {
        type: "Point",
        coordinates: [parseFloat(basicInfo.longitude), parseFloat(basicInfo.latitude)],
        formattedAddress: `${basicInfo.address}, ${basicInfo.city}, ${basicInfo.state} ${basicInfo.pincode}`,
        landmark: basicInfo.landmark,
        area: basicInfo.area
      },
      
      // Contact
      contact: contactInfo,
      
      // Room Types
      roomTypes: roomTypes.map(room => ({
        ...room,
        securityDeposit: room.securityDeposit || room.price * 2
      })),
      
      // Images (will be handled separately for file upload)
      images: images.map((file, index) => ({
        file,
        description: imageDescriptions[index] || basicInfo.name,
        isPrimary: index === 0
      })),
      
      // Amenities & Facilities
      amenities,
      facilities,
      
      // Detailed Facility Information
      ...detailedFacilities,
      
      // Access Control
      accessControl,
      gateCloseTime: accessControl.gateCloseTime,
      guestPolicy: accessControl.guestPolicy,
      
      // Rules & Guidelines
      rules: rules.filter(rule => rule.trim()),
      
      // Location Details
      nearbyPlaces: nearbyPlaces.filter(place => place.name.trim()),
      nearby: nearbyPlaces.filter(place => place.name.trim()).map(place => ({
        name: place.name,
        distance: place.distance,
        type: place.type
      })),
      
      // Highlights
      highlights: highlights.filter(highlight => highlight.trim()),
      
      // Derived Values
      ...derivedValues,
      
      // Additional Fields
      verification: {
        status: basicInfo.isVerified ? 'verified' : 'pending',
        documents: [],
        verifiedAt: basicInfo.isVerified ? new Date() : null
      },
      
      // Facility Flags
      wifiAvailable: facilities.wifi,
      parkingAvailable: facilities.parking,
      foodIncluded: facilities.meals,
      acAvailable: facilities.ac,
      laundryAvailable: facilities.laundry,
      powerBackup: facilities.powerBackup,
      securityGuard: facilities.security,
      cctv: facilities.cctv,
      
      // SEO & Analytics
      seo: {
        metaTitle: `${basicInfo.name} - ${basicInfo.city}`,
        metaDescription: `${basicInfo.name} in ${basicInfo.area}, ${basicInfo.city}. Starting from ₹${derivedValues.price}/month`,
        keywords: [
          `${basicInfo.name.toLowerCase()}`,
          `pg in ${basicInfo.city.toLowerCase()}`,
          `${basicInfo.area.toLowerCase()} accommodation`
        ],
        slug: basicInfo.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      },
      
      analytics: {
        views: 0,
        inquiries: 0,
        bookings: 0
      },
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onSubmit(pgData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FaBuilding size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Add New PG Property</h1>
                  <p className="text-blue-100">Create comprehensive property listing in easy steps</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white text-2xl transition-all duration-200"
                title="Close form"
              >
                ×
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="px-8 py-6 bg-white">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full">
                <div 
                  className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500`}
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />
              </div>

              {/* Step Indicators */}
              {steps.map((step, index) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center group">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-110'
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                    }`}
                    title={`${step.title}: ${step.description}`}
                  >
                    {currentStep > step.id ? <FaCheck /> : step.icon}
                  </button>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-semibold ${currentStep >= step.id ? 'text-gray-800' : 'text-gray-400'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 hidden md:block max-w-20">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="h-full">
            <div className="p-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Basic Information</h2>
                    <p className="text-gray-600">Let's start with the essential details of your PG property</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaBuilding className="inline mr-2 text-blue-500" />
                          PG Property Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800 font-medium"
                          value={basicInfo.name}
                          onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                          placeholder="e.g., Green Valley Boys PG"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaUsers className="inline mr-2 text-purple-500" />
                          Gender Preference *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'Male', label: 'Boys Only', icon: <FaMale />, color: 'blue' },
                            { value: 'Female', label: 'Girls Only', icon: <FaFemale />, color: 'pink' },
                            { value: 'Unisex', label: 'Co-living', icon: <FaUsers />, color: 'purple' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setBasicInfo({...basicInfo, gender: option.value})}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                basicInfo.gender === option.value
                                  ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
                              }`}
                            >
                              <div className="text-2xl mb-2">{option.icon}</div>
                              <div className="font-semibold text-sm">{option.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                          Complete Address *
                        </label>
                        <textarea
                          required
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800 resize-none"
                          value={basicInfo.address}
                          onChange={(e) => setBasicInfo({...basicInfo, address: e.target.value})}
                          placeholder="Complete address with landmarks"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                            value={basicInfo.city}
                            onChange={(e) => setBasicInfo({...basicInfo, city: e.target.value})}
                            placeholder="Mumbai"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                            value={basicInfo.state}
                            onChange={(e) => setBasicInfo({...basicInfo, state: e.target.value})}
                            placeholder="Maharashtra"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                          <input
                            type="text"
                            required
                            pattern="[0-9]{6}"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                            value={basicInfo.pincode}
                            onChange={(e) => setBasicInfo({...basicInfo, pincode: e.target.value})}
                            placeholder="400001"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Area/Locality</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                            value={basicInfo.area}
                            onChange={(e) => setBasicInfo({...basicInfo, area: e.target.value})}
                            placeholder="Andheri West"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Landmark</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                          value={basicInfo.landmark}
                          onChange={(e) => setBasicInfo({...basicInfo, landmark: e.target.value})}
                          placeholder="Near Metro Station / Mall"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                            value={basicInfo.latitude}
                            onChange={(e) => setBasicInfo({...basicInfo, latitude: e.target.value})}
                            placeholder="19.1196"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
                          <input
                            type="number"
                            step="any"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                            value={basicInfo.longitude}
                            onChange={(e) => setBasicInfo({...basicInfo, longitude: e.target.value})}
                            placeholder="72.8821"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Reference</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                          value={basicInfo.ownerRef}
                          onChange={(e) => setBasicInfo({...basicInfo, ownerRef: e.target.value})}
                          placeholder="owner_mumbai_01"
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-700 mb-3">Property Status</h4>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={basicInfo.isFeatured}
                              onChange={(e) => setBasicInfo({...basicInfo, isFeatured: e.target.checked})}
                              className="w-5 h-5 text-yellow-500 rounded"
                            />
                            <FaStar className="text-yellow-500" />
                            <span className="font-medium text-gray-700">Featured Property</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={basicInfo.isVerified}
                              onChange={(e) => setBasicInfo({...basicInfo, isVerified: e.target.checked})}
                              className="w-5 h-5 text-green-500 rounded"
                            />
                            <FaShieldAlt className="text-green-500" />
                            <span className="font-medium text-gray-700">Verified Property</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact Information</h2>
                    <p className="text-gray-600">How can potential tenants reach you?</p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaPhone className="inline mr-2 text-green-500" />
                          Primary Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-800"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                          placeholder="+91-9876543210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaEnvelope className="inline mr-2 text-blue-500" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-800"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                          placeholder="contact@yourpg.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-800"
                          value={contactInfo.whatsapp}
                          onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                          placeholder="+91-9876543210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Alternate Phone</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-800"
                          value={contactInfo.alternatePhone}
                          onChange={(e) => setContactInfo({...contactInfo, alternatePhone: e.target.value})}
                          placeholder="+91-9876543211"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Room Management */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Room Types & Pricing</h2>
                    <p className="text-gray-600">Configure different room categories and their rates</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Room Configurations</h3>
                      <button
                        type="button"
                        onClick={addRoomType}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-200"
                        title="Add new room type"
                      >
                        <FaPlus /> Add Room Type
                      </button>
                    </div>

                    {roomTypes.map((room, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-800">Room Type {index + 1}</h4>
                          {roomTypes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRoomType(index)}
                              className="text-red-500 hover:text-red-700 p-2"
                              title="Remove room type"
                            >
                              <FaMinus />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type *</label>
                            <select
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                              value={room.type}
                              onChange={(e) => updateRoomType(index, 'type', e.target.value)}
                              title="Select room type"
                            >
                              {roomTypeOptions.map(type => (
                                <option key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Room Name *</label>
                            <input
                              type="text"
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                              value={room.name}
                              onChange={(e) => updateRoomType(index, 'name', e.target.value)}
                              placeholder="Deluxe Single Room"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent (₹) *</label>
                            <input
                              type="number"
                              required
                              min="0"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                              value={room.price}
                              onChange={(e) => updateRoomType(index, 'price', parseInt(e.target.value))}
                              placeholder="15000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Security Deposit (₹)</label>
                            <input
                              type="number"
                              min="0"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                              value={room.securityDeposit}
                              onChange={(e) => updateRoomType(index, 'securityDeposit', parseInt(e.target.value))}
                              placeholder="30000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Rooms *</label>
                            <input
                              type="number"
                              required
                              min="1"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                              value={room.totalRooms}
                              onChange={(e) => updateRoomType(index, 'totalRooms', parseInt(e.target.value))}
                              placeholder="10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Available Rooms *</label>
                            <input
                              type="number"
                              required
                              min="0"
                              max={room.totalRooms}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                              value={room.availableRooms}
                              onChange={(e) => updateRoomType(index, 'availableRooms', parseInt(e.target.value))}
                              placeholder="7"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                          <textarea
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800 resize-none"
                            rows={2}
                            value={room.description}
                            onChange={(e) => updateRoomType(index, 'description', e.target.value)}
                            placeholder="Spacious single occupancy room with modern amenities..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placeholder for remaining steps */}
              {currentStep === 4 && (
                <div className="text-center py-16">
                  <FaCamera size={64} className="text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Media Upload</h2>
                  <p className="text-gray-600">Photo upload functionality will be implemented here</p>
                </div>
              )}

              {currentStep === 5 && (
                <div className="text-center py-16">
                  <FaStar size={64} className="text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Amenities & Facilities</h2>
                  <p className="text-gray-600">Amenity selection will be implemented here</p>
                </div>
              )}

              {currentStep === 6 && (
                <div className="text-center py-16">
                  <FaShieldAlt size={64} className="text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Policies & Rules</h2>
                  <p className="text-gray-600">Access control and rules will be implemented here</p>
                </div>
              )}

              {currentStep === 7 && (
                <div className="text-center py-16">
                  <FaMapMarkerAlt size={64} className="text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Nearby Places</h2>
                  <p className="text-gray-600">Location mapping will be implemented here</p>
                </div>
              )}

              {currentStep === 8 && (
                <div className="text-center py-16">
                  <FaEye size={64} className="text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Review & Submit</h2>
                  <p className="text-gray-600">Final review and submission will be implemented here</p>
                </div>
              )}

        {/* Contact Information */}
        <div className="bg-green-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-700">
            <FaPhone /> Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                placeholder="+91-9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                placeholder="info@greenvallypg.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp</label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                value={contactInfo.whatsapp}
                onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                placeholder="+91-9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alternate Phone</label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                value={contactInfo.alternatePhone}
                onChange={(e) => setContactInfo({...contactInfo, alternatePhone: e.target.value})}
                placeholder="+91-9876543211"
              />
            </div>
          </div>
        </div>

        {/* Room Types */}
        <div className="bg-purple-50 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-700">
              <FaBed /> Room Types
            </h3>
            <button
              type="button"
              onClick={addRoomType}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <FaPlus /> Add Room Type
            </button>
          </div>
          
          {roomTypes.map((room, index) => (
            <div key={index} className="bg-white p-4 rounded-lg mb-4 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg">Room Type {index + 1}</h4>
                {roomTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoomType(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove room type"
                    aria-label="Remove room type"
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Room Type *</label>
                  <select
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    value={room.type}
                    onChange={(e) => updateRoomType(index, 'type', e.target.value)}
                  >
                    {roomTypeOptions.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Room Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    value={room.name}
                    onChange={(e) => updateRoomType(index, 'name', e.target.value)}
                    placeholder="Deluxe Single Room"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    value={room.price}
                    onChange={(e) => updateRoomType(index, 'price', parseInt(e.target.value))}
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    value={room.securityDeposit}
                    onChange={(e) => updateRoomType(index, 'securityDeposit', parseInt(e.target.value))}
                    placeholder="30000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Total Rooms *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    value={room.totalRooms}
                    onChange={(e) => updateRoomType(index, 'totalRooms', parseInt(e.target.value))}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Available Rooms *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max={room.totalRooms}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    value={room.availableRooms}
                    onChange={(e) => updateRoomType(index, 'availableRooms', parseInt(e.target.value))}
                    placeholder="7"
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    value={room.description}
                    onChange={(e) => updateRoomType(index, 'description', e.target.value)}
                    placeholder="Spacious single occupancy room with modern amenities..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="bg-orange-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-orange-700">
            <FaCamera /> Property Images
          </h3>
          
          <div className="mb-4">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              <FaCamera /> Upload Images
            </button>
            <p className="text-sm text-gray-600 mt-2">Upload multiple images of your PG (JPG, PNG)</p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-orange-200">
                  <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="max-w-full max-h-full object-cover rounded"
                    />
                  </div>
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Image description..."
                    value={imageDescriptions[index]}
                    onChange={(e) => {
                      const updated = [...imageDescriptions];
                      updated[index] = e.target.value;
                      setImageDescriptions(updated);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="w-full mt-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                  {index === 0 && (
                    <div className="text-xs text-green-600 mt-1">Primary Image</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="bg-indigo-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-700">
            <FaStar /> Amenities
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {availableAmenities.map(amenity => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="text-indigo-600"
                  title={`Toggle ${amenity} amenity`}
                  aria-label={`Toggle ${amenity} amenity`}
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Add custom amenity..."
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
            />
            <button
              type="button"
              onClick={addCustomAmenity}
              className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700"
              title="Add custom amenity"
              aria-label="Add custom amenity"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Basic Facilities */}
        <div className="bg-teal-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-teal-700">
            <FaBuilding /> Basic Facilities
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(facilities).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setFacilities({...facilities, [key]: e.target.checked})}
                  className="text-teal-600"
                />
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Detailed Facility Information */}
        <div className="bg-cyan-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-cyan-700">
            <FaWifi /> Detailed Facility Information
          </h3>
          
          <div className="space-y-6">
            {/* WiFi Details */}
            {facilities.wifi && (
              <div className="bg-white p-4 rounded-lg border border-cyan-200">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FaWifi /> WiFi Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">WiFi Speed</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      value={detailedFacilities.wifiDetails.speed}
                      onChange={(e) => setDetailedFacilities({
                        ...detailedFacilities,
                        wifiDetails: {...detailedFacilities.wifiDetails, speed: e.target.value}
                      })}
                      placeholder="100 Mbps"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Coverage</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      value={detailedFacilities.wifiDetails.coverage}
                      onChange={(e) => setDetailedFacilities({
                        ...detailedFacilities,
                        wifiDetails: {...detailedFacilities.wifiDetails, coverage: e.target.value}
                      })}
                      placeholder="Building-wide coverage"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Food Details */}
            {facilities.meals && (
              <div className="bg-white p-4 rounded-lg border border-cyan-200">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FaUtensils /> Food Details
                </h4>
                <div>
                  <label className="block text-sm font-medium mb-1">Food Type</label>
                  <select
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    value={detailedFacilities.foodType}
                    onChange={(e) => setDetailedFacilities({
                      ...detailedFacilities,
                      foodType: e.target.value
                    })}
                  >
                    <option value="veg">Vegetarian Only</option>
                    <option value="non-veg">Non-Vegetarian Only</option>
                    <option value="both">Both Veg & Non-Veg</option>
                  </select>
                </div>
              </div>
            )}

            {/* Parking Details */}
            {facilities.parking && (
              <div className="bg-white p-4 rounded-lg border border-cyan-200">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FaParking /> Parking Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Two Wheeler</h5>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={detailedFacilities.parkingDetails.twoWheeler.available}
                        onChange={(e) => setDetailedFacilities({
                          ...detailedFacilities,
                          parkingDetails: {
                            ...detailedFacilities.parkingDetails,
                            twoWheeler: {
                              ...detailedFacilities.parkingDetails.twoWheeler,
                              available: e.target.checked
                            }
                          }
                        })}
                      />
                      Available
                    </label>
                    {detailedFacilities.parkingDetails.twoWheeler.available && (
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        placeholder="Monthly charges (₹)"
                        value={detailedFacilities.parkingDetails.twoWheeler.charges}
                        onChange={(e) => setDetailedFacilities({
                          ...detailedFacilities,
                          parkingDetails: {
                            ...detailedFacilities.parkingDetails,
                            twoWheeler: {
                              ...detailedFacilities.parkingDetails.twoWheeler,
                              charges: parseInt(e.target.value) || 0
                            }
                          }
                        })}
                      />
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Four Wheeler</h5>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={detailedFacilities.parkingDetails.fourWheeler.available}
                        onChange={(e) => setDetailedFacilities({
                          ...detailedFacilities,
                          parkingDetails: {
                            ...detailedFacilities.parkingDetails,
                            fourWheeler: {
                              ...detailedFacilities.parkingDetails.fourWheeler,
                              available: e.target.checked
                            }
                          }
                        })}
                      />
                      Available
                    </label>
                    {detailedFacilities.parkingDetails.fourWheeler.available && (
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        placeholder="Monthly charges (₹)"
                        value={detailedFacilities.parkingDetails.fourWheeler.charges}
                        onChange={(e) => setDetailedFacilities({
                          ...detailedFacilities,
                          parkingDetails: {
                            ...detailedFacilities.parkingDetails,
                            fourWheeler: {
                              ...detailedFacilities.parkingDetails.fourWheeler,
                              charges: parseInt(e.target.value) || 0
                            }
                          }
                        })}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Laundry Details */}
            {facilities.laundry && (
              <div className="bg-white p-4 rounded-lg border border-cyan-200">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FaTshirt /> Laundry Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Charges</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      value={detailedFacilities.laundryDetails.charges}
                      onChange={(e) => setDetailedFacilities({
                        ...detailedFacilities,
                        laundryDetails: {...detailedFacilities.laundryDetails, charges: e.target.value}
                      })}
                      placeholder="₹200/month or ₹5 per piece"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pickup Schedule</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      value={detailedFacilities.laundryDetails.pickup}
                      onChange={(e) => setDetailedFacilities({
                        ...detailedFacilities,
                        laundryDetails: {...detailedFacilities.laundryDetails, pickup: e.target.value}
                      })}
                      placeholder="Daily pickup and delivery"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Details */}
            {facilities.security && (
              <div className="bg-white p-4 rounded-lg border border-cyan-200">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FaShieldAlt /> Security Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Security Guard</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      value={detailedFacilities.securityDetails.guard}
                      onChange={(e) => setDetailedFacilities({
                        ...detailedFacilities,
                        securityDetails: {...detailedFacilities.securityDetails, guard: e.target.value}
                      })}
                      placeholder="24/7 security guard"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CCTV Details</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      value={detailedFacilities.securityDetails.cctv}
                      onChange={(e) => setDetailedFacilities({
                        ...detailedFacilities,
                        securityDetails: {...detailedFacilities.securityDetails, cctv: e.target.value}
                      })}
                      placeholder="HD cameras in common areas"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Access Control & Rules */}
        <div className="bg-red-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-700">
            <FaClock /> Access Control & Rules
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Gate Close Time</label>
              <input
                type="time"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                value={accessControl.gateCloseTime.includes(':') ? 
                  accessControl.gateCloseTime.replace(' PM', '').replace(' AM', '') : '23:00'}
                onChange={(e) => {
                  const time = e.target.value;
                  const [hours, minutes] = time.split(':');
                  const hour12 = parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours);
                  const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
                  setAccessControl({
                    ...accessControl, 
                    gateCloseTime: `${hour12}:${minutes} ${ampm}`
                  });
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Guest Policy</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                value={accessControl.guestPolicy}
                onChange={(e) => setAccessControl({...accessControl, guestPolicy: e.target.value})}
                placeholder="Guests allowed with prior permission"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={accessControl.smokingAllowed}
                onChange={(e) => setAccessControl({...accessControl, smokingAllowed: e.target.checked})}
              />
              Smoking Allowed
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={accessControl.alcoholAllowed}
                onChange={(e) => setAccessControl({...accessControl, alcoholAllowed: e.target.checked})}
              />
              Alcohol Allowed
            </label>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">PG Rules</label>
              <button
                type="button"
                onClick={() => addToList(rules, setRules, '')}
                className="text-red-600 hover:text-red-800"
              >
                <FaPlus />
              </button>
            </div>
            {rules.map((rule, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  value={rule}
                  onChange={(e) => updateListItem(rules, setRules, index, '', e.target.value)}
                  placeholder="No loud music after 10 PM"
                />
                {rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFromList(rules, setRules, index)}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Places */}
        <div className="bg-yellow-50 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-yellow-700">
              <FaMapMarkerAlt /> Nearby Places
            </h3>
            <button
              type="button"
              onClick={() => addToList(nearbyPlaces, setNearbyPlaces, { type: 'metro', name: '', distance: '' })}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <FaPlus />
            </button>
          </div>
          
          {nearbyPlaces.map((place, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <select
                className="p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                value={place.type}
                onChange={(e) => updateListItem(nearbyPlaces, setNearbyPlaces, index, 'type', e.target.value)}
              >
                {placeTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
              <input
                type="text"
                className="p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 md:col-span-2"
                value={place.name}
                onChange={(e) => updateListItem(nearbyPlaces, setNearbyPlaces, index, 'name', e.target.value)}
                placeholder="Place name"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  value={place.distance}
                  onChange={(e) => updateListItem(nearbyPlaces, setNearbyPlaces, index, 'distance', e.target.value)}
                  placeholder="2 km"
                />
                {nearbyPlaces.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFromList(nearbyPlaces, setNearbyPlaces, index)}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="bg-pink-50 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-700">
              <FaStar /> Key Highlights
            </h3>
            <button
              type="button"
              onClick={() => addToList(highlights, setHighlights, '')}
              className="text-pink-600 hover:text-pink-800"
            >
              <FaPlus />
            </button>
          </div>
          
          {highlights.map((highlight, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                value={highlight}
                onChange={(e) => updateListItem(highlights, setHighlights, index, '', e.target.value)}
                placeholder="Modern infrastructure"
              />
              {highlights.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFromList(highlights, setHighlights, index)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  <FaMinus />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Pricing & Discounts */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <FaRupeeSign /> Pricing & Discounts
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Original Price (₹)</label>
              <input
                type="number"
                min="0"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500"
                value={pricing.originalPrice}
                onChange={(e) => setPricing({...pricing, originalPrice: parseInt(e.target.value) || 0})}
                placeholder="18000"
              />
              <p className="text-xs text-gray-500 mt-1">Price before discount (optional)</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500"
                value={pricing.discountPercentage}
                onChange={(e) => setPricing({...pricing, discountPercentage: parseInt(e.target.value) || 0})}
                placeholder="10"
              />
              <p className="text-xs text-gray-500 mt-1">Discount on the lowest room price</p>
            </div>
          </div>
        </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold transition-all duration-200"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    Step {currentStep} of {totalSteps}
                  </span>
                  
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Adding Property...
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          Create Property
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPGForm;
