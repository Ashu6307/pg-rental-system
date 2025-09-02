 
"use client";
import React, { useState, useEffect } from 'react';
import { FaBuilding, FaMotorcycle, FaHome, FaBicycle, FaCreditCard, FaStar, FaLock, FaMobileAlt, FaMapMarkerAlt, FaHeadset, FaUsers, FaShieldAlt } from 'react-icons/fa';
import apiService from '@/services/api';
import ScrollToTop, { useScrollToTop } from '@/components/ScrollToTop';

const HomePageLoader = () => <div className="flex justify-center items-center min-h-screen">Loading...</div>;

const Home = () => {
  const [homeData, setHomeData] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollToTop = useScrollToTop({ behavior: 'smooth', enableMultiTiming: true });

  useEffect(() => {
    const { hero } = homeData || {};
    const heroImages = hero?.images || [hero?.image].filter(Boolean);
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [homeData]);

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

  if (!homeData) {
    return <HomePageLoader />;
  }

  const { hero } = homeData;
  const heroImages = hero?.images || [hero?.image].filter(Boolean);
  const currentImage = heroImages[currentImageIndex];

  return (
    <>
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
                  (e.target as HTMLImageElement).style.display = 'none';
                  ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'flex';
                }}
                onLoad={(e) => {
                  (e.target as HTMLImageElement).style.display = 'block';
                  ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'none';
                }}
                className="mx-auto rounded-lg shadow-2xl w-full max-w-7xl object-cover transition-opacity duration-1000" 
                style={{ height: '350px', minHeight: '350px', maxHeight: '350px', width: '100%', maxWidth: '1440px' }} 
              />
              {/* Fallback when image fails to load */}
              <div 
                className="mx-auto rounded-lg shadow-2xl w-full max-w-7xl bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-semibold"
                style={{ height: '350px', minHeight: '350px', maxHeight: '350px', width: '100%', maxWidth: '1440px', display: 'none' }}
              >
                Image
              </div>
              {/* Image Indicators */}
              {heroImages.length > 1 && (
                <div className="flex justify-center mt-2 space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        {/* ...existing code for stats, carousels, testimonials, features... */}
      </div>
    </>
  );
};


export default Home;
