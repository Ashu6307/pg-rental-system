import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api.js';
import UserNavbar from '../../components/UserNavbar.jsx';
import UserHeader from '../../components/UserHeader.jsx';
import UserFooter from '../../components/UserFooter.jsx';
import { 
  FaBuilding, FaMapMarkerAlt, FaStar, FaFilter, FaSearch, FaSort,
  FaArrowLeft, FaHeart, FaEye, FaWifi, FaCar, FaUtensils, FaShieldAlt,
  FaBed, FaBath, FaHome, FaUsers
} from 'react-icons/fa';

const BrowsePGs = () => {
  const [pgs, setPgs] = useState([]);
  const [filteredPGs, setFilteredPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [amenitiesFilter, setAmenitiesFilter] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const amenitiesList = [
    { key: 'wifi', icon: FaWifi, label: 'WiFi' },
    { key: 'parking', icon: FaCar, label: 'Parking' },
    { key: 'meals', icon: FaUtensils, label: 'Meals' },
    { key: 'security', icon: FaShieldAlt, label: '24/7 Security' },
    { key: 'ac', icon: FaHome, label: 'AC Rooms' },
    { key: 'laundry', icon: FaBath, label: 'Laundry' }
  ];

  useEffect(() => {
    fetchPGs();
  }, []);

  useEffect(() => {
    filterAndSortPGs();
  }, [pgs, searchLocation, priceRange, sortBy, amenitiesFilter]);

  const fetchPGs = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('/api/pgs/public');
      const pgData = Array.isArray(data) ? data : (data.pgs || []);
      setPgs(pgData);
    } catch (error) {
      console.error('PG API error:', error);
      setPgs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPGs = () => {
    let filtered = [...pgs];

    // Location filter
    if (searchLocation) {
      filtered = filtered.filter(pg => 
        pg.name?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        pg.address?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        pg.city?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        (typeof pg.location === 'string' && pg.location.toLowerCase().includes(searchLocation.toLowerCase()))
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(pg => Number(pg.price) >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(pg => Number(pg.price) <= Number(priceRange.max));
    }

    // Amenities filter
    if (amenitiesFilter.length > 0) {
      filtered = filtered.filter(pg => 
        amenitiesFilter.every(amenity => 
          pg.amenities?.includes(amenity) || pg.features?.includes(amenity)
        )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'rating':
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    setFilteredPGs(filtered);
  };

  const toggleAmenityFilter = (amenity) => {
    setAmenitiesFilter(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleFavorite = (pgId) => {
    setFavorites(prev => 
      prev.includes(pgId) 
        ? prev.filter(id => id !== pgId)
        : [...prev, pgId]
    );
  };

  const clearFilters = () => {
    setSearchLocation('');
    setPriceRange({ min: '', max: '' });
    setAmenitiesFilter([]);
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UserHeader />
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading PG accommodations...</p>
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
                  <h1 className="text-4xl font-bold mb-2">Browse PG Accommodations</h1>
                  <p className="text-blue-100 text-lg">Find your perfect home away from home</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-blue-100">
                <div className="flex items-center">
                  <FaBuilding className="mr-2" />
                  <span>{filteredPGs.length} Properties Available</span>
                </div>
                <div className="flex items-center">
                  <FaStar className="mr-2" />
                  <span>Verified Listings</span>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Location</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, area, or PG name..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-1/2 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-1/2 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button 
                  onClick={clearFilters}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Amenities Filter */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
              <div className="flex flex-wrap gap-3">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity.key}
                    onClick={() => toggleAmenityFilter(amenity.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                      amenitiesFilter.includes(amenity.key)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <amenity.icon className="text-sm" />
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PG Listings */}
          {filteredPGs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPGs.map((pg, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group">
                  <div className="relative">
                    <img 
                      src={pg.images?.[0] || '/api/placeholder/400/250'} 
                      alt={pg.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <button 
                      onClick={() => toggleFavorite(pg._id)}
                      className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    >
                      <FaHeart className={`${favorites.includes(pg._id) ? 'text-red-500' : 'text-gray-400'}`} />
                    </button>
                    
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm flex items-center">
                      <FaStar className="mr-1 text-yellow-400" />
                      {pg.rating || '4.2'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {pg.name}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-2 text-blue-600" />
                      <span className="text-sm">
                        {typeof pg.location === 'string' ? pg.location : pg.location?.address || pg.address || 'Location not available'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pg.description || 'Comfortable accommodation with modern amenities'}
                    </p>

                    {/* Amenities */}
                    {pg.amenities && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pg.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium">
                            {amenity}
                          </span>
                        ))}
                        {pg.amenities.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                            +{pg.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-green-600">₹{pg.price}</span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaBed className="text-gray-400" />
                        <span className="text-sm text-gray-600">{pg.rooms || 1} Rooms</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/user/pg-details/${pg._id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors text-center"
                      >
                        Book Now
                      </Link>
                      <Link 
                        to={`/user/pg-details/${pg._id}`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-3 rounded-xl transition-colors flex items-center justify-center"
                      >
                        <FaEye />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <FaBuilding className="text-gray-300 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No PGs Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                No PG accommodations match your current filters. Try adjusting your search criteria or location.
              </p>
              <button 
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Show All PGs
              </button>
            </div>
          )}
        </div>
      </main>

      <UserFooter />
    </div>
  );
};

export default BrowsePGs;
