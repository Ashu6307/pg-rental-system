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
  FaVideo
} from 'react-icons/fa';
import apiService from '../services/api';
import AutoImageCarousel from '../components/AutoImageCarousel';
import Modal from '../components/Modal';
import ScrollToTop, { useScrollToTop } from '../components/ScrollToTop';

const PG = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPG, setSelectedPG] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const [filters, setFilters] = useState({
    search: '',
    pgType: '',
    genderAllowed: '',
    sort: 'price_low'
  });
  const navigate = useNavigate();

  // Use ScrollToTop hook
  const scrollToTop = useScrollToTop({ behavior: 'smooth', enableMultiTiming: true });

  // Initial data fetch - only once
  useEffect(() => {
    fetchPGs();
  }, []); // Remove filters dependency

  // Client-side filtering - no API calls
  const filteredPgs = useMemo(() => {
    let filtered = [...pgs];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(pg =>
        pg.name?.toLowerCase().includes(searchTerm) ||
        pg.city?.toLowerCase().includes(searchTerm) ||
        pg.description?.toLowerCase().includes(searchTerm) ||
        pg.address?.toLowerCase().includes(searchTerm)
      );
    }

    // PG Type filter
    if (filters.pgType) {
      filtered = filtered.filter(pg => pg.pgType === filters.pgType);
    }

    // Gender filter
    if (filters.genderAllowed) {
      filtered = filtered.filter(pg => pg.genderAllowed === filters.genderAllowed);
    }

    // Sorting
    if (filters.sort) {
      filtered.sort((a, b) => {
        switch (filters.sort) {
          case 'price_low':
            return (a.price || 0) - (b.price || 0);
          case 'price_high':
            return (b.price || 0) - (a.price || 0);
          case 'rating':
            return (b.rating?.overall || 0) - (a.rating?.overall || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [pgs, filters]);

  const fetchPGs = async () => {
    try {
      setLoading(true);
      // Simple API call without filters - get all data for client-side filtering
      const response = await apiService.get('/api/pgs/public?limit=50');
      
      // Handle both nested and direct response formats
      let pgData;
      if (response.success && response.data) {
        // Nested response format from pgController
        pgData = response.data;
      } else if (Array.isArray(response.data)) {
        // Direct array response
        pgData = response.data;
      } else if (Array.isArray(response)) {
        // Direct array response (fallback)
        pgData = response;
      } else {
        pgData = [];
      }
      
      setPgs(pgData);
    } catch (error) {
      console.error('PG API error:', error);
      setPgs([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePGClick = (pg) => {
  navigate(`/pg/${pg._id}`, { state: { pg } });
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

  const getDiscountBadge = (pg) => {
    // Check for discounts in room types
    if (pg.roomTypes && pg.roomTypes.length > 0) {
      const maxDiscount = Math.max(...pg.roomTypes.map(room => {
        if (room.originalPrice && room.originalPrice > room.price) {
          return Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100);
        }
        return 0;
      }));
      
      if (maxDiscount > 0) {
        return (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            UP TO {maxDiscount}% OFF
          </div>
        );
      }
    }
    
    // Fallback to legacy price check
    if (pg.originalPrice && pg.originalPrice > pg.price) {
      const discount = Math.round(((pg.originalPrice - pg.price) / pg.originalPrice) * 100);
      return (
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {discount}% OFF
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-12">
          {/* Skeleton Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 mb-8 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-full p-3 w-16 h-16"></div>
                <div>
                  <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
                  <div className="h-4 bg-white/20 rounded w-96"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Skeleton Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-pulse">
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-32 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-32 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-32 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-24 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          
          {/* Skeleton Grid */}
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
      {/* PG Details Modal */}
      {selectedPG && (
        <Modal onClose={() => setSelectedPG(null)}>
          {detailsLoading ? (
            <div className="min-h-[300px] flex items-center justify-center">Loading...</div>
          ) : (
            <div className="max-w-2xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedPG.name}</h2>
              <div className="mb-4">
                <AutoImageCarousel images={selectedPG.images || []} alt={selectedPG.name} className="h-56 rounded-xl" showControls showDots type="pg" />
              </div>
              <div className="mb-2 text-gray-700"><strong>Address:</strong> {selectedPG.address}, {selectedPG.city}, {selectedPG.state}</div>
              <div className="mb-2 text-gray-700"><strong>Price:</strong> ₹{selectedPG.price?.toLocaleString() || (selectedPG.priceRange?.min?.toLocaleString() + ' - ' + selectedPG.priceRange?.max?.toLocaleString())} /month</div>
              <div className="mb-2 text-gray-700"><strong>Available Rooms:</strong> {selectedPG.availableRooms}</div>
              <div className="mb-2 text-gray-700"><strong>Amenities:</strong> {selectedPG.amenities?.join(', ')}</div>
              <div className="mb-2 text-gray-700"><strong>Highlights:</strong> {selectedPG.highlights?.join(', ')}</div>
              <div className="mb-2 text-gray-700"><strong>Nearby:</strong> {selectedPG.nearby?.map(n => `${n.name} (${n.distance})`).join(', ')}</div>
              <div className="mb-2 text-gray-700"><strong>Rating:</strong> {selectedPG.rating?.overall?.toFixed(1) || 'N/A'} / 5</div>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg" onClick={() => setSelectedPG(null)}>Close</button>
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
        theme="blue"
        buttonPosition="bottom-right"
      />
      
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Enhanced Header */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-full p-3 shadow-lg">
                  <FaBuilding size={40} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
                    Premium PG Listings
                  </h1>
                  <p className="text-lg text-white/90">
                    Discover {filteredPgs.length} verified PG accommodations with comfortable beds and modern amenities
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Industry Trusted
                </span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Verified Properties
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 mb-10 border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Enhanced Search */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition-colors duration-200" />
              </div>
              <input
                key="search-input"
                ref={searchInputRef}
                type="text"
                placeholder="Search PGs by name, location, amenities..."
                className="w-full pl-12 pr-6 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl 
                         focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none
                         hover:border-blue-300 transition-all duration-300 ease-in-out
                         placeholder-gray-400 text-lg shadow-sm"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                autoComplete="off"
                spellCheck="false"
              />
              {filters.search && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, search: '' }));
                      // Focus back to search input after clearing
                      setTimeout(() => searchInputRef.current?.focus(), 0);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                    title="Clear search"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            
            {/* Enhanced Quick Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select 
                className="px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 
                         focus:border-blue-500 focus:outline-none hover:border-blue-300 transition-all duration-300
                         text-gray-700 cursor-pointer shadow-sm min-w-[180px]"
                value={filters.pgType}
                onChange={(e) => setFilters(prev => ({ ...prev, pgType: e.target.value }))}
              >
                <option value="">🏠 All Room Types</option>
                <option value="Single">🛏️ Single Room</option>
                <option value="Double">👥 Double Sharing</option>
                <option value="Triple">👨‍👩‍👧 Triple Sharing</option>
              </select>

              <select 
                className="px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 
                         focus:border-blue-500 focus:outline-none hover:border-blue-300 transition-all duration-300
                         text-gray-700 cursor-pointer shadow-sm min-w-[160px]"
                value={filters.genderAllowed}
                onChange={(e) => setFilters(prev => ({ ...prev, genderAllowed: e.target.value }))}
              >
                <option value="">👤 All Genders</option>
                <option value="male">👨 Boys PG</option>
                <option value="female">👩 Girls PG</option>
                <option value="both">👫 Co-living</option>
              </select>

              <select 
                className="px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 
                         focus:border-blue-500 focus:outline-none hover:border-blue-300 transition-all duration-300
                         text-gray-700 cursor-pointer shadow-sm min-w-[180px]"
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              >
                <option value="price_low">💰 Price: Low to High</option>
                <option value="price_high">💸 Price: High to Low</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="popular">🔥 Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* PG Grid - Compact Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPgs.map(pg => (
            <div
              key={pg._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handlePGClick(pg)}
            >
              {/* Image Container with Auto Carousel - Reduced Height */}
              <div className="relative">
                <AutoImageCarousel
                  images={pg.images || []}
                  alt={pg.name}
                  className="h-36"
                  autoSlideInterval={4000}
                  showControls={true}
                  showDots={true}
                  type="pg"
                />
                
                {getDiscountBadge(pg)}
                
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-20" title="Total Views">
                  <FaEye /> {pg.analytics?.views || 0}
                </div>
              </div>

              {/* Content - Compact */}
              <div className="p-3">
                {/* Title and Heart */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition line-clamp-1" title={pg.name}>
                    {pg.name}
                  </h3>
                  <button className="text-gray-400 hover:text-red-500 transition" title="Add to Favorites">
                    <FaHeart className="text-sm" />
                  </button>
                </div>

                {/* Location and Rating in one line */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-1 text-red-500 text-xs" title="Location" />
                    <span className="text-xs" title={`Location: ${pg.address || `${pg.city}, ${pg.state}`}`}>{pg.city}, {pg.state}</span>
                  </div>
                  {pg.rating?.overall > 0 && (
                    <div className="flex items-center">
                      <div className="flex mr-1">
                        {renderStars(pg.rating.overall)}
                      </div>
                      <span className="text-xs text-gray-600" title={`${pg.rating.overall.toFixed(1)}/5 rating from ${pg.reviews?.total || 0} reviews`}>
                        {pg.rating.overall.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Enhanced Amenities and Room Types */}
                <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1 flex-wrap">
                    {/* WiFi */}
                    {(pg.wifiAvailable || pg.amenities?.includes('WiFi')) && 
                      <FaWifi className="text-blue-500 text-xs" title={`WiFi Available${pg.wifiDetails?.speed ? ` - ${pg.wifiDetails.speed}` : ''}`} />
                    }
                    {/* Parking */}
                    {(pg.parkingAvailable || pg.amenities?.includes('Parking')) && 
                      <FaCar className="text-green-500 text-xs" title={`Parking Available${pg.parkingDetails?.twoWheeler?.charges ? ` - ₹${pg.parkingDetails.twoWheeler.charges}/month` : ''}`} />
                    }
                    {/* Food */}
                    {(pg.foodIncluded || pg.amenities?.includes('Food')) && 
                      <FaUtensils className="text-orange-500 text-xs" title={`Food Included${pg.foodType ? ` - ${pg.foodType}` : ''}`} />
                    }
                    {/* AC */}
                    {(pg.acAvailable || pg.amenities?.includes('AC')) && 
                      <FaSnowflake className="text-cyan-500 text-xs" title="Air Conditioning Available" />
                    }
                    {/* Laundry */}
                    {(pg.laundryAvailable || pg.amenities?.includes('Laundry')) && 
                      <FaTshirt className="text-purple-500 text-xs" title="Laundry Service Available" />
                    }
                    {/* Security */}
                    {(pg.securityGuard || pg.cctv || pg.amenities?.includes('Security')) && 
                      <FaShieldAlt className="text-red-500 text-xs" title="Security Available (Guard/CCTV)" />
                    }
                    {/* Gym */}
                    {pg.amenities?.includes('Gym') && 
                      <FaDumbbell className="text-gray-600 text-xs" title="Gym/Fitness Center" />
                    }
                    {/* Garden */}
                    {pg.amenities?.includes('Garden') && 
                      <FaLeaf className="text-green-600 text-xs" title="Garden/Green Space" />
                    }
                    {/* Study Room */}
                    {pg.amenities?.includes('Study Room') && 
                      <FaBook className="text-indigo-500 text-xs" title="Study Room Available" />
                    }
                    {/* Power Backup */}
                    {(pg.powerBackup || pg.amenities?.includes('Power Backup')) && 
                      <FaBolt className="text-yellow-500 text-xs" title="Power Backup Available" />
                    }
                    {/* CCTV */}
                    {(pg.cctv || pg.amenities?.includes('CCTV')) && 
                      <FaVideo className="text-gray-700 text-xs" title="CCTV Surveillance" />
                    }
                    {/* Featured Badge */}
                    {pg.featured && 
                      <FaCrown className="text-yellow-500 text-xs" title="Featured PG - Premium Quality" />
                    }
                  </div>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs" title={`${pg.roomTypes?.length > 1 ? `Multiple room types: ${pg.roomTypes.map(rt => rt.type).join(', ')}` : `Room type: ${pg.pgType || 'Standard'}`}`}>
                    {pg.roomTypes?.length > 1 ? `${pg.roomTypes.length} Types` : (pg.pgType || 'Standard')}
                  </span>
                </div>

                {/* Gender and Availability in one line */}
                <div className="flex items-center justify-between mb-2">
                  {pg.genderAllowed && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      pg.genderAllowed === 'male' 
                        ? 'bg-blue-100 text-blue-700' 
                        : pg.genderAllowed === 'female' 
                        ? 'bg-pink-100 text-pink-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`} title={`Gender Allowed: ${pg.genderAllowed === 'both' || pg.genderAllowed === 'unisex' ? 'Boys & Girls' : pg.genderAllowed === 'male' ? 'Boys Only' : 'Girls Only'}`}>
                      {pg.genderAllowed === 'male' && <FaMale className="text-xs" title="Boys Only" />}
                      {pg.genderAllowed === 'female' && <FaFemale className="text-xs" title="Girls Only" />}
                      {(pg.genderAllowed === 'both' || pg.genderAllowed === 'unisex') && <FaUsers className="text-xs" title="Boys & Girls" />}
                      <span className="capitalize" title={`This PG is for ${pg.genderAllowed === 'both' || pg.genderAllowed === 'unisex' ? 'both boys and girls' : pg.genderAllowed === 'male' ? 'boys only' : 'girls only'}`}>
                        {pg.genderAllowed === 'both' || pg.genderAllowed === 'unisex' 
                          ? 'Co-living' 
                          : pg.genderAllowed === 'male' 
                          ? 'Boys' 
                          : 'Girls'
                        }
                      </span>
                    </div>
                  )}
                  <div className="text-right">
                    <div className="text-xs font-semibold text-blue-600" title={`${pg.availableRooms} beds currently available for booking in this PG`}>
                      {pg.availableRooms} beds available
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {/* Display price range if multiple room types exist */}
                      {pg.priceRange && pg.priceRange.min !== pg.priceRange.max ? (
                        <span className="text-lg font-bold text-green-600" title={`Price range: ₹${pg.priceRange.min?.toLocaleString()} - ₹${pg.priceRange.max?.toLocaleString()} per month${pg.deposit ? ` (Security deposit varies by room type)` : ''}`}>
                          ₹{pg.priceRange.min?.toLocaleString()} - ₹{pg.priceRange.max?.toLocaleString()}{' '}
                          <span className="text-sm font-normal text-gray-600">per month</span>
                        </span>
                      ) : (
                        <span className="text-lg font-bold text-green-600" title={`Monthly rent: ₹${pg.price?.toLocaleString()}${pg.deposit ? ` (Security deposit: ₹${pg.deposit.toLocaleString()})` : ''}`}>
                          ₹{pg.price?.toLocaleString()}{' '}
                          <span className="text-sm font-normal text-gray-600">per month</span>
                        </span>
                      )}
                      {pg.originalPrice && pg.originalPrice > pg.price && (
                        <span className="text-xs text-gray-500 line-through" title={`Original price: ₹${pg.originalPrice?.toLocaleString()}`}>₹{pg.originalPrice?.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Highlights/Nearby - Compact */}
                {(pg.highlights && pg.highlights.length > 0) || (pg.nearby && pg.nearby.length > 0) ? (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {pg.highlights && pg.highlights.slice(0, 1).map((highlight, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded cursor-help" 
                          title={`All Key Highlights:\n${pg.highlights.map(h => `⭐ ${h}`).join('\n')}`}
                        >
                          {highlight}
                          {pg.highlights.length > 1 && (
                            <span className="ml-1 bg-blue-200 text-blue-900 px-1 rounded-full text-xs">
                              +{pg.highlights.length - 1}
                            </span>
                          )}
                        </span>
                      ))}
                      {pg.nearby && pg.nearby.slice(0, 1).map((place, index) => (
                        <span 
                          key={index} 
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded cursor-help" 
                          title={`All Nearby Places:\n${pg.nearby.map(p => `📍 ${p.name} (${p.distance})`).join('\n')}`}
                        >
                          📍 {place.name} ({place.distance})
                          {pg.nearby.length > 1 && (
                            <span className="ml-1 bg-green-200 text-green-900 px-1 rounded-full text-xs">
                              +{pg.nearby.length - 1}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPgs.length === 0 && !loading && (
          <div className="text-center py-12">
            <FaBuilding size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No PGs Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredPgs.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all text-lg tracking-wide"
              onClick={() => { scrollToTop(); navigate('/user/login'); }}
            >
              View All Properties & Book Now →
            </button>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default React.memo(PG);
