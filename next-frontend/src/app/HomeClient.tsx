"use client";
import React, { useState, useEffect } from 'react';
import { FaBuilding, FaHome, FaBed, FaCreditCard, FaStar, FaLock, FaMobileAlt, FaMapMarkerAlt, FaHeadset, FaUsers, FaShieldAlt, FaKey, FaWifi, FaCar, FaHotel } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';
import HorizontalCarousel from '@/components/HorizontalCarousel';
import CitySelectModal from '@/components/CitySelectModal';

// Utility function to shuffle array
function shuffleArray(array: any[]) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const HomePageLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

const HomeClient = () => {
  const [homeData, setHomeData] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Auto-change images every 4 seconds
  useEffect(() => {
    const { hero } = homeData || {};
    const heroImages = hero?.images || [hero?.image].filter(Boolean);
    
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % heroImages.length
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [homeData]);

  // Set page title
  useEffect(() => {
    document.title = 'Home | PG & Room Rental';
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await apiService.get('/api/home');
        setHomeData(data);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Home API error:', err);
        }
      }
    };

    fetchHomeData();
  }, []);

  // Check if user is logged in and fetch cities
  useEffect(() => {
    const checkAuthAndFetchCities = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          // Fetch cities for modal if user is not logged in
          const citiesData = await apiService.get('/api/cities');
          setCities(citiesData.cities || []);
          
          // Check if city is already selected in localStorage
          const savedCity = localStorage.getItem('selectedCity');
          if (!savedCity) {
            setShowCityModal(true);
          } else {
            setSelectedCity(JSON.parse(savedCity));
          }
        }
      } catch (err) {
        console.error('Error checking auth or fetching cities:', err);
        setIsLoggedIn(false);
      }
    };

    checkAuthAndFetchCities();
  }, []);

  // Screen size detection for responsive scrolling
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle city selection
  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', JSON.stringify(city));
    setShowCityModal(false);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowCityModal(false);
  };

  if (!homeData) {
    return <HomePageLoader />;
  }

  const { hero } = homeData;
  const heroImages = hero?.images || [hero?.image].filter(Boolean);
  const currentImage = heroImages[currentImageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {hero?.title || ''}
          </h1>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            {hero?.subtitle || ''}
          </p>
          
          {/* Selected City Display */}
          {selectedCity && (
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => setShowCityModal(true)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 border border-white/30 hover:border-white/50"
              >
                <span className="text-yellow-300">📍</span>
                <span>Currently viewing: {selectedCity.name}</span>
                <span className="text-sm opacity-75">• Click to change</span>
              </button>
            </div>
          )}
          
          {/* Hero Image Carousel */}
          <div className="relative mt-4">
            <img 
              src={currentImage} 
              alt="Image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextSibling) {
                  (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                }
              }}
              onLoad={(e) => {
                e.currentTarget.style.display = 'block';
                if (e.currentTarget.nextSibling) {
                  (e.currentTarget.nextSibling as HTMLElement).style.display = 'none';
                }
              }}
              className="mx-auto rounded-lg shadow-2xl w-full max-w-7xl object-cover transition-opacity duration-1000"
              style={{ 
                height: '350px',
                minHeight: '350px', 
                maxHeight: '350px',
                width: '100%',
                maxWidth: '1440px'
              }}
            />
            
            {/* Fallback when image fails to load */}
            <div 
              className="mx-auto rounded-lg shadow-2xl w-full max-w-7xl bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-semibold"
              style={{ 
                height: '350px',
                minHeight: '350px', 
                maxHeight: '350px',
                width: '100%',
                maxWidth: '1440px',
                display: 'none'
              }}
            >
              Image
            </div>
            
            {/* Image Indicators */}
            {heroImages.length > 1 && (
              <div className="flex justify-center mt-2 space-x-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {homeData.stats && homeData.stats.length > 0 && (
        <section className="py-15 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold mb-4 text-blue-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.stats?.title || ''}
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                {homeData.sectionHeaders?.stats?.subtitle || ''}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {homeData.stats.map((stat: any, idx: number) => {
                const getIconForStat = (label: string) => {
                  if (label.toLowerCase().includes('cities') || label.toLowerCase().includes('city')) return FaMapMarkerAlt;
                  if (label.toLowerCase().includes('support') || label.toLowerCase().includes('customer')) return FaHeadset;
                  if (label.toLowerCase().includes('rating') || label.toLowerCase().includes('star')) return FaStar;
                  if (label.toLowerCase().includes('properties') || label.toLowerCase().includes('verified')) return FaShieldAlt;
                  if (label.toLowerCase().includes('users') || label.toLowerCase().includes('user')) return FaUsers;
                  return FaStar;
                };
                
                const IconComponent = getIconForStat(stat.label);
                
                return (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center border-t-4 border-blue-500 hover:scale-105 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                      <IconComponent size={32} className="text-blue-600 group-hover:text-blue-700 transition-colors" />
                    </div>
                    
                    <div className="relative z-10 text-4xl font-extrabold text-blue-600 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {stat.value ?? 'N/A'}
                    </div>
                    
                    <div className="relative z-10 text-lg font-semibold text-gray-700 text-center group-hover:text-gray-800 transition-colors duration-300">
                      {stat.label ?? 'No label'}
                    </div>
                    
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-500 opacity-10 rounded-full transform -translate-x-6 translate-y-6 group-hover:scale-125 transition-transform duration-500"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured PGs Section */}
      {homeData.featuredPGs && homeData.featuredPGs.length > 0 && (
        <section className="py-15 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4 text-blue-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.pgs?.title || ''}
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                {homeData.sectionHeaders?.pgs?.subtitle || ''}
              </p>
            </div>
            
            <HorizontalCarousel autoScroll={true} scrollSpeed={40} showArrows={true}>
              {homeData.featuredPGs.slice(0, 20).map((item: any, idx: number) => (
                <div
                  key={`${item._id || idx}-${idx}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer overflow-hidden h-80"
                  onClick={() => router.push('/pg')}
                >
                  <div className="relative p-3 h-full flex flex-col">
                    {/* Card Image */}
                    <div className="w-full h-48 rounded-lg mb-2 overflow-hidden bg-gray-100">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0].url || item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextSibling) {
                              (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-full h-full flex flex-col items-center justify-center text-gray-400"
                        style={{ display: item.images && item.images.length > 0 ? 'none' : 'flex' }}
                      >
                        <FaBuilding size={32} className="mb-2" />
                        <span className="text-sm">No Image</span>
                      </div>
                    </div>
                    
                    {/* Line 1: Name and Rating */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-bold text-blue-700 group-hover:text-purple-700 transition mr-2 leading-4 line-clamp-2 max-w-[50%]">{item.name}</h3>
                      <div className="flex items-center">
                        {(typeof item.rating === 'object' && item.rating?.overall) || 
                         (typeof item.rating === 'number' && item.rating > 0) ? (
                          <div className="flex items-center">
                            <div className="flex mr-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const rating = typeof item.rating === 'object' && item.rating?.overall 
                                  ? item.rating.overall 
                                  : item.rating;
                                
                                if (star <= Math.floor(rating)) {
                                  // Full star
                                  return (
                                    <FaStar
                                      key={star}
                                      className="text-xs text-yellow-400"
                                    />
                                  );
                                } else if (star - 1 < rating && star > rating) {
                                  // Partial star
                                  return (
                                    <div key={star} className="relative text-xs">
                                      <FaStar className="text-gray-300" />
                                      <FaStar 
                                        className="absolute top-0 left-0 text-yellow-400"
                                        style={{ 
                                          clipPath: `inset(0 ${100 - ((rating - Math.floor(rating)) * 100)}% 0 0)` 
                                        }}
                                      />
                                    </div>
                                  );
                                } else {
                                  // Empty star
                                  return (
                                    <FaStar
                                      key={star}
                                      className="text-xs text-gray-300"
                                    />
                                  );
                                }
                              })}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">
                              {typeof item.rating === 'object' && item.rating?.overall 
                                ? item.rating.overall.toFixed(1) 
                                : item.rating.toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No Rating</span>
                        )}
                      </div>
                    </div>
                    {/* Line 2: Address and Price/month */}
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-gray-600 text-sm truncate flex-1 mr-2">{item.city}, {item.state}</p>
                      <div className="flex flex-col items-end">
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}/month</span>
                        )}
                        <span className="text-green-600 font-bold text-sm">₹{item.price}/month</span>
                      </div>
                    </div>
                    
                    {/* Badges */}  
                    <div className="absolute top-3 left-3">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow group-hover:bg-purple-600 transition">
                        PG
                      </div>
                    </div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                          UP TO {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </HorizontalCarousel>
          </div>
        </section>
      )}

      {/* Featured Rooms & Flats Section */}
      {homeData.featuredRooms && homeData.featuredRooms.length > 0 && (
        <section className="py-15 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4 text-purple-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.rooms?.title || ''}
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                {homeData.sectionHeaders?.rooms?.subtitle || ''}
              </p>
            </div>
            
            <HorizontalCarousel autoScroll={true} scrollSpeed={45} showArrows={true}>
              {homeData.featuredRooms.slice(0, 20).map((item: any, idx: number) => (
                <div
                  key={`${item._id || idx}-${idx}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer overflow-hidden h-80"
                  onClick={() => router.push('/rooms')}
                >
                  <div className="relative p-3 h-full flex flex-col">
                    {/* Card Image */}
                    <div className="w-full h-48 rounded-lg mb-2 overflow-hidden bg-gray-100">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0].url || item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextSibling) {
                              (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-full h-full flex flex-col items-center justify-center text-gray-400"
                        style={{ display: item.images && item.images.length > 0 ? 'none' : 'flex' }}
                      >
                        <FaHotel size={32} className="mb-2" />
                        <span className="text-sm">No Image</span>
                      </div>
                    </div>
                    
                    {/* Line 1: Name and Rating */}
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-bold text-blue-700 group-hover:text-purple-700 transition mr-2 leading-4 line-clamp-2 max-w-[50%]">{item.title || item.name}</h3>
                      <div className="flex items-center">
                        {(typeof item.rating === 'object' && item.rating?.overall) || 
                         (typeof item.rating === 'number' && item.rating > 0) ? (
                          <div className="flex items-center">
                            <div className="flex mr-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const rating = typeof item.rating === 'object' && item.rating?.overall 
                                  ? item.rating.overall 
                                  : item.rating;
                                
                                if (star <= Math.floor(rating)) {
                                  // Full star
                                  return (
                                    <FaStar
                                      key={star}
                                      className="text-xs text-yellow-400"
                                    />
                                  );
                                } else if (star - 1 < rating && star > rating) {
                                  // Partial star
                                  return (
                                    <div key={star} className="relative text-xs">
                                      <FaStar className="text-gray-300" />
                                      <FaStar 
                                        className="absolute top-0 left-0 text-yellow-400"
                                        style={{ 
                                          clipPath: `inset(0 ${100 - ((rating - Math.floor(rating)) * 100)}% 0 0)` 
                                        }}
                                      />
                                    </div>
                                  );
                                } else {
                                  // Empty star
                                  return (
                                    <FaStar
                                      key={star}
                                      className="text-xs text-gray-300"
                                    />
                                  );
                                }
                              })}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">
                              {typeof item.rating === 'object' && item.rating?.overall 
                                ? item.rating.overall.toFixed(1) 
                                : item.rating.toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No Rating</span>
                        )}
                      </div>
                    </div>
                    {/* Line 2: Address and Price/month */}
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-gray-600 text-sm truncate flex-1 mr-2">
                        {item.location || `${item.city}, ${item.state}`}
                      </p>
                      <div className="flex flex-col items-end">
                        {item.pricing?.originalPrice && item.pricing.originalPrice > (item.pricing?.rent || item.price) && (
                          <span className="text-xs text-gray-400 line-through">₹{item.pricing.originalPrice}/month</span>
                        )}
                        <span className="text-green-600 font-bold text-sm">
                          ₹{item.pricing?.rent || item.pricing?.monthlyRent || item.price}/month
                        </span>
                      </div>
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow group-hover:bg-purple-600 transition">
                        {item.propertyType || item.type || 'Room'}
                      </div>
                    </div>
                    {item.pricing?.originalPrice && item.pricing.originalPrice > (item.pricing?.rent || item.price) && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                          UP TO {Math.round(((item.pricing.originalPrice - (item.pricing?.rent || item.price)) / item.pricing.originalPrice) * 100)}% OFF
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </HorizontalCarousel>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {homeData.testimonials && homeData.testimonials.length > 0 && (
        <section className="py-15 bg-gradient-to-br from-green-50 to-teal-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold mb-4 text-green-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.testimonials?.title || ''}
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                {homeData.sectionHeaders?.testimonials?.subtitle || ''}
              </p>
            </div>
            
            <HorizontalCarousel autoScroll={true} scrollSpeed={35} showArrows={true}>
              {homeData.testimonials.map((review: any, idx: number) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="flex flex-col items-center text-center">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.name} className="w-16 h-16 rounded-full mb-4 object-cover shadow-md" />
                    ) : (
                      <span className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-md">
                        {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-blue-700 mb-1">{review.name || 'Anonymous'}</h3>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < (review.rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                      <span className="ml-2 text-gray-600 font-medium">{review.rating ?? 'N/A'}</span>
                    </div>
                    <p className="text-gray-700 text-center italic">"{review.review || review.text || 'No review provided.'}"</p>
                  </div>
                </div>
              ))}
            </HorizontalCarousel>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-cyan-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 text-indigo-900 tracking-tight drop-shadow">
              {homeData.sectionHeaders?.features?.title || homeData.features?.title || "Why Choose Our Platform"}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {homeData.sectionHeaders?.features?.subtitle || homeData.features?.subtitle || "Experience the best in PG accommodations and bike rentals with our comprehensive platform"}
            </p>
          </div>
          
          {(() => {
            const features = homeData.features?.items && Array.isArray(homeData.features.items) ? homeData.features.items : [];
            
            // Responsive scrolling logic for Features - Show all 6 cards on desktop
            const getFeaturesScrollThreshold = () => {
              if (screenSize === 'mobile') return 1;   // Mobile: >1 card = scroll
              if (screenSize === 'tablet') return 2;   // Tablet: >2 cards = scroll  
              return 6;                                // Desktop: >6 cards = scroll (show all 6)
            };
            
            const shouldScrollFeatures = features.length > getFeaturesScrollThreshold();
            
            const iconMap: { [key: string]: any } = {
              'home': FaHome,
              'bed': FaBed,
              'credit-card': FaCreditCard,
              'star': FaStar,
              'lock': FaLock,
              'mobile': FaMobileAlt,
              'building': FaBuilding,
              'hotel': FaHotel,
              'key': FaKey,
              'wifi': FaWifi,
              'car': FaCar
            };
            
            const FeatureCard = ({ feature, idx }: { feature: any, idx: number }) => {
              const IconComponent = iconMap[feature.icon] || FaStar;
              
              // Color mapping based on database color field - matching old frontend exactly
              const colorMap: { [key: string]: { border: string, bg: string, bgHover: string, text: string, title: string } } = {
                'blue': {
                  border: 'border-blue-500',
                  bg: 'bg-blue-100',
                  bgHover: 'group-hover:bg-blue-200',
                  text: 'text-blue-600',
                  title: 'text-blue-900'
                },
                'purple': {
                  border: 'border-purple-500',
                  bg: 'bg-purple-100',
                  bgHover: 'group-hover:bg-purple-200',
                  text: 'text-purple-600',
                  title: 'text-purple-900'
                },
                'green': {
                  border: 'border-green-500',
                  bg: 'bg-green-100',
                  bgHover: 'group-hover:bg-green-200',
                  text: 'text-green-600',
                  title: 'text-green-900'
                },
                'orange': {
                  border: 'border-orange-500',
                  bg: 'bg-orange-100',
                  bgHover: 'group-hover:bg-orange-200',
                  text: 'text-orange-600',
                  title: 'text-orange-900'
                },
                'pink': {
                  border: 'border-pink-500',
                  bg: 'bg-pink-100',
                  bgHover: 'group-hover:bg-pink-200',
                  text: 'text-pink-600',
                  title: 'text-pink-900'
                },
                'cyan': {
                  border: 'border-cyan-500',
                  bg: 'bg-cyan-100',
                  bgHover: 'group-hover:bg-cyan-200',
                  text: 'text-cyan-600',
                  title: 'text-cyan-900'
                }
              };
              
              const colors = colorMap[feature.color] || colorMap['blue']; // fallback to blue
              
              return (
                <div
                  key={idx}
                  className={`bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 ${colors.border} hover:scale-105 transition-transform duration-300 group`}
                >
                  <div className={`${colors.bg} p-4 rounded-full mb-6 ${colors.bgHover} transition`}>
                    <IconComponent size={40} className={colors.text} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${colors.title}`}>
                    {feature.title || "Feature"}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {feature.description || "Feature description"}
                  </p>
                </div>
              );
            };
            
            if (shouldScrollFeatures) {
              return (
                <div className="horizontal-carousel">
                  <div className="carousel-track">
                    {features.map((feature: any, idx: number) => (
                      <div key={idx} className="carousel-slide">
                        <FeatureCard feature={feature} idx={idx} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            } else {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8">
                  {features.map((feature: any, idx: number) => (
                    <FeatureCard key={idx} feature={feature} idx={idx} />
                  ))}
                </div>
              );
            }
          })()}
        </div>
      </section>

      {/* City Select Modal */}
      <CitySelectModal
        isOpen={showCityModal}
        onClose={handleModalClose}
        onCitySelect={handleCitySelect}
        cities={cities}
        currentCity={selectedCity}
      />
    </div>
  );
};

export default HomeClient;
