import React, { useEffect, useState } from 'react';
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
  FaUsers
} from 'react-icons/fa';
import apiService from '../services/api';
import AutoImageCarousel from '../components/AutoImageCarousel';

const PG = () => {
  const [pgs, setPgs] = useState([]);
  const [filteredPgs, setFilteredPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    pgType: '',
    genderAllowed: '',
    sort: 'price_low'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPGs();
  }, [filters]);

  const fetchPGs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        limit: 20
      }).toString();
      
      const response = await apiService.get(`/api/pgs/public?${queryParams}`);
      const pgData = response.data || response;
      setPgs(Array.isArray(pgData) ? pgData : []);
      setFilteredPgs(Array.isArray(pgData) ? pgData : []);
    } catch (error) {
      console.error('PG API error:', error);
      setPgs([]);
      setFilteredPgs([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePGClick = (pg) => {
    // Track view
    apiService.post(`/api/pgs/public/${pg._id}/inquiry`).catch(console.error);
    navigate('/user/login', { state: { redirectTo: `/pg/${pg._id}` } });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} text-sm`} 
      />
    ));
  };

  const getDiscountBadge = (pg) => {
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
                    Discover {filteredPgs.length} verified PG accommodations with modern amenities
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

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, city, or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            {/* Quick Filters */}
            <select 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.pgType}
              onChange={(e) => setFilters(prev => ({ ...prev, pgType: e.target.value }))}
            >
              <option value="">All Room Types</option>
              <option value="Single">Single Room</option>
              <option value="Double">Double Sharing</option>
              <option value="Triple">Triple Sharing</option>
            </select>

            <select 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.genderAllowed}
              onChange={(e) => setFilters(prev => ({ ...prev, genderAllowed: e.target.value }))}
            >
              <option value="">All Genders</option>
              <option value="male">Boys PG</option>
              <option value="female">Girls PG</option>
              <option value="both">Co-living</option>
            </select>

            <select 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
            >
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* PG Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPgs.map(pg => (
            <div
              key={pg._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handlePGClick(pg)}
            >
              {/* Image Container with Auto Carousel */}
              <div className="relative">
                <AutoImageCarousel
                  images={pg.images || []}
                  alt={pg.name}
                  className="h-48"
                  autoSlideInterval={4000}
                  showControls={true}
                  showDots={true}
                  type="pg"
                />
                
                {getDiscountBadge(pg)}
                
                {pg.featured && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold z-20">
                    FEATURED
                  </div>
                )}
                
                <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-20">
                  <FaEye /> {pg.analytics?.views || 0}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition line-clamp-1">
                    {pg.name}
                  </h3>
                  <button className="text-gray-400 hover:text-red-500 transition">
                    <FaHeart />
                  </button>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <FaMapMarkerAlt className="mr-1 text-red-500" />
                  <span className="text-sm">{pg.city}, {pg.state}</span>
                </div>

                {/* Rating */}
                {pg.rating?.overall > 0 && (
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {renderStars(pg.rating.overall)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {pg.rating.overall.toFixed(1)} ({pg.reviews?.total || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Amenities and Gender */}
                <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                  {pg.wifiAvailable && <FaWifi className="text-blue-500" title="WiFi" />}
                  {pg.parkingAvailable && <FaCar className="text-green-500" title="Parking" />}
                  {pg.foodIncluded && <FaUtensils className="text-orange-500" title="Food Included" />}
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{pg.pgType}</span>
                </div>

                {/* Gender Badge */}
                <div className="flex items-center gap-2 mb-3">
                  {pg.genderAllowed && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      pg.genderAllowed === 'male' 
                        ? 'bg-blue-100 text-blue-700' 
                        : pg.genderAllowed === 'female' 
                        ? 'bg-pink-100 text-pink-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {pg.genderAllowed === 'male' && <FaMale />}
                      {pg.genderAllowed === 'female' && <FaFemale />}
                      {(pg.genderAllowed === 'both' || pg.genderAllowed === 'unisex') && <FaUsers />}
                      <span className="capitalize">
                        {pg.genderAllowed === 'both' || pg.genderAllowed === 'unisex' 
                          ? 'Boys & Girls' 
                          : pg.genderAllowed === 'male' 
                          ? 'Boys Only' 
                          : 'Girls Only'
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">₹{pg.price?.toLocaleString()}</span>
                      {pg.originalPrice && pg.originalPrice > pg.price && (
                        <span className="text-sm text-gray-500 line-through">₹{pg.originalPrice?.toLocaleString()}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">per month</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600">{pg.availableRooms} available</div>
                    <div className="text-xs text-gray-500">of {pg.rooms} rooms</div>
                  </div>
                </div>

                {/* Highlights */}
                {pg.highlights && pg.highlights.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {pg.highlights.slice(0, 2).map((highlight, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
              onClick={() => navigate('/user/login')}
            >
              View All Properties & Book Now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PG;
