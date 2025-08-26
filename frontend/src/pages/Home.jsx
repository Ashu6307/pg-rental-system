
// Utility function to shuffle array
function shuffleArray(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

import React, { useState, useEffect } from 'react';
import { FaBuilding, FaMotorcycle, FaHome, FaBicycle, FaCreditCard, FaStar, FaLock, FaMobileAlt, FaMapMarkerAlt, FaHeadset, FaUsers, FaShieldAlt } from 'react-icons/fa';
import { HomePageLoader } from '../components/loaders/LoaderExamples';
import apiService from '../services/api';
import ScrollToTop, { useScrollToTop } from '../components/ScrollToTop';



const Home = () => {
  const [homeData, setHomeData] = React.useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use ScrollToTop hook instead of custom scroll function
  const scrollToTop = useScrollToTop({ behavior: 'smooth', enableMultiTiming: true });

  // Auto-change images every 4 seconds
  useEffect(() => {
    const { hero } = homeData || {};
    const heroImages = hero?.images || [hero?.image].filter(Boolean);
    
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % heroImages.length
        );
      }, 4000); // Change every 4 seconds

      return () => clearInterval(interval);
    }
  }, [homeData]);

  React.useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await apiService.get('/api/home');
        setHomeData(data);
      } catch (err) {
        // Only show errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Home API error:', err);
        }
      }
    };

    fetchHomeData();
  }, []);

  if (!homeData) {
    return <HomePageLoader />;
  }

  const { hero } = homeData;

  // Get hero images array from database
  const heroImages = hero?.images || [hero?.image].filter(Boolean);
  const currentImage = heroImages[currentImageIndex];

  return (
    <>
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{hero?.title || 'Welcome to PG & Bike Rental'}</h1>
          <p className="text-xl mb-6 max-w-2xl mx-auto">{hero?.subtitle || 'Find your perfect PG accommodation and bike rental solution in one convenient platform'}</p>
          
          {/* Hero Image Carousel */}
          <div className="relative mt-4">
            <img 
              src={currentImage} 
              alt="Image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
              onLoad={(e) => {
                e.target.style.display = 'block';
                e.target.nextSibling.style.display = 'none';
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
      {homeData.stats && homeData.stats.length > 0 ? (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold mb-4 text-blue-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.stats?.title || "Our Achievements"}
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                {homeData.sectionHeaders?.stats?.subtitle || "Numbers that speak for our commitment to excellence"}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {homeData.stats.map((stat, idx) => {
                // Icon mapping for different stat types
                const getIconForStat = (label) => {
                  if (label.toLowerCase().includes('cities') || label.toLowerCase().includes('city')) return FaMapMarkerAlt;
                  if (label.toLowerCase().includes('support') || label.toLowerCase().includes('customer')) return FaHeadset;
                  if (label.toLowerCase().includes('rating') || label.toLowerCase().includes('star')) return FaStar;
                  if (label.toLowerCase().includes('properties') || label.toLowerCase().includes('verified')) return FaShieldAlt;
                  if (label.toLowerCase().includes('users') || label.toLowerCase().includes('user')) return FaUsers;
                  return FaStar; // default icon
                };
                
                const IconComponent = getIconForStat(stat.label);
                
                return (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center border-t-4 border-blue-500 hover:scale-105 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Icon */}
                    <div className="relative z-10 bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                      <IconComponent size={32} className="text-blue-600 group-hover:text-blue-700 transition-colors" />
                    </div>
                    
                    {/* Number */}
                    <div className="relative z-10 text-4xl font-extrabold text-blue-600 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {stat.value ?? 'N/A'}
                    </div>
                    
                    {/* Label */}
                    <div className="relative z-10 text-lg font-semibold text-gray-700 text-center group-hover:text-gray-800 transition-colors duration-300">
                      {stat.label ?? 'No label'}
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-500 opacity-10 rounded-full transform -translate-x-6 translate-y-6 group-hover:scale-125 transition-transform duration-500"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex justify-center items-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span className="text-blue-600 text-lg">Loading stats...</span>
          </div>
        </div>
      )}

      {/* PG Carousel - Infinite Scroll */}
      {homeData.featuredPGs && homeData.featuredPGs.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4 text-blue-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.pgs?.title || "PGs For You"}
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                {homeData.sectionHeaders?.pgs?.subtitle || "Discover comfortable and affordable PG accommodations tailored just for you"}
              </p>
            </div>
            <div className="carousel-container">
              <div className="carousel-track pg-carousel-track">
                {/* Duplicate items for infinite effect */}
                {[...homeData.featuredPGs, ...homeData.featuredPGs].map((item, idx) => (
                  <div
                    key={`${item._id || idx}-${idx}`}
                    className="carousel-item min-w-[280px] relative rounded-2xl p-4 cursor-pointer transition-all duration-300 group card-attractive"
                    onClick={() => {
                      scrollToTop();
                      setShowLoginModal(true);
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl card-gradient z-0"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-3 border-4 border-blue-200 group-hover:border-blue-400 transition-all duration-300 overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img 
                            src={item.images[0]?.url || item.images[0]} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <FaBuilding 
                          size={40} 
                          className="text-blue-400" 
                          style={{ display: item.images && item.images.length > 0 ? 'none' : 'block' }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-blue-700 mb-1 truncate group-hover:text-purple-700 transition">{item.name}</h3>
                      <p className="text-gray-500 mb-1 text-sm">{item.city}, {item.state}</p>
                      <span className="text-green-600 font-bold text-lg mb-2">₹{item.price}</span>
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow group-hover:bg-purple-600 transition">PG</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bike Carousel - Infinite Scroll */}
      {homeData.featuredBikes && homeData.featuredBikes.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4 text-purple-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.bikes?.title || "Bikes For You"}
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                {homeData.sectionHeaders?.bikes?.subtitle || "Find the perfect bike for your daily commute or weekend adventures"}
              </p>
            </div>
            <div className="carousel-container">
              <div className="carousel-track bike-carousel-track">
                {/* Duplicate items for infinite effect */}
                {[...homeData.featuredBikes, ...homeData.featuredBikes].map((item, idx) => (
                  <div
                    key={`${item._id || idx}-${idx}`}
                    className="carousel-item min-w-[280px] relative rounded-2xl p-4 cursor-pointer transition-all duration-300 group card-attractive"
                    onClick={() => {
                      scrollToTop();
                      setShowLoginModal(true);
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl card-gradient z-0"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-3 border-4 border-purple-200 group-hover:border-purple-400 transition-all duration-300">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.model} className="w-20 h-20 object-cover rounded-full" />
                        ) : (
                          <FaMotorcycle size={40} className="text-purple-400" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-blue-700 mb-1 truncate group-hover:text-pink-700 transition">{item.brand} {item.model}</h3>
                      <p className="text-gray-500 mb-1 text-sm">{item.type}, {item.color}</p>
                      <span className="text-green-600 font-bold text-lg mb-2">₹{item.price_per_day}</span>
                      <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow group-hover:bg-pink-600 transition">Bike</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section - Infinite Scroll */}
      {homeData.testimonials && homeData.testimonials.length > 0 ? (
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4 text-green-900 tracking-tight drop-shadow">
                {homeData.sectionHeaders?.testimonials?.title || "What Our Users Say"}
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                {homeData.sectionHeaders?.testimonials?.subtitle || "Real experiences from our satisfied customers who found their perfect PG and bike"}
              </p>
            </div>
            <div className="carousel-container">
              <div className="carousel-track testimonial-carousel-track">
                {/* Duplicate items for infinite effect */}
                {[...homeData.testimonials, ...homeData.testimonials].map((review, idx) => (
                  <div
                    key={`testimonial-${idx}`}
                    className="carousel-item min-w-[350px] bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-100"
                  >
                    {review.avatar ? (
                      <img
                      src={review.avatar}
                      alt={review.name || 'User'}
                      className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-blue-500"
                    />
                  ) : (
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4 border-2 border-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a8.25 8.25 0 1115 0v.75A2.25 2.25 0 0117.25 23h-10.5A2.25 2.25 0 014.5 21v-.75z" />
                    </svg>
                  </span>
                  )}
                  <h3 className="text-xl font-semibold text-blue-700 mb-1">{review.name || 'Anonymous'}</h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < (review.rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                    <span className="ml-2 text-gray-600 font-medium">{review.rating ?? 'N/A'}</span>
                  </div>
                  <p className="text-gray-700 text-center italic">"{review.text || 'No review provided.'}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </section>
      ) : (
        <div className="flex justify-center items-center mt-20">
          <span className="text-blue-600 text-lg">No testimonials available yet.</span>
        </div>
      )}

      {/* Marketing/Features Section */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeData.features?.items && Array.isArray(homeData.features.items) ? (
              homeData.features.items.map((feature, idx) => {
                // Icon mapping
                const iconMap = {
                  'home': FaHome,
                  'bicycle': FaBicycle,
                  'credit-card': FaCreditCard,
                  'star': FaStar,
                  'lock': FaLock,
                  'mobile': FaMobileAlt,
                  'building': FaBuilding,
                  'motorcycle': FaMotorcycle
                };
                
                // Fixed color mapping for Tailwind CSS
                const colorMap = {
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
                
                const IconComponent = iconMap[feature.icon] || FaStar;
                const colors = colorMap[feature.color] || colorMap['blue'];
                
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
              })
            ) : (
              // Fallback static features
              [
                {
                  icon: 'home',
                  color: 'blue',
                  title: 'Verified PGs',
                  description: 'All our PG accommodations are verified and inspected for quality, safety, and cleanliness standards.'
                },
                {
                  icon: 'bicycle',
                  color: 'purple',
                  title: 'Premium Bikes',
                  description: 'Well-maintained bikes with regular servicing, insurance coverage, and 24/7 roadside assistance.'
                },
                {
                  icon: 'credit-card',
                  color: 'green',
                  title: 'Secure Payments',
                  description: 'Safe and secure payment gateway with multiple payment options and instant booking confirmation.'
                },
                {
                  icon: 'star',
                  color: 'orange',
                  title: 'Best Prices',
                  description: 'Competitive pricing with no hidden charges, transparent billing, and flexible payment plans.'
                },
                {
                  icon: 'lock',
                  color: 'pink',
                  title: 'Safe & Secure',
                  description: 'Advanced security measures, background-verified owners, and comprehensive safety protocols.'
                },
                {
                  icon: 'mobile',
                  color: 'cyan',
                  title: 'Easy Booking',
                  description: 'Simple and intuitive booking process with instant confirmation and easy cancellation policies.'
                }
              ].map((feature, idx) => {
                const iconMap = {
                  'home': FaHome,
                  'bicycle': FaBicycle,
                  'credit-card': FaCreditCard,
                  'star': FaStar,
                  'lock': FaLock,
                  'mobile': FaMobileAlt
                };
                
                // Fixed color mapping for Tailwind CSS
                const colorMap = {
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
                
                const IconComponent = iconMap[feature.icon];
                const colors = colorMap[feature.color] || colorMap['blue'];
                
                return (
                  <div
                    key={idx}
                    className={`bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-4 ${colors.border} hover:scale-105 transition-transform duration-300 group`}
                  >
                    <div className={`${colors.bg} p-4 rounded-full mb-6 ${colors.bgHover} transition`}>
                      <IconComponent size={40} className={colors.text} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 ${colors.title}`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold mb-4 text-blue-700">Login Required</h3>
            <p className="mb-6 text-gray-600">Please login to view details and book your PG or Bike.</p>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={() => { scrollToTop(); window.location.href = '/login'; }}
            >Login</button>
            <button
              className="ml-4 px-6 py-2 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition"
              onClick={() => setShowLoginModal(false)}
            >Cancel</button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Home;
