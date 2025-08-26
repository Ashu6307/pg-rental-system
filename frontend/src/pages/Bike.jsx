import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaMotorcycle, 
  FaGasPump, 
  FaCog, 
  FaBolt,
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaEye,
  FaShieldAlt,
  FaSearch,
  FaHeart,
  FaStar
} from 'react-icons/fa';
import apiService from '../services/api';
import AutoImageCarousel from '../components/AutoImageCarousel';
import ScrollToTop, { useScrollToTop } from '../components/ScrollToTop';

const Bike = () => {
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    fuelType: '',
    sort: 'price_low'
  });
  const navigate = useNavigate();

  // Use ScrollToTop hook
  const scrollToTop = useScrollToTop({ behavior: 'smooth', enableMultiTiming: true });

  useEffect(() => {
    fetchBikes();
  }, [filters]);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        limit: 20
      }).toString();
      
      const response = await apiService.get(`/api/bikes/public?${queryParams}`);
      const data = response.data || response;
      
      setBikes(data.bikes || data || []);
      setFilteredBikes(data.bikes || data || []);
    } catch (error) {
      console.error('Bikes API error:', error);
      // Fallback to random endpoint
      try {
        const fallbackData = await apiService.get('/api/bikes/random');
        setBikes(Array.isArray(fallbackData) ? fallbackData : (fallbackData.bikes || []));
        setFilteredBikes(Array.isArray(fallbackData) ? fallbackData : (fallbackData.bikes || []));
      } catch (fallbackError) {
        console.error('Fallback API error:', fallbackError);
        setBikes([]);
        setFilteredBikes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    scrollToTop();
    navigate('/user/login');
  };

  const getDiscountBadge = (bike) => {
    if (bike.originalPrice && bike.originalPrice > bike.price_per_day) {
      const discount = Math.round(((bike.originalPrice - bike.price_per_day) / bike.originalPrice) * 100);
      return (
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-20">
          {discount}% OFF
        </div>
      );
    }
    return null;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case 'Electric':
        return <FaBolt className="text-green-500" title="Electric" />;
      case 'Petrol':
        return <FaGasPump className="text-blue-500" title="Petrol" />;
      case 'Diesel':
        return <FaGasPump className="text-orange-500" title="Diesel" />;
      default:
        return <FaGasPump className="text-gray-500" title="Fuel Type" />;
    }
  };

  const getTransmissionIcon = (transmission) => {
    return <FaCog className={transmission === 'Automatic' ? 'text-purple-500' : 'text-gray-500'} title={`${transmission} Transmission`} />;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
        size={12}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4">
          {/* Skeleton Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 mb-8 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-full p-3 w-16 h-16"></div>
              <div>
                <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-96"></div>
              </div>
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
      {/* ScrollToTop handles both auto-scroll and floating button */}
      <ScrollToTop 
        scrollOnMount={true} 
        behavior="smooth" 
        enableMultiTiming={true}
        showButton={true}
        theme="green"
        buttonPosition="bottom-right"
      />
      
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Attractive Gradient Header with Icon */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-full p-3 shadow-lg">
                  <FaMotorcycle size={40} className="text-purple-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
                    Premium Bike Rentals
                  </h1>
                  <p className="text-lg text-white/90">
                    Discover {filteredBikes.length} verified bikes with modern features
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Industry Trusted
                </span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Verified Vehicles
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
                placeholder="Search by brand, model, or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            {/* Quick Filters */}
            <select 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Standard">Standard</option>
              <option value="Sports">Sports</option>
              <option value="Scooter">Scooter</option>
              <option value="Electric">Electric</option>
            </select>

            <select 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.fuelType}
              onChange={(e) => handleFilterChange('fuelType', e.target.value)}
            >
              <option value="">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            <select 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Bikes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBikes.map(bike => {
            return (
            <div
              key={bike._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={handleClick}
            >
              {/* Image Container */}
              <div className="relative">
                <AutoImageCarousel 
                  images={bike.images || []}
                  alt={`${bike.brand} ${bike.model}`}
                  className="h-48"
                  autoSlideInterval={4000}
                  showControls={true}
                  showDots={true}
                  type="bike"
                />
                
                {getDiscountBadge(bike)}
                
                {/* View Count */}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-20" title="Total Views">
                  <FaEye /> {bike.analytics?.views || 0}
                </div>

                {/* Available Badge */}
                {bike.available && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-20">
                    AVAILABLE
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition line-clamp-1" title={`${bike.brand} ${bike.model}${bike.year ? ` (${bike.year})` : ''}${bike.color ? ` - ${bike.color}` : ''}`}>
                    {bike.brand} {bike.model}
                  </h3>
                  <button className="text-gray-400 hover:text-red-500 transition" title="Add to Favorites">
                    <FaHeart />
                  </button>
                </div>

                {/* Year and Color */}
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                  {bike.year && (
                    <span className="font-medium" title={`Manufacturing year: ${bike.year}`}>{bike.year}</span>
                  )}
                  {bike.color && (
                    <span title={`Bike color: ${bike.color}`}>• {bike.color}</span>
                  )}
                  {bike.type && (
                    <span title={`Bike type: ${bike.type}`}>• {bike.type}</span>
                  )}
                </div>

                {/* Rating */}
                {bike.analytics?.rating > 0 && (
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {renderStars(bike.analytics.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {bike.analytics.rating.toFixed(1)} ({bike.analytics.reviews || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Features */}
                <div className="flex items-center gap-3 mb-3 text-sm">
                  {getFuelIcon(bike.fuelType)}
                  {getTransmissionIcon(bike.transmission)}
                  {bike.cc !== undefined && bike.cc !== null && bike.cc > 0 && (
                    <div className="flex items-center gap-1 text-gray-600" title="Engine Capacity">
                      <span className="font-medium">{bike.cc}cc</span>
                    </div>
                  )}
                  {bike.mileage && (
                    <div className="flex items-center gap-1 text-gray-600" title="Mileage">
                      <FaTachometerAlt />
                      <span>{bike.mileage} {bike.fuelType === 'Electric' ? 'km/charge' : 'km/l'}</span>
                    </div>
                  )}
                  {bike.insurance?.validTill && new Date(bike.insurance.validTill) > new Date() && (
                    <FaShieldAlt 
                      className="text-green-500" 
                      title={`Insurance: ${bike.insurance.provider || 'Covered'} (Valid till ${new Date(bike.insurance.validTill).toLocaleDateString()})`} 
                    />
                  )}
                </div>

                {/* Fuel Type and Transmission Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bike.fuelType === 'Electric' 
                      ? 'bg-green-100 text-green-700' 
                      : bike.fuelType === 'Petrol'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {bike.fuelType}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {bike.transmission}
                  </span>
                </div>

                {/* Location */}
                {bike.location?.city && (
                  <div className="flex items-center text-gray-600 mb-3">
                    <FaMapMarkerAlt className="mr-1 text-red-500" title="Location" />
                    <span className="text-sm" title={`Location: ${bike.location.address || `${bike.location.city}, ${bike.location.state || ''}`}`}>{bike.location.city}</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600" title={`Daily rental: ₹${bike.price_per_day?.toLocaleString()}${bike.price_per_week ? ` | Weekly: ₹${bike.price_per_week}` : ''}`}>₹{bike.price_per_day?.toLocaleString()}</span>
                      {bike.originalPrice && bike.originalPrice > bike.price_per_day && (
                        <span className="text-sm text-gray-500 line-through" title={`Original price: ₹${bike.originalPrice?.toLocaleString()}/day`}>₹{bike.originalPrice?.toLocaleString()}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500" title="Daily rental rate">per day</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600" title={`Current status: ${bike.available ? 'Available for booking' : 'Currently booked'}`}>{bike.available ? 'Available' : 'Booked'}</div>
                    <span className="text-xs text-gray-500" title="Click to start booking process">Book Now</span>
                  </div>
                </div>

                {/* Features */}
                {bike.features && bike.features.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {bike.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200" title={`Key feature: ${feature}`}>
                          {feature}
                        </span>
                      ))}
                      {bike.features.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full" title={`Additional features: ${bike.features.slice(3).join(', ')}`}>
                          +{bike.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )})}
        </div>

        {/* No bikes message */}
        {filteredBikes.length === 0 && !loading && (
          <div className="text-center py-12">
            <FaMotorcycle size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bikes Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        )}

        {/* CTA Button */}
        {filteredBikes.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all text-lg tracking-wide"
              onClick={handleClick}
            >
              Book Your Perfect Bike Now →
            </button>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default Bike;
