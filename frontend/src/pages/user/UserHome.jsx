import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import UserNavbar from '../../components/UserNavbar.jsx';
import UserHeader from '../../components/UserHeader.jsx';
import UserFooter from '../../components/UserFooter.jsx';
import { getOffers } from '../../services/offerService.js';
import apiService from '../../services/api.js';
import { FaHome, FaMotorcycle, FaBuilding, FaSearch, FaMapMarkerAlt, FaStar, FaCalendarAlt, FaGift, FaArrowRight, FaFilter, FaHeart, FaEye } from 'react-icons/fa';

const UserHome = () => {
  const [offers, setOffers] = useState([]);
  const [imageOffers, setImageOffers] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [bikes, setBikes] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, pgs, bikes
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchData();
  }, []);

  // Handle URL params for navigation
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'pgs') {
      setActiveTab('pgs');
      setTimeout(() => {
        const element = document.getElementById('pgs-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (tab === 'bikes') {
      setActiveTab('bikes');
      setTimeout(() => {
        const element = document.getElementById('bikes-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [offersRes, bikesRes, pgsRes] = await Promise.allSettled([
        getOffers().catch(() => []),
        apiService.get('/api/bikes/public').catch(() => []),
        apiService.get('/api/pgs/public').catch(() => [])
      ]);

      // Set offers
      const offersData = offersRes.status === 'fulfilled' ? offersRes.value : [];
      if (Array.isArray(offersData)) {
        setOffers(offersData.map(offer => offer.name || offer.description).filter(Boolean));
        setImageOffers(offersData.filter(offer => offer.images && offer.images.length > 0));
      }

      // Set bikes
      const bikesData = bikesRes.status === 'fulfilled' ? bikesRes.value : [];
      setBikes(Array.isArray(bikesData) ? bikesData : (bikesData.bikes || []));

      // Set PGs
      const pgsData = pgsRes.status === 'fulfilled' ? pgsRes.value : [];
      setPgs(Array.isArray(pgsData) ? pgsData : (pgsData.pgs || []));

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchOffers = async () => {
    try {
      const offersData = await getOffers();
      if (Array.isArray(offersData)) {
        setOffers(offersData.map(offer => offer.name || offer.description).filter(Boolean));
        setImageOffers(offersData.filter(offer => offer.images && offer.images.length > 0));
      }
    } catch (error) {
      console.warn('Offers not available:', error);
    }
  };

  return (
    <>
      <UserNavbar />
      <UserHeader />
      
      {/* Offers Marquee */}
      {offers && offers.length > 0 && (
        <div className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 py-3">
          <marquee behavior="scroll" direction="left" scrollamount="6" className="text-white font-semibold text-lg">
            🎉 {offers.join(' • ')} 🎉
          </marquee>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Find Your Perfect <span className="text-blue-600">PG</span> & <span className="text-green-600">Bike</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Discover comfortable accommodations and reliable bike rentals at your fingertips. 
              Book instantly with our trusted platform.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter location (e.g., Pune, Mumbai, Delhi)"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center">
                  <FaSearch className="mr-2" />
                  Search
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div 
                onClick={() => {
                  setActiveTab('pgs');
                  setTimeout(() => {
                    const element = document.getElementById('pgs-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <FaBuilding className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Browse PGs</h3>
                <p className="text-gray-600 mb-4">Find comfortable paying guest accommodations</p>
                <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700">
                  Explore PGs <FaArrowRight className="ml-2" />
                </div>
              </div>

              <div 
                onClick={() => {
                  setActiveTab('bikes');
                  setTimeout(() => {
                    const element = document.getElementById('bikes-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <FaMotorcycle className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Rent Bikes</h3>
                <p className="text-gray-600 mb-4">Choose from a variety of bikes for rent</p>
                <div className="flex items-center justify-center text-green-600 font-semibold group-hover:text-green-700">
                  Browse Bikes <FaArrowRight className="ml-2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Offers */}
        {imageOffers && imageOffers.length > 0 && (
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  <FaGift className="inline mr-3 text-red-500" />
                  Special Offers
                </h2>
                <p className="text-xl text-gray-600">Limited time deals just for you!</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {imageOffers.slice(0, 3).map((offer, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                    <div className="relative">
                      {offer.images && offer.images[0] && (
                        <img 
                          src={offer.images[0]} 
                          alt={offer.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                        LIMITED
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {offer.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {offer.description}
                      </p>
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
                        Claim Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {imageOffers.length > 3 && (
                <div className="text-center mt-8">
                  <Link to="/user/dashboard?tab=offers" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                    View All Offers
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
              <p className="text-xl text-gray-600">Experience the best in PG and bike rental services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Verified Properties</h3>
                <p className="text-gray-600">All PGs and bikes are verified for quality and safety</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="text-green-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Instant Booking</h3>
                <p className="text-gray-600">Book your PG or bike instantly with our easy platform</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGift className="text-purple-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Best Prices</h3>
                <p className="text-gray-600">Competitive prices with exclusive offers and discounts</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8">Join thousands of satisfied customers who trust our platform</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setActiveTab('pgs');
                  setTimeout(() => {
                    const element = document.getElementById('pgs-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Find PG Accommodation
              </button>
              <button 
                onClick={() => {
                  setActiveTab('bikes');
                  setTimeout(() => {
                    const element = document.getElementById('bikes-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Rent a Bike
              </button>
            </div>
          </div>
        </section>

        {/* Complete Listings Section */}
        <section id="listings-section" className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-xl p-1 flex">
                <button
                  onClick={() => {
                    setActiveTab('all');
                    // No need to scroll since we're already in the listings section
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'all' 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  All Listings
                </button>
                <button
                  onClick={() => {
                    setActiveTab('pgs');
                    setTimeout(() => {
                      const element = document.getElementById('pgs-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'pgs' 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <FaBuilding className="inline mr-2" />
                  PG Accommodation ({pgs.length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('bikes');
                    setTimeout(() => {
                      const element = document.getElementById('bikes-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'bikes' 
                      ? 'bg-white text-green-600 shadow-md' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <FaMotorcycle className="inline mr-2" />
                  Bike Rentals ({bikes.length})
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location, name, or features..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center">
                  <FaFilter className="mr-2" />
                  Filters
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading listings...</p>
              </div>
            ) : (
              <>
                {/* PG Listings */}
                {(activeTab === 'all' || activeTab === 'pgs') && (
                  <div id="pgs-section" className="mb-12">
                    <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                      <FaBuilding className="mr-3 text-blue-600" />
                      PG Accommodation
                    </h3>
                    {pgs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {pgs.map((pg, index) => (
                          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <div className="relative">
                              <img 
                                src={pg.image || '/api/placeholder/300/200'} 
                                alt={pg.name}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-red-50">
                                <FaHeart className="text-gray-400 hover:text-red-500" />
                              </div>
                              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                                ⭐ {pg.rating || '4.2'}
                              </div>
                            </div>
                            <div className="p-6">
                              <h4 className="text-xl font-bold text-gray-800 mb-2">{pg.name}</h4>
                              <p className="text-gray-600 text-sm mb-3 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                                {typeof pg.location === 'string' ? pg.location : pg.location?.address || 'Location not available'}
                              </p>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {pg.description}
                              </p>
                              <div className="flex justify-between items-center mb-4">
                                <div>
                                  <span className="text-2xl font-bold text-green-600">₹{pg.price}</span>
                                  <span className="text-gray-500 text-sm">/month</span>
                                </div>
                                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                                  {pg.type || 'PG'}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                                  Book Now
                                </button>
                                <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                  <FaEye />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <FaBuilding className="mx-auto text-gray-300 text-6xl mb-4" />
                        <p className="text-gray-500 text-lg">No PG listings available at the moment</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Bike Listings */}
                {(activeTab === 'all' || activeTab === 'bikes') && (
                  <div id="bikes-section">
                    <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                      <FaMotorcycle className="mr-3 text-green-600" />
                      Bike Rentals
                    </h3>
                    {bikes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {bikes.map((bike, index) => (
                          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <div className="relative">
                              <img 
                                src={bike.image || '/api/placeholder/300/200'} 
                                alt={bike.name}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-red-50">
                                <FaHeart className="text-gray-400 hover:text-red-500" />
                              </div>
                              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                                ⭐ {bike.rating || '4.5'}
                              </div>
                            </div>
                            <div className="p-6">
                              <h4 className="text-xl font-bold text-gray-800 mb-2">{bike.name}</h4>
                              <p className="text-gray-600 text-sm mb-3 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-green-600" />
                                {typeof bike.location === 'string' ? bike.location : bike.location?.address || 'Location not available'}
                              </p>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {bike.description}
                              </p>
                              <div className="flex justify-between items-center mb-4">
                                <div>
                                  <span className="text-2xl font-bold text-green-600">₹{bike.price}</span>
                                  <span className="text-gray-500 text-sm">/day</span>
                                </div>
                                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                                  {bike.type || 'Bike'}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                                  Rent Now
                                </button>
                                <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                  <FaEye />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <FaMotorcycle className="mx-auto text-gray-300 text-6xl mb-4" />
                        <p className="text-gray-500 text-lg">No bike listings available at the moment</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <UserFooter />
    </>
  );
};

export default UserHome;
