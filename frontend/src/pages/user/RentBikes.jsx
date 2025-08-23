import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api.js';
import UserNavbar from '../../components/UserNavbar.jsx';
import UserHeader from '../../components/UserHeader.jsx';
import UserFooter from '../../components/UserFooter.jsx';
import { 
  FaMotorcycle, FaMapMarkerAlt, FaStar, FaFilter, FaSearch, FaSort,
  FaArrowLeft, FaHeart, FaEye, FaGasPump, FaShieldAlt, FaUsers,
  FaTachometerAlt, FaCog, FaBolt
} from 'react-icons/fa';

const RentBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [bikeTypeFilter, setBikeTypeFilter] = useState('all');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('all');
  const [favorites, setFavorites] = useState([]);

  const bikeTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'sports', label: 'Sports Bike' },
    { value: 'cruiser', label: 'Cruiser' },
    { value: 'electric', label: 'Electric' }
  ];

  const fuelTypes = [
    { value: 'all', label: 'All Fuel Types' },
    { value: 'petrol', label: 'Petrol' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    filterAndSortBikes();
  }, [bikes, searchLocation, priceRange, sortBy, bikeTypeFilter, fuelTypeFilter]);

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('/api/bikes/public');
      const bikeData = Array.isArray(data) ? data : (data.bikes || []);
      setBikes(bikeData);
    } catch (error) {
      console.error('Bike API error:', error);
      setBikes([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBikes = () => {
    let filtered = [...bikes];

    // Location filter
    if (searchLocation) {
      filtered = filtered.filter(bike => 
        bike.name?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        bike.brand?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        bike.model?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        (typeof bike.location === 'string' && bike.location.toLowerCase().includes(searchLocation.toLowerCase()))
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(bike => Number(bike.price) >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(bike => Number(bike.price) <= Number(priceRange.max));
    }

    // Bike type filter
    if (bikeTypeFilter !== 'all') {
      filtered = filtered.filter(bike => 
        bike.type?.toLowerCase() === bikeTypeFilter.toLowerCase() ||
        bike.category?.toLowerCase() === bikeTypeFilter.toLowerCase()
      );
    }

    // Fuel type filter
    if (fuelTypeFilter !== 'all') {
      filtered = filtered.filter(bike => 
        bike.fuelType?.toLowerCase() === fuelTypeFilter.toLowerCase()
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

    setFilteredBikes(filtered);
  };

  const toggleFavorite = (bikeId) => {
    setFavorites(prev => 
      prev.includes(bikeId) 
        ? prev.filter(id => id !== bikeId)
        : [...prev, bikeId]
    );
  };

  const clearFilters = () => {
    setSearchLocation('');
    setPriceRange({ min: '', max: '' });
    setBikeTypeFilter('all');
    setFuelTypeFilter('all');
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UserHeader />
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading bike rentals...</p>
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-teal-50 flex flex-col">
      <UserHeader />
      <UserNavbar />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <Link 
                  to="/user/dashboard" 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-xl mr-4 transition-all duration-300 hover:scale-105"
                >
                  <FaArrowLeft className="text-xl" />
                </Link>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Rent Premium Bikes</h1>
                  <p className="text-green-100 text-lg">Choose from our wide range of premium motorcycles and scooters</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-green-100">
                <div className="flex items-center">
                  <FaMotorcycle className="mr-2" />
                  <span>{filteredBikes.length} Bikes Available</span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="mr-2" />
                  <span>Verified & Insured</span>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Brand, model, or location..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price/Day (₹)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-1/2 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-1/2 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Bike Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bike Type</label>
                <select
                  value={bikeTypeFilter}
                  onChange={(e) => setBikeTypeFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {bikeTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
          </div>

          {/* Bike Listings */}
          {filteredBikes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBikes.map((bike, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group">
                  <div className="relative">
                    <img 
                      src={bike.images?.[0] || '/api/placeholder/400/250'} 
                      alt={bike.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <button 
                      onClick={() => toggleFavorite(bike._id)}
                      className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    >
                      <FaHeart className={`${favorites.includes(bike._id) ? 'text-red-500' : 'text-gray-400'}`} />
                    </button>
                    
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm flex items-center">
                      <FaStar className="mr-1 text-yellow-400" />
                      {bike.rating || '4.5'}
                    </div>

                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {bike.available ? 'Available' : 'Booked'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                        {bike.name}
                      </h3>
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-xs font-medium">
                        {bike.type || 'Bike'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-2 text-green-600" />
                      <span className="text-sm">
                        {typeof bike.location === 'string' ? bike.location : bike.location?.address || 'Location not available'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {bike.description || 'Premium bike with excellent performance and comfort'}
                    </p>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {bike.engine && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaCog className="mr-2 text-green-600" />
                          <span>{bike.engine}cc</span>
                        </div>
                      )}
                      {bike.fuelType && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaGasPump className="mr-2 text-green-600" />
                          <span>{bike.fuelType}</span>
                        </div>
                      )}
                      {bike.mileage && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaTachometerAlt className="mr-2 text-green-600" />
                          <span>{bike.mileage} km/l</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <FaShieldAlt className="mr-2 text-green-600" />
                        <span>Insured</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-green-600">₹{bike.price}</span>
                        <span className="text-gray-500 text-sm">/day</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaUsers />
                        <span>{bike.seatingCapacity || '2'} seats</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/user/bike-details/${bike._id}`}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors text-center"
                      >
                        Rent Now
                      </Link>
                      <Link 
                        to={`/user/bike-details/${bike._id}`}
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
              <FaMotorcycle className="text-gray-300 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Bikes Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                No bikes match your current filters. Try adjusting your search criteria or location.
              </p>
              <button 
                onClick={clearFilters}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Show All Bikes
              </button>
            </div>
          )}
        </div>
      </main>

      <UserFooter />
    </div>
  );
};

export default RentBikes;
