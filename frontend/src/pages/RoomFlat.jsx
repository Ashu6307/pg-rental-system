import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaStar, 
  FaWifi, 
  FaCar, 
  FaUtensils,
  FaSearch,
  FaHeart,
  FaEye,
  FaMale,
  FaFemale,
  FaUsers,
  FaCrown,
  FaShieldAlt,
  FaTshirt,
  FaDumbbell,
  FaLeaf,
  FaBook,
  FaSnowflake,
  FaBolt,
  FaVideo,
  FaBed,
  FaHome,
  FaBath,
  FaKey,
  FaParking
} from 'react-icons/fa';
import apiService from '../services/api';
import AutoImageCarousel from '../components/AutoImageCarousel';
import Modal from '../components/Modal';
import ScrollToTop, { useScrollToTop } from '../components/ScrollToTop';

const RoomFlat = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    city: '',
    priceRange: '',
    genderPreference: '',
    sort: 'featured'
  });

  const navigate = useNavigate();
  const searchInputRef = useRef();

  useEffect(() => {
    fetchProperties();
  }, []);

  // Auto-scroll to top when component mounts
  useScrollToTop();

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/api/rooms/public?limit=50');
      
      // Handle both nested and direct response formats
      let propertyData;
      if (response.success && response.data) {
        propertyData = response.data;
      } else if (Array.isArray(response.data)) {
        propertyData = response.data;
      } else if (Array.isArray(response)) {
        propertyData = response;
      } else {
        propertyData = [];
      }
      
      setProperties(propertyData);
    } catch (error) {
      console.error('Room/Flat API error:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = async (property) => {
    setSelectedProperty(property);
    setDetailsLoading(true);
    
    try {
      const response = await apiService.get(`/api/rooms/public/${property._id}`);
      if (response.success && response.data) {
        setSelectedProperty(response.data);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} text-sm`}
        title={`Rating: ${rating.toFixed(1)}/5 stars`} 
      />
    ));
  };

  const getDiscountBadge = (property) => {
    if (property.pricing?.offerPrice && property.pricing.offerPrice < property.pricing.rent) {
      const discount = Math.round(((property.pricing.rent - property.pricing.offerPrice) / property.pricing.rent) * 100);
      return (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold z-20 shadow-lg">
          {discount}% OFF
        </div>
      );
    }
    
    if (property.propertyStatus?.featured) {
      return (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold z-20 shadow-lg flex items-center gap-1">
          <FaCrown className="text-xs" />
          Featured
        </div>
      );
    }
    
    return null;
  };

  const getGenderIcon = (genderPreference) => {
    switch (genderPreference) {
      case 'Male':
        return <FaMale className="text-blue-600 text-xs" title="Boys Only" />;
      case 'Female':
        return <FaFemale className="text-pink-600 text-xs" title="Girls Only" />;
      default:
        return <FaUsers className="text-green-600 text-xs" title="Co-living" />;
    }
  };

  const getPropertyTypeIcon = (propertyType) => {
    return propertyType === 'Room' ? 
      <FaBed className="text-purple-600 text-xs" title="Room Rental" /> : 
      <FaHome className="text-indigo-600 text-xs" title="Flat Rental" />;
  };

  // Filter properties based on search and filters
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.locality?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPropertyType = !filters.propertyType || property.propertyType === filters.propertyType;
      const matchesCity = !filters.city || property.city?.toLowerCase().includes(filters.city.toLowerCase());
      const matchesGender = !filters.genderPreference || 
                           property.tenantPreferences?.genderPreference === filters.genderPreference ||
                           property.tenantPreferences?.genderPreference === 'Any';
      
      let matchesPrice = true;
      if (filters.priceRange) {
        const rent = property.pricing?.rent || 0;
        switch (filters.priceRange) {
          case 'under_5000':
            matchesPrice = rent < 5000;
            break;
          case '5000_10000':
            matchesPrice = rent >= 5000 && rent <= 10000;
            break;
          case '10000_20000':
            matchesPrice = rent >= 10000 && rent <= 20000;
            break;
          case 'above_20000':
            matchesPrice = rent > 20000;
            break;
        }
      }
      
      return matchesSearch && matchesPropertyType && matchesCity && matchesGender && matchesPrice;
    });

    // Apply sorting
    switch (filters.sort) {
      case 'price_low':
        filtered.sort((a, b) => (a.pricing?.rent || 0) - (b.pricing?.rent || 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.pricing?.rent || 0) - (a.pricing?.rent || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.analytics?.views?.total || 0) - (a.analytics?.views?.total || 0));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.propertyStatus?.featured && !b.propertyStatus?.featured) return -1;
          if (!a.propertyStatus?.featured && b.propertyStatus?.featured) return 1;
          return (b.analytics?.views?.total || 0) - (a.analytics?.views?.total || 0);
        });
        break;
    }

    return filtered;
  }, [properties, searchTerm, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-500 rounded-2xl shadow-lg p-8 mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Property Details Modal */}
      {selectedProperty && (
        <Modal onClose={() => setSelectedProperty(null)}>
          {detailsLoading ? (
            <div className="min-h-[300px] flex items-center justify-center">Loading...</div>
          ) : (
            <div className="max-w-2xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedProperty.name}</h2>
              <div className="mb-4">
                <AutoImageCarousel 
                  images={selectedProperty.media?.images || []} 
                  alt={selectedProperty.name} 
                  className="h-56 rounded-xl" 
                  showControls 
                  showDots 
                  type="room" 
                />
              </div>
              <div className="mb-2 text-gray-700">
                <strong>Address:</strong> {selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state}
              </div>
              <div className="mb-2 text-gray-700">
                <strong>Price:</strong> ₹{selectedProperty.pricing?.rent?.toLocaleString() || 'N/A'} /month
              </div>
              <div className="mb-2 text-gray-700">
                <strong>Available Units:</strong> {selectedProperty.availableUnits}/{selectedProperty.totalUnits}
              </div>
              <div className="mb-2 text-gray-700">
                <strong>Property Type:</strong> {selectedProperty.propertyType}
              </div>
              {selectedProperty.propertyType === 'Room' && selectedProperty.roomConfig && (
                <div className="mb-2 text-gray-700">
                  <strong>Room Type:</strong> {selectedProperty.roomConfig.roomType} - {selectedProperty.roomConfig.area} sq ft
                </div>
              )}
              {selectedProperty.propertyType === 'Flat' && selectedProperty.flatConfig && (
                <div className="mb-2 text-gray-700">
                  <strong>Flat Type:</strong> {selectedProperty.flatConfig.flatType} - {selectedProperty.flatConfig.areas.carpetArea} sq ft
                </div>
              )}
              <div className="mb-2 text-gray-700">
                <strong>Rating:</strong> {selectedProperty.averageRating?.toFixed(1) || 'N/A'} / 5
              </div>
              <button 
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition" 
                onClick={() => setSelectedProperty(null)}
              >
                Close
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* ScrollToTop handles both auto-scroll and floating button */}
      <ScrollToTop 
        scrollOnMount={true} 
        behavior="smooth" 
        enableMultiTiming={true}
        showButton={true}
        theme="purple"
        buttonPosition="bottom-right"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4">
          {/* Enhanced Header */}
          <div className="relative mb-8">
            <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-500 rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <FaKey size={40} className="text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
                      Room & Flat Rentals
                    </h1>
                    <p className="text-lg text-white/90">
                      Discover {filteredProperties.length} verified properties with modern amenities and flexible terms
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-6 relative">
                <div className="relative max-w-md">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by name, city, or locality..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent rounded-xl text-gray-700 
                             placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white
                             transition-all duration-300 shadow-lg backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="mt-4 flex flex-wrap gap-3">
                <select 
                  className="px-4 py-3 bg-white/90 border-2 border-transparent rounded-xl focus:ring-4 focus:ring-white/30 
                           focus:border-white focus:outline-none hover:bg-white transition-all duration-300
                           text-gray-700 cursor-pointer shadow-lg backdrop-blur-sm min-w-[160px]"
                  value={filters.propertyType}
                  onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                  aria-label="Property Type"
                  title="Property Type"
                >
                  <option value="">🏠 All Properties</option>
                  <option value="Room">🛏️ Rooms</option>
                  <option value="Flat">🏡 Flats</option>
                </select>
                <select 
                  className="px-4 py-3 bg-white/90 border-2 border-transparent rounded-xl focus:ring-4 focus:ring-white/30 
                           focus:border-white focus:outline-none hover:bg-white transition-all duration-300
                           text-gray-700 cursor-pointer shadow-lg backdrop-blur-sm min-w-[160px]"
                  value={filters.priceRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                  aria-label="Price Range"
                  title="Price Range"
                >
                  <option value="">💰 All Prices</option>
                  <option value="under_5000">Under ₹5,000</option>
                  <option value="5000_10000">₹5,000 - ₹10,000</option>
                  <option value="10000_20000">₹10,000 - ₹20,000</option>
                  <option value="above_20000">Above ₹20,000</option>
                </select>
                <select 
                  className="px-4 py-3 bg-white/90 border-2 border-transparent rounded-xl focus:ring-4 focus:ring-white/30 
                           focus:border-white focus:outline-none hover:bg-white transition-all duration-300
                           text-gray-700 cursor-pointer shadow-lg backdrop-blur-sm min-w-[160px]"
                  value={filters.genderPreference}
                  onChange={(e) => setFilters(prev => ({ ...prev, genderPreference: e.target.value }))}
                  aria-label="Gender Preference"
                  title="Gender Preference"
                >
                  <option value="">👥 All Preferences</option>
                  <option value="Male">👨 Boys Only</option>
                  <option value="Female">👩 Girls Only</option>
                  <option value="Any">👫 Co-living</option>
                </select>
                <select 
                  className="px-4 py-3 bg-white/90 border-2 border-transparent rounded-xl focus:ring-4 focus:ring-white/30 
                           focus:border-white focus:outline-none hover:bg-white transition-all duration-300
                           text-gray-700 cursor-pointer shadow-lg backdrop-blur-sm min-w-[160px]"
                  value={filters.sort}
                  onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                  aria-label="Sort By"
                  title="Sort By"
                >
                  <option value="featured">⭐ Featured First</option>
                  <option value="price_low">💰 Price: Low to High</option>
                  <option value="price_high">💸 Price: High to Low</option>
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="popular">🔥 Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map(property => (
              <div
                key={property._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handlePropertyClick(property)}
              >
                {/* Image Container with Auto Carousel */}
                <div className="relative">
                  <AutoImageCarousel
                    images={property.media?.images || []}
                    alt={property.name}
                    className="h-40"
                    autoSlideInterval={4000}
                    showControls={true}
                    showDots={true}
                    type="room"
                  />
                  
                  {getDiscountBadge(property)}
                  
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-20" title="Total Views">
                    <FaEye /> {property.analytics?.views?.total || 0}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title and Heart */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition line-clamp-1" title={property.name}>
                      {property.name}
                    </h3>
                    <button className="text-gray-400 hover:text-red-500 transition" title="Add to Favorites">
                      <FaHeart className="text-sm" />
                    </button>
                  </div>

                  {/* Location and Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-1 text-red-500 text-xs" title="Location" />
                      <span className="text-sm" title={`Location: ${property.address || `${property.city}, ${property.state}`}`}>
                        {property.locality}, {property.city}
                      </span>
                    </div>
                    {property.averageRating > 0 && (
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {renderStars(property.averageRating)}
                        </div>
                        <span className="text-xs text-gray-600" title={`${property.averageRating.toFixed(1)}/5 rating from ${property.reviews?.length || 0} reviews`}>
                          {property.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Property Type & Unit Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getPropertyTypeIcon(property.propertyType)}
                      <span className="text-sm font-medium text-gray-700">
                        {property.propertyType === 'Room' ? 
                          property.roomConfig?.roomType : 
                          property.flatConfig?.flatType
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getGenderIcon(property.tenantPreferences?.genderPreference)}
                      <span>{property.availableUnits}/{property.totalUnits} available</span>
                    </div>
                  </div>

                  {/* Amenities Icons */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {/* WiFi */}
                    {property.amenities?.basic?.wifi && 
                      <FaWifi className="text-blue-500 text-sm" title="WiFi Available" />
                    }
                    {/* Parking */}
                    {property.amenities?.basic?.parking && 
                      <FaCar className="text-green-500 text-sm" title="Parking Available" />
                    }
                    {/* AC */}
                    {property.amenities?.room?.ac && 
                      <FaSnowflake className="text-cyan-500 text-sm" title="Air Conditioning" />
                    }
                    {/* Security */}
                    {(property.amenities?.basic?.security || property.amenities?.basic?.cctv) && 
                      <FaShieldAlt className="text-red-500 text-sm" title="Security Available" />
                    }
                    {/* Gym */}
                    {property.amenities?.society?.gym && 
                      <FaDumbbell className="text-gray-600 text-sm" title="Gym Available" />
                    }
                    {/* Power Backup */}
                    {property.amenities?.basic?.powerBackup && 
                      <FaBolt className="text-yellow-500 text-sm" title="Power Backup" />
                    }
                    {/* Verified */}
                    {property.propertyStatus?.verified && 
                      <FaCrown className="text-yellow-500 text-sm" title="Verified Property" />
                    }
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        ₹{property.pricing?.rent?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">per month</div>
                    </div>
                    {property.pricing?.securityDeposit && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-600">
                          ₹{property.pricing.securityDeposit.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">deposit</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProperties.length === 0 && !loading && (
            <div className="text-center py-12">
              <FaKey className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomFlat;
