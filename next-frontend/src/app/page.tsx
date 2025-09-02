 
"use client";
import React, { useState, useEffect } from 'react';
import { FaBuilding, FaHome, FaBed, FaCreditCard, FaStar, FaLock, FaMobileAlt, FaMapMarkerAlt, FaHeadset, FaUsers, FaShieldAlt, FaKey, FaWifi, FaCar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';
import ScrollToTop, { useScrollToTop } from '@/components/ScrollToTop';

const HomePageLoader = () => <div className="flex justify-center items-center min-h-screen">Loading...</div>;

const Home = () => {
  const [homeData, setHomeData] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
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
            <h1 className="text-5xl font-bold mb-6">Welcome to StayWheels</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Find your perfect accommodation - from PG stays to individual rooms and complete flats. 
              Your ideal home is just a click away!
            </p>
            
            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div 
                onClick={() => router.push('/pg')}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105"
              >
                <FaBuilding className="text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">PG Accommodation</h3>
                <p className="text-white/80">Comfortable paying guest accommodations with all amenities</p>
              </div>
              
              <div 
                onClick={() => router.push('/rooms?propertyType=Room')}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105"
              >
                <FaBed className="text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Room Rental</h3>
                <p className="text-white/80">Individual rooms for students and working professionals</p>
              </div>
              
              <div 
                onClick={() => router.push('/rooms?propertyType=Flat')}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105"
              >
                <FaHome className="text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Flat Rental</h3>
                <p className="text-white/80">Complete apartments for families and groups</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive accommodation solutions for every need and budget
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBuilding className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Premium PGs</h3>
                <p className="text-gray-600">Fully furnished PG accommodations with modern amenities</p>
              </div>
              
              <div className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBed className="text-2xl text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Private Rooms</h3>
                <p className="text-gray-600">Individual rooms with privacy and comfort</p>
              </div>
              
              <div className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHome className="text-2xl text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Complete Flats</h3>
                <p className="text-gray-600">Spacious apartments for families and groups</p>
              </div>
              
              <div className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShieldAlt className="text-2xl text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Verified Properties</h3>
                <p className="text-gray-600">All properties are verified for safety and authenticity</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose StayWheels?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the best in accommodation rental with our comprehensive platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt className="text-2xl text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold">Prime Locations</h3>
                </div>
                <p className="text-gray-600">Properties in convenient locations with easy access to transportation and amenities</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <FaWifi className="text-2xl text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold">Modern Amenities</h3>
                </div>
                <p className="text-gray-600">High-speed internet, power backup, security, and other essential amenities</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <FaCreditCard className="text-2xl text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold">Easy Payments</h3>
                </div>
                <p className="text-gray-600">Flexible payment options with transparent pricing and no hidden charges</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <FaHeadset className="text-2xl text-orange-600 mr-3" />
                  <h3 className="text-lg font-semibold">24/7 Support</h3>
                </div>
                <p className="text-gray-600">Round-the-clock customer support for all your accommodation needs</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <FaLock className="text-2xl text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold">Secure Booking</h3>
                </div>
                <p className="text-gray-600">Safe and secure booking process with verified property owners</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <FaUsers className="text-2xl text-indigo-600 mr-3" />
                  <h3 className="text-lg font-semibold">Community Living</h3>
                </div>
                <p className="text-gray-600">Connect with like-minded individuals and build lasting relationships</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Home?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start your search today and discover comfortable, affordable accommodation options
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/pg')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse PGs
              </button>
              <button 
                onClick={() => router.push('/rooms')}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Find Rooms & Flats
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};


export default Home;
